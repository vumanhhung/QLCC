import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { VatTuDiChuyen } from "../../models/vattudichuyen.model";
import { VatTuDiChuyenService } from "./../../services/vattudichuyen.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { VatTuPhieuDiChuyen } from '../../models/vattuphieudichuyen.model';
import { VatTuPhieuDiChuyenService } from '../../services/vattuphieudichuyen.service';
import { VatTuPhieuYeuCau } from '../../models/vattuphieuyeucau.model';
import { VatTuPhieuYeuCauService } from '../../services/vattuphieuyeucau.service';

@Component({
    selector: "vattudichuyen-info",
    templateUrl: "./vattudichuyen-info.component.html",
    styleUrls: ["./vattudichuyen-info.component.css"]
})

export class VatTuDiChuyenInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private VatTuDiChuyenEdit: VatTuDiChuyen = new VatTuDiChuyen();
    private VatTuPhieuDiChuyenEdit: VatTuPhieuDiChuyen = new VatTuPhieuDiChuyen();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    dexuats: VatTuPhieuYeuCau[] = [];
    
    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    constructor(private alertService: AlertService, private gvService: VatTuPhieuDiChuyenService) {
    }
    
    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getVatTuPhieuDiChuyenByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    
    private onDataLoadSuccessful(obj: VatTuPhieuDiChuyen) {
        this.alertService.stopLoadingMessage();
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        //this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
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
        this.VatTuDiChuyenEdit = new VatTuDiChuyen();
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
            this.gvService.addnewVatTuPhieuDiChuyen(this.VatTuPhieuDiChuyenEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateVatTuPhieuDiChuyen(this.VatTuPhieuDiChuyenEdit.phieuDiChuyenId, this.VatTuPhieuDiChuyenEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }
    
    newVatTuDiChuyen() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.VatTuDiChuyenEdit = new VatTuDiChuyen();
        this.edit();
        return this.VatTuDiChuyenEdit;
    }

    private saveSuccessHelper(obj?: VatTuPhieuDiChuyen) {
        if (obj)
            Object.assign(this.VatTuDiChuyenEdit, obj);

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
        this.VatTuDiChuyenEdit = new VatTuDiChuyen();
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

    editVatTuDiChuyen(obj: VatTuDiChuyen) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.VatTuDiChuyenEdit = new VatTuDiChuyen();
            Object.assign(this.VatTuDiChuyenEdit, obj);
            Object.assign(this.VatTuDiChuyenEdit, obj);
            this.edit();

            return this.VatTuDiChuyenEdit;
        }
        else {
            return this.newVatTuDiChuyen();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.VatTuDiChuyenEdit) {
            this.VatTuDiChuyenEdit = new VatTuDiChuyen();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.VatTuDiChuyenEdit = new VatTuDiChuyen();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }    


    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }
}