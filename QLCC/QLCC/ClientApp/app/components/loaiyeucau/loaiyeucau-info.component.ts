import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { LoaiYeuCau } from "../../models/loaiyeucau.model";
import { LoaiYeuCauService } from "./../../services/loaiyeucau.service";

@Component({
    selector: "loaiyeucau-info",
    templateUrl: "./loaiyeucau-info.component.html",
    styleUrls: ["./loaiyeucau-info.component.css"]
})

export class LoaiYeuCauInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private LoaiYeuCauEdit: LoaiYeuCau = new LoaiYeuCau();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    
    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;
    
    constructor(private alertService: AlertService, private gvService: LoaiYeuCauService) {
    }
    
    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getLoaiYeuCauByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    
    private onDataLoadSuccessful(obj: LoaiYeuCau) {
        this.alertService.stopLoadingMessage();
    }

    private onCurrentUserDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    resetForm(replace = false) {

        if (!replace) {
            this.form.reset();
        }
        else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }
    
    private cancel() {
        this.LoaiYeuCauEdit = new LoaiYeuCau();
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    private save() {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");        
        if (this.isNew) {
            this.gvService.addnewLoaiYeuCau(this.LoaiYeuCauEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateLoaiYeuCau(this.LoaiYeuCauEdit.loaiYeuCauId, this.LoaiYeuCauEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }
    
    newLoaiYeuCau() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.LoaiYeuCauEdit = new LoaiYeuCau();
        this.edit();
        return this.LoaiYeuCauEdit;
    }

    private saveSuccessHelper(obj?: LoaiYeuCau) {
        if (obj)
            Object.assign(this.LoaiYeuCauEdit, obj);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;        
        if (this.isGeneralEditor) {
            if (this.isNew) {
                this.alertService.showMessage("Thành công", `Thực hiện thêm mới thành công`, MessageSeverity.success);
            }                
            else
                this.alertService.showMessage("Thành công", `Thực hiện thay đổi thông tin thành công`, MessageSeverity.success);
        }
        this.LoaiYeuCauEdit = new LoaiYeuCau();
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }
    
    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    editLoaiYeuCau(obj: LoaiYeuCau) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.tenLoaiYeuCau;
            this.LoaiYeuCauEdit = new LoaiYeuCau();
            Object.assign(this.LoaiYeuCauEdit, obj);
            Object.assign(this.LoaiYeuCauEdit, obj);
            this.edit();

            return this.LoaiYeuCauEdit;
        }
        else {
            return this.newLoaiYeuCau();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.LoaiYeuCauEdit) {
            this.LoaiYeuCauEdit = new LoaiYeuCau();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.LoaiYeuCauEdit = new LoaiYeuCau();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }    
}