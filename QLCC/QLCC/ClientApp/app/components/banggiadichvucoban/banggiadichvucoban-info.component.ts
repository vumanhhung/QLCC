import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { BangGiaDichVuCoBan } from "../../models/banggiadichvucoban.model";
import { BangGiaDichVuCoBanService } from "./../../services/banggiadichvucoban.service";

@Component({
    selector: "banggiadichvucoban-info",
    templateUrl: "./banggiadichvucoban-info.component.html",
    styleUrls: ["./banggiadichvucoban-info.component.css"]
})

export class BangGiaDichVuCoBanInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private BangGiaDichVuCoBanEdit: BangGiaDichVuCoBan = new BangGiaDichVuCoBan();
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
    
    constructor(private alertService: AlertService, private gvService: BangGiaDichVuCoBanService) {
    }
    
    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getBangGiaDichVuCoBanByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    
    private onDataLoadSuccessful(obj: BangGiaDichVuCoBan) {
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
        this.BangGiaDichVuCoBanEdit = new BangGiaDichVuCoBan();
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
            this.gvService.addnewBangGiaDichVuCoBan(this.BangGiaDichVuCoBanEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateBangGiaDichVuCoBan(this.BangGiaDichVuCoBanEdit.bangGiaDichVuCoBanId, this.BangGiaDichVuCoBanEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }
    
    newBangGiaDichVuCoBan() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.BangGiaDichVuCoBanEdit = new BangGiaDichVuCoBan();
        this.edit();
        return this.BangGiaDichVuCoBanEdit;
    }

    private saveSuccessHelper(obj?: BangGiaDichVuCoBan) {
        if (obj)
            Object.assign(this.BangGiaDichVuCoBanEdit, obj);

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
        this.BangGiaDichVuCoBanEdit = new BangGiaDichVuCoBan();
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

    editBangGiaDichVuCoBan(obj: BangGiaDichVuCoBan) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.dienGiai;
            this.BangGiaDichVuCoBanEdit = new BangGiaDichVuCoBan();
            Object.assign(this.BangGiaDichVuCoBanEdit, obj);
            Object.assign(this.BangGiaDichVuCoBanEdit, obj);
            this.edit();

            return this.BangGiaDichVuCoBanEdit;
        }
        else {
            return this.newBangGiaDichVuCoBan();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.BangGiaDichVuCoBanEdit) {
            this.BangGiaDichVuCoBanEdit = new BangGiaDichVuCoBan();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.BangGiaDichVuCoBanEdit = new BangGiaDichVuCoBan();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }    
}