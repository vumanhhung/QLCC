import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { CongThucNuoc } from "../../models/congthucnuoc.model";
import { CongThucNuocService } from "./../../services/congthucnuoc.service";
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: "congthucnuoc-info",
    templateUrl: "./congthucnuoc-info.component.html",
    styleUrls: ["./congthucnuoc-info.component.css"]
})

export class CongThucNuocInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private isEdit = false;
    private checkbox: boolean = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private CongThucNuocEdit: CongThucNuoc = new CongThucNuoc();
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

    constructor(private alertService: AlertService, private gvService: CongThucNuocService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getCongThucNuocByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: CongThucNuoc) {
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
        this.CongThucNuocEdit = new CongThucNuoc();
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
            this.gvService.addnewCongThucNuoc(this.CongThucNuocEdit).subscribe(results => {
                if (results.tenCongThucNuoc == "Exist") {
                    this.showErrorAlert("Lỗi nhập liệu", "Tên công thức nước: " + this.CongThucNuocEdit.tenCongThucNuoc + " đã tồn tại trên hệ thống, vui lòng chọn tên khác!");
                    this.alertService.stopLoadingMessage();
                    this.isSaving = false;
                } else {
                    if (results.status == true) {
                        this.gvService.changeStatus(results.congThucNuocId).subscribe(result => this.saveSuccessHelper(), error => { });
                    } else {
                        this.saveSuccessHelper();
                    }
                }                
            }, error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateCongThucNuoc(this.CongThucNuocEdit.congThucNuocId, this.CongThucNuocEdit).subscribe(response => {
                if (response == "Exist") {
                    this.showErrorAlert("Lỗi nhập liệu", "Tên công thức nước: " + this.CongThucNuocEdit.tenCongThucNuoc + " đã tồn tại trên hệ thống, vui lòng chọn tên khác!");
                    this.alertService.stopLoadingMessage();
                    this.isSaving = false;
                } else {
                    if (this.CongThucNuocEdit.status == true) {
                        this.gvService.changeStatus(this.CongThucNuocEdit.congThucNuocId).subscribe(result => this.saveSuccessHelper(), error => { });
                    } else {
                        this.saveSuccessHelper();
                    }
                }
            }, error => this.saveFailedHelper(error));
        }
    }

    newCongThucNuoc() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.isEdit = false;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.CongThucNuocEdit = new CongThucNuoc();
        this.edit();
        this.gvService.checkStatus().subscribe(result => {
            if (result == "none") {
                this.CongThucNuocEdit.status = true;
            } else if (result == "exist") {
                this.CongThucNuocEdit.status = false;
            }
        });
        return this.CongThucNuocEdit;
    }

    private saveSuccessHelper(obj?: CongThucNuoc) {
        if (obj)
            Object.assign(this.CongThucNuocEdit, obj);
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
        this.CongThucNuocEdit = new CongThucNuoc();
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

    editCongThucNuoc(obj: CongThucNuoc) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.isEdit = true;
            this.editingRowName = obj.tenCongThucNuoc;
            this.CongThucNuocEdit = new CongThucNuoc();
            Object.assign(this.CongThucNuocEdit, obj);
            Object.assign(this.CongThucNuocEdit, obj);
            this.edit();

            return this.CongThucNuocEdit;
        }
        else {
            return this.newCongThucNuoc();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.CongThucNuocEdit) {
            this.CongThucNuocEdit = new CongThucNuoc();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.CongThucNuocEdit = new CongThucNuoc();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    movetoEditForm() {
        this.isNew = false;
        this.isEdit = true;
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }
}