import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { VatTuPhieuYeuCau } from "../../models/vattuphieuyeucau.model";
import { VatTuPhieuYeuCauService } from "./../../services/vattuphieuyeucau.service";
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: "vattuphieuyeucau-info",
    templateUrl: "./vattuphieuyeucau-info.component.html",
    styleUrls: ["./vattuphieuyeucau-info.component.css"]
})

export class VatTuPhieuYeuCauInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private VatTuPhieuYeuCauEdit: VatTuPhieuYeuCau = new VatTuPhieuYeuCau();
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

    @ViewChild('editorModal')
    editorModal: ModalDirective;
    
    constructor(private alertService: AlertService, private gvService: VatTuPhieuYeuCauService) {
    }
    
    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getVatTuPhieuYeuCauByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    
    private onDataLoadSuccessful(obj: VatTuPhieuYeuCau) {
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
        this.VatTuPhieuYeuCauEdit = new VatTuPhieuYeuCau();
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
            this.gvService.addnewVatTuPhieuYeuCau(this.VatTuPhieuYeuCauEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateVatTuPhieuYeuCau(this.VatTuPhieuYeuCauEdit.phieuYeuCauVTId, this.VatTuPhieuYeuCauEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }
    
    newVatTuPhieuYeuCau() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.VatTuPhieuYeuCauEdit = new VatTuPhieuYeuCau();
        this.edit();
        return this.VatTuPhieuYeuCauEdit;
    }

    private saveSuccessHelper(obj?: VatTuPhieuYeuCau) {
        if (obj)
            Object.assign(this.VatTuPhieuYeuCauEdit, obj);

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
        this.VatTuPhieuYeuCauEdit = new VatTuPhieuYeuCau();
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

    editVatTuPhieuYeuCau(obj: VatTuPhieuYeuCau) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            //this.editingRowName = obj.mucDichSuDung;
            this.VatTuPhieuYeuCauEdit = new VatTuPhieuYeuCau();
            Object.assign(this.VatTuPhieuYeuCauEdit, obj);
            Object.assign(this.VatTuPhieuYeuCauEdit, obj);
            this.edit();

            return this.VatTuPhieuYeuCauEdit;
        }
        else {
            return this.newVatTuPhieuYeuCau();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.VatTuPhieuYeuCauEdit) {
            this.VatTuPhieuYeuCauEdit = new VatTuPhieuYeuCau();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.VatTuPhieuYeuCauEdit = new VatTuPhieuYeuCau();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }    

    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm();
    }
}