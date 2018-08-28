import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { VatTuHinhAnh } from "../../models/vattuhinhanh.model";
import { VatTuHinhAnhService } from "./../../services/vattuhinhanh.service";

@Component({
    selector: "vattuhinhanh-info",
    templateUrl: "./vattuhinhanh-info.component.html",
    styleUrls: ["./vattuhinhanh-info.component.css"]
})

export class VatTuHinhAnhInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private VatTuHinhAnhEdit: VatTuHinhAnh = new VatTuHinhAnh();
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
    
    constructor(private alertService: AlertService, private gvService: VatTuHinhAnhService) {
    }
    
    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getVatTuHinhAnhByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    
    private onDataLoadSuccessful(obj: VatTuHinhAnh) {
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
        this.VatTuHinhAnhEdit = new VatTuHinhAnh();
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
            this.gvService.addnewVatTuHinhAnh(this.VatTuHinhAnhEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateVatTuHinhAnh(this.VatTuHinhAnhEdit.vatTuHinhAnhId, this.VatTuHinhAnhEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }
    
    newVatTuHinhAnh() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.VatTuHinhAnhEdit = new VatTuHinhAnh();
        this.edit();
        return this.VatTuHinhAnhEdit;
    }

    private saveSuccessHelper(obj?: VatTuHinhAnh) {
        if (obj)
            Object.assign(this.VatTuHinhAnhEdit, obj);

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
        this.VatTuHinhAnhEdit = new VatTuHinhAnh();
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

    editVatTuHinhAnh(obj: VatTuHinhAnh) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.tenHinhAnh;
            this.VatTuHinhAnhEdit = new VatTuHinhAnh();
            Object.assign(this.VatTuHinhAnhEdit, obj);
            Object.assign(this.VatTuHinhAnhEdit, obj);
            this.edit();

            return this.VatTuHinhAnhEdit;
        }
        else {
            return this.newVatTuHinhAnh();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.VatTuHinhAnhEdit) {
            this.VatTuHinhAnhEdit = new VatTuHinhAnh();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.VatTuHinhAnhEdit = new VatTuHinhAnh();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }    
}