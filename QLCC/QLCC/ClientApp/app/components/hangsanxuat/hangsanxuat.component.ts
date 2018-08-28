import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { HangSanXuatService } from "../../services/hangsanxuat.service";
import { HangSanXuat } from "../../models/hangsanxuat.model";
import { HangSanXuatInfoComponent } from "./hangsanxuat-info.component";

@Component({
    selector: "hangsanxuat",
    templateUrl: "./hangsanxuat.component.html",
    styleUrls: ["./hangsanxuat.component.css"]
})

export class HangSanXuatComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: HangSanXuat[] = [];
    rowsCache: HangSanXuat[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    hangsanxuatEdit: HangSanXuat;
    sourcehangsanxuat: HangSanXuat;
    public selectedGropup: number = 0;
    editingRowName: { name: string };

    @ViewChild('f')
    private form;

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('nameTemplate')
    nameTemplate: TemplateRef<any>;

    @ViewChild('statusTemplate')
    statusTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('hangsanxuatEditor')
    HangSanXuatEditor: HangSanXuatInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private hangsanxuatService: HangSanXuatService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
            { prop: 'tenHangSanXuat', name: gT('Tên Hãng')},
            { prop: 'kyHieu', name: gT('Ký Hiệu') },
            { prop: 'dienGiai', name: gT('Trạng Thái'), cellTemplate: this.statusTemplate },
            { name: gT('Chức năng'), width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData(0);
    }
    
    ngAfterViewInit() {
        this.HangSanXuatEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.HangSanXuatEditor.editorModal.hide();
        };

        this.HangSanXuatEditor.changesCancelledCallback = () => {
            this.hangsanxuatEdit = null;
            this.sourcehangsanxuat = null;
            this.HangSanXuatEditor.editorModal.hide();
        };
    }
    
    addNewToList() {
        this.loadData(0);
        if (this.sourcehangsanxuat) {
            Object.assign(this.sourcehangsanxuat, this.hangsanxuatEdit);
            this.hangsanxuatEdit = null;
            this.sourcehangsanxuat = null;
        }
        else {
            let objHangSanXuat = new HangSanXuat();
            Object.assign(objHangSanXuat, this.hangsanxuatEdit);
            this.hangsanxuatEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objHangSanXuat).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objHangSanXuat);
            this.rows.splice(0, 0, objHangSanXuat);
        }
    }
    
    loadData(status: number) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        if (status > 0) {
            if (status == 1) {
                this.hangsanxuatService.getFilterStatus(true).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
            } else if (status == 2) {
                this.hangsanxuatService.getFilterStatus(false).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
            }
        } else if (status == 0) {
            this.hangsanxuatService.getAllHangSanXuat().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
        }       
    }
    
    onDataLoadSuccessful(obj: HangSanXuat[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        obj.forEach((item, index, obj) => {
            (<any>item).index = index + 1;
        });

        this.rowsCache = [...obj];
        this.rows = obj;
    }
    
    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }
    
    onEditorModalHidden() {
        this.editingRowName = null;
        this.HangSanXuatEditor.resetForm(true);
    }

    newHangSanXuat() {
        this.editingRowName = null;
        this.sourcehangsanxuat = null;
        this.HangSanXuatEditor.isViewDetails = false;
        this.hangsanxuatEdit = this.HangSanXuatEditor.newHangSanXuat();
        this.HangSanXuatEditor.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.tenHangSanXuat,r.kyHieu));
    }

    deleteHangSanXuat(row: HangSanXuat) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: HangSanXuat) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.hangsanxuatService.deleteHangSanXuat(row.hangSanXuatId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
                this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }

    editHangSanXuat(row: HangSanXuat) {
        this.editingRowName = { name: row.tenHangSanXuat };
        this.sourcehangsanxuat = row;
        this.HangSanXuatEditor.isViewDetails = false;
        this.HangSanXuatEditor.checkTen = true;
        this.hangsanxuatEdit = this.HangSanXuatEditor.editHangSanXuat(row);
        this.HangSanXuatEditor.editorModal.show();
    }

    viewHangSanXuat(row: HangSanXuat) {
        this.editingRowName = { name: row.tenHangSanXuat };
        this.sourcehangsanxuat = row;
        this.hangsanxuatEdit = this.HangSanXuatEditor.editHangSanXuat(row);
        this.HangSanXuatEditor.isViewDetails = true;
        this.HangSanXuatEditor.editorModal.show();
    }    

    SelectedStatusValue(status?: number) {
        this.loadData(status);
    }
}