import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { LoaiXe } from "../../models/loaixe.model";
import { LoaiXeService } from "./../../services/loaixe.service";
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: "loaixe-info",
    templateUrl: "./loaixe-info.component.html",
    styleUrls: ["./loaixe-info.component.css"]
})

export class LoaiXeInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private isEdit = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private LoaiXeEdit: LoaiXe = new LoaiXe();
    public formResetToggle = true;
    private isEditMode = false;
    isViewDetails = false;
    private editingRowName: string;
    public valueTenloaixe: string;
    public valueNgayNhap: Date = new Date();
    public valueNgaySua: Date = new Date();
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    checkTen: boolean;
    checkKyHieu: boolean;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    constructor(private alertService: AlertService, private gvService: LoaiXeService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getLoaiXeByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: LoaiXe) {
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
        this.LoaiXeEdit = new LoaiXe();
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    private save(obj?: LoaiXe) {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
        if (this.isNew) {
            this.gvService.addnewLoaiXe(this.LoaiXeEdit).subscribe(results => {
                if (results.tenLoaiXe == "ten") {
                    this.showErrorAlert("Lỗi nhập liệu", "Loại xe: " + this.LoaiXeEdit.tenLoaiXe + " đã tồn tại trên hệ thống, vui lòng chọn tên khác!");
                    this.alertService.stopLoadingMessage();
                    this.checkTen = false;
                    this.isSaving = false;
                } else if (results.kyHieu == "kyhieu") {
                    this.showErrorAlert("Lỗi nhập liệu", "Ký hiệu: " + this.LoaiXeEdit.kyHieu + " đã tồn tại trên hệ thống, vui lòng chọn tên khác!");
                    this.alertService.stopLoadingMessage();
                    this.isSaving = false;
                    this.checkKyHieu = false;
                }
                else this.saveSuccessHelper();
            }, error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateLoaiXe(this.LoaiXeEdit.loaiXeId, this.LoaiXeEdit).subscribe(response => {
                if (response == "ten") {
                    this.showErrorAlert("Lỗi nhập liệu", "Loại xe: " + this.LoaiXeEdit.tenLoaiXe + " đã tồn tại trên hệ thống, vui lòng chọn tên khác!");
                    this.alertService.stopLoadingMessage();
                    this.isSaving = false;
                    this.checkTen = false;
                } else if (response == "kyhieu") {
                    this.showErrorAlert("Lỗi nhập liệu", "Ký hiệu: " + this.LoaiXeEdit.kyHieu + " đã tồn tại trên hệ thống, vui lòng chọn tên khác!");
                    this.alertService.stopLoadingMessage();
                    this.isSaving = false;
                    this.checkKyHieu = false;
                }
                else this.saveSuccessHelper();
            }, error => this.saveFailedHelper(error));
        }
    }

    newLoaiXe() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.isEdit = false;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.LoaiXeEdit = new LoaiXe();
        this.edit();
        return this.LoaiXeEdit;
    }

    private saveSuccessHelper(obj?: LoaiXe) {
        if (obj)
            Object.assign(this.LoaiXeEdit, obj);

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
        this.LoaiXeEdit = new LoaiXe();
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

    editLoaiXe(obj: LoaiXe) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.isEdit = true;
            this.editingRowName = obj.tenLoaiXe;
            this.LoaiXeEdit = new LoaiXe();
            Object.assign(this.LoaiXeEdit, obj);
            Object.assign(this.LoaiXeEdit, obj);
            this.edit();

            return this.LoaiXeEdit;
        }
        else {
            return this.newLoaiXe();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.LoaiXeEdit) {
            this.LoaiXeEdit = new LoaiXe();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.LoaiXeEdit = new LoaiXe();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    moveToEditForm() {
        this.isNew = false;
        this.isViewDetails = false;
        this.isEdit = true;
    }

    private onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }

    tenChk(ten: string) {
        if (ten != "") {
            this.checkTen = true;
        } else this.checkTen = false;
    }

    kyHieuChk(kyHieu: string) {
        if (kyHieu != "") {
            this.checkKyHieu = true;
        } else this.checkKyHieu = false;
    }
}