import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { LoaiYeuCauService } from "../../services/loaiyeucau.service";
import { LoaiYeuCau } from "../../models/loaiyeucau.model";
import { LoaiYeuCauInfoComponent } from "./loaiyeucau-info.component";

@Component({
    selector: "loaiyeucau",
    templateUrl: "./loaiyeucau.component.html",
    styleUrls: ["./loaiyeucau.component.css"]
})

export class LoaiYeuCauComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: LoaiYeuCau[] = [];
    rowsCache: LoaiYeuCau[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    loaiyeucauEdit: LoaiYeuCau;
    sourceloaiyeucau: LoaiYeuCau;
    editingRowName: { name: string };

    @ViewChild('f')
    private form;

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('nameTemplate')
    nameTemplate: TemplateRef<any>;

    @ViewChild('descriptionTemplate')
    descriptionTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('loaiyeucauEditor')
    LoaiYeuCauEditor: LoaiYeuCauInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private loaiyeucauService: LoaiYeuCauService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenLoaiYeuCau', name: gT('Tên loại yêu cầu')},
			{ prop: 'kyHieu', name: gT('Ký hiệu')},
			{ prop: 'dienGiai', name: gT('Mô tả')},
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.LoaiYeuCauEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.LoaiYeuCauEditor.changesCancelledCallback = () => {
            this.loaiyeucauEdit = null;
            this.sourceloaiyeucau = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourceloaiyeucau) {
            Object.assign(this.sourceloaiyeucau, this.loaiyeucauEdit);
            this.loaiyeucauEdit = null;
            this.sourceloaiyeucau = null;
        }
        else {
            let objLoaiYeuCau = new LoaiYeuCau();
            Object.assign(objLoaiYeuCau, this.loaiyeucauEdit);
            this.loaiyeucauEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objLoaiYeuCau).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objLoaiYeuCau);
            this.rows.splice(0, 0, objLoaiYeuCau);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.loaiyeucauService.getAllLoaiYeuCau().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: LoaiYeuCau[]) {
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
        this.LoaiYeuCauEditor.resetForm(true);
    }

    newLoaiYeuCau() {
        this.editingRowName = null;
        this.sourceloaiyeucau = null;
        this.loaiyeucauEdit = this.LoaiYeuCauEditor.newLoaiYeuCau();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.loaiYeuCauId,r.tenLoaiYeuCau,r.kyHieu,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteLoaiYeuCau(row: LoaiYeuCau) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: LoaiYeuCau) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.loaiyeucauService.deleteLoaiYeuCau(row.loaiYeuCauId)
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

    editLoaiYeuCau(row: LoaiYeuCau) {
        this.editingRowName = { name: row.tenLoaiYeuCau };
        this.sourceloaiyeucau = row;
        this.loaiyeucauEdit = this.LoaiYeuCauEditor.editLoaiYeuCau(row);
        this.editorModal.show();
    }    
}