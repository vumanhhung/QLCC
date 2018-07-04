import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { KhuVucService } from "../../services/khuvuc.service";
import { KhuVuc } from "../../models/khuvuc.model";
import { KhuVucInfoComponent } from "./khuvuc-info.component";

@Component({
    selector: "khuvuc",
    templateUrl: "./khuvuc.component.html",
    styleUrls: ["./khuvuc.component.css"]
})

export class KhuVucComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: KhuVuc[] = [];
    rowsCache: KhuVuc[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    khuvucEdit: KhuVuc;
    sourcekhuvuc: KhuVuc;
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

    @ViewChild('khuvucEditor')
    KhuVucEditor: KhuVucInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private khuvucService: KhuVucService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenKhuVuc', name: gT('Tên khu vực')},
			{ prop: 'dienGiai', name: gT('Mô tả')},
            { name: gT('matbang.qlmb_chucnang'), width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow"}
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.KhuVucEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.KhuVucEditor.changesCancelledCallback = () => {
            this.khuvucEdit = null;
            this.sourcekhuvuc = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcekhuvuc) {
            Object.assign(this.sourcekhuvuc, this.khuvucEdit);
            this.khuvucEdit = null;
            this.sourcekhuvuc = null;
        }
        else {
            let objKhuVuc = new KhuVuc();
            Object.assign(objKhuVuc, this.khuvucEdit);
            this.khuvucEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objKhuVuc).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objKhuVuc);
            this.rows.splice(0, 0, objKhuVuc);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.khuvucService.getAllKhuVuc().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: KhuVuc[]) {
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
        this.KhuVucEditor.resetForm(true);
    }

    newKhuVuc() {
        this.editingRowName = null;
        this.sourcekhuvuc = null;
        this.khuvucEdit = this.KhuVucEditor.newKhuVuc();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.khuVucId,r.tenKhuVuc,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteKhuVuc(row: KhuVuc) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: KhuVuc) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.khuvucService.deleteKhuVuc(row.khuVucId)
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

    editKhuVuc(row: KhuVuc) {
        this.editingRowName = { name: row.tenKhuVuc };
        this.sourcekhuvuc = row;
        this.khuvucEdit = this.KhuVucEditor.editKhuVuc(row);
        this.editorModal.show();
    }    
}