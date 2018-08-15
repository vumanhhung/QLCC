import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { TrangThaiYeuCau } from "../../models/trangthaiyeucau.model";
import { TrangThaiYeuCauService } from "./../../services/trangthaiyeucau.service";

@Component({
    selector: "trangthaiyeucau-info",
    templateUrl: "./trangthaiyeucau-info.component.html",
    styleUrls: ["./trangthaiyeucau-info.component.css"]
})

export class TrangThaiYeuCauInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private TrangThaiYeuCauEdit: TrangThaiYeuCau = new TrangThaiYeuCau();
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
    
    constructor(private alertService: AlertService, private gvService: TrangThaiYeuCauService) {
    }
    
    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getTrangThaiYeuCauByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    
    private onDataLoadSuccessful(obj: TrangThaiYeuCau) {
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
        this.TrangThaiYeuCauEdit = new TrangThaiYeuCau();
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
            this.gvService.addnewTrangThaiYeuCau(this.TrangThaiYeuCauEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateTrangThaiYeuCau(this.TrangThaiYeuCauEdit.trangThaiYeuCauId, this.TrangThaiYeuCauEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }
    
    newTrangThaiYeuCau() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.TrangThaiYeuCauEdit = new TrangThaiYeuCau();
        this.edit();
        return this.TrangThaiYeuCauEdit;
    }

    private saveSuccessHelper(obj?: TrangThaiYeuCau) {
        if (obj)
            Object.assign(this.TrangThaiYeuCauEdit, obj);

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
        this.TrangThaiYeuCauEdit = new TrangThaiYeuCau();
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

    editTrangThaiYeuCau(obj: TrangThaiYeuCau) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.tenTrangThaiYeuCau;
            this.TrangThaiYeuCauEdit = new TrangThaiYeuCau();
            Object.assign(this.TrangThaiYeuCauEdit, obj);
            Object.assign(this.TrangThaiYeuCauEdit, obj);
            this.edit();

            return this.TrangThaiYeuCauEdit;
        }
        else {
            return this.newTrangThaiYeuCau();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.TrangThaiYeuCauEdit) {
            this.TrangThaiYeuCauEdit = new TrangThaiYeuCau();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.TrangThaiYeuCauEdit = new TrangThaiYeuCau();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }    
}