import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { TrangThaiYeuCauService } from "../../services/trangthaiyeucau.service";
import { TrangThaiYeuCau } from "../../models/trangthaiyeucau.model";
import { TrangThaiYeuCauInfoComponent } from "./trangthaiyeucau-info.component";

@Component({
    selector: "trangthaiyeucau",
    templateUrl: "./trangthaiyeucau.component.html",
    styleUrls: ["./trangthaiyeucau.component.css"]
})

export class TrangThaiYeuCauComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: TrangThaiYeuCau[] = [];
    rowsCache: TrangThaiYeuCau[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    trangthaiyeucauEdit: TrangThaiYeuCau;
    sourcetrangthaiyeucau: TrangThaiYeuCau;
    editingRowName: { name: string };

    @ViewChild('f')
    private form;

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('nameTemplate')
    nameTemplate: TemplateRef<any>;

    @ViewChild('descriptionTemplate')
    descriptionTemplate: TemplateRef<any>;

    @ViewChild('BackGroundTemplate')
    BackGroundTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('trangthaiyeucauEditor')
    TrangThaiYeuCauEditor: TrangThaiYeuCauInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private trangthaiyeucauService: TrangThaiYeuCauService) {
    }

    SetBackground(row: TrangThaiYeuCau) {
        let styles = {
            'background': row.mauNen,
            'width': '130px',
            'height': '30px',
            'text-align': 'center'
        };
        return styles;
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
            { prop: 'tenTrangThaiYeuCau', name: 'Tên trạng thái' },
            { name: 'Màu nền', cellTemplate: this.BackGroundTemplate, canAutoResize: false },			
            { name: 'Chức năng', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.TrangThaiYeuCauEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.TrangThaiYeuCauEditor.changesCancelledCallback = () => {
            this.trangthaiyeucauEdit = null;
            this.sourcetrangthaiyeucau = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcetrangthaiyeucau) {
            Object.assign(this.sourcetrangthaiyeucau, this.trangthaiyeucauEdit);
            this.trangthaiyeucauEdit = null;
            this.sourcetrangthaiyeucau = null;
        }
        else {
            let objTrangThaiYeuCau = new TrangThaiYeuCau();
            Object.assign(objTrangThaiYeuCau, this.trangthaiyeucauEdit);
            this.trangthaiyeucauEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objTrangThaiYeuCau).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objTrangThaiYeuCau);
            this.rows.splice(0, 0, objTrangThaiYeuCau);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.trangthaiyeucauService.getAllTrangThaiYeuCau().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: TrangThaiYeuCau[]) {
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
        this.TrangThaiYeuCauEditor.resetForm(true);
    }

    newTrangThaiYeuCau() {
        this.editingRowName = null;
        this.sourcetrangthaiyeucau = null;
        this.trangthaiyeucauEdit = this.TrangThaiYeuCauEditor.newTrangThaiYeuCau();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.trangThaiYeuCauId,r.tenTrangThaiYeuCau,r.mauNen,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteTrangThaiYeuCau(row: TrangThaiYeuCau) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: TrangThaiYeuCau) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.trangthaiyeucauService.deleteTrangThaiYeuCau(row.trangThaiYeuCauId)
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

    editTrangThaiYeuCau(row: TrangThaiYeuCau) {
        this.editingRowName = { name: row.tenTrangThaiYeuCau };
        this.sourcetrangthaiyeucau = row;
        this.trangthaiyeucauEdit = this.TrangThaiYeuCauEditor.editTrangThaiYeuCau(row);
        this.editorModal.show();
    }    
}