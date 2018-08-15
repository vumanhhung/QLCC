import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { TaiKhoanNganHang } from "../../models/taikhoannganhang.model";
import { TaiKhoanNganHangService } from "./../../services/taikhoannganhang.service";
import { NganHang } from '../../models/nganhang.model';

@Component({
    selector: "taikhoannganhang-info",
    templateUrl: "./taikhoannganhang-info.component.html",
    styleUrls: ["./taikhoannganhang-info.component.css"]
})

export class TaiKhoanNganHangInfoComponent implements OnInit {
    private isNew = false;
    chkNganHangId: boolean;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private TaiKhoanNganHangEdit: TaiKhoanNganHang = new TaiKhoanNganHang();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    nganhang: NganHang[];
    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    constructor(private alertService: AlertService, private gvService: TaiKhoanNganHangService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getTaiKhoanNganHangByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: TaiKhoanNganHang) {
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

    nganHangIdChange(nganhang: number) {
        if (nganhang > 0) {
            this.chkNganHangId = true;
        } else {
            this.chkNganHangId = false;
        }
    }

    private cancel() {
        this.TaiKhoanNganHangEdit = new TaiKhoanNganHang();
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
        if (this.chkNganHangId == false || this.TaiKhoanNganHangEdit.nganHangId == 0) { return false; }
        else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            if (this.isNew) {
                this.gvService.addnewTaiKhoanNganHang(this.TaiKhoanNganHangEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateTaiKhoanNganHang(this.TaiKhoanNganHangEdit.taiKhoanNganHangId, this.TaiKhoanNganHangEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }

    newTaiKhoanNganHang() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.TaiKhoanNganHangEdit = new TaiKhoanNganHang();
        this.TaiKhoanNganHangEdit.nganHangId = 0;
        this.edit();
        return this.TaiKhoanNganHangEdit;
    }

    private saveSuccessHelper(obj?: TaiKhoanNganHang) {
        if (obj)
            Object.assign(this.TaiKhoanNganHangEdit, obj);

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
        this.TaiKhoanNganHangEdit = new TaiKhoanNganHang();
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

    editTaiKhoanNganHang(obj: TaiKhoanNganHang) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.soTaiKhoan;
            this.TaiKhoanNganHangEdit = new TaiKhoanNganHang();
            Object.assign(this.TaiKhoanNganHangEdit, obj);
            Object.assign(this.TaiKhoanNganHangEdit, obj);
            this.edit();

            return this.TaiKhoanNganHangEdit;
        }
        else {
            return this.newTaiKhoanNganHang();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.TaiKhoanNganHangEdit) {
            this.TaiKhoanNganHangEdit = new TaiKhoanNganHang();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.TaiKhoanNganHangEdit = new TaiKhoanNganHang();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }
}