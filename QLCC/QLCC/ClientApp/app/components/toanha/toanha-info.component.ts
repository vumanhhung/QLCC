import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { ToaNha } from "../../models/toanha.model";
import { ToaNhaService } from "./../../services/toanha.service";
import { CumToaNhaService } from "../../services/cumtoanha.service";
import { CumToaNha } from "../../models/cumtoanha.model";
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: "toanha-info",
    templateUrl: "./toanha-info.component.html",
    styleUrls: ["./toanha-info.component.css"]
})

export class ToaNhaInfoComponent implements OnInit {
    public tentoanha: string = "";
    private isEdit = false;
    isViewDetails = false;
    chkCumToaNhaId: boolean;
    cums: CumToaNha[];
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private ToaNhaEdit: ToaNha = new ToaNha();
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

    constructor(private alertService: AlertService, private gvService: ToaNhaService) {
    }

    ngOnInit() {       
    }    

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getToaNhaByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: ToaNha) {
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
        if (this.isViewDetails == false) {
            this.ToaNhaEdit = new ToaNha();
            this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        }
        this.showValidationErrors = false;
        this.resetForm();
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
            this.gvService.addnewToaNha(this.ToaNhaEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateToaNha(this.ToaNhaEdit.toaNhaId, this.ToaNhaEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }

    cumToaNhaIdChange(cumId: number) {
        if (cumId > 0) {
            this.chkCumToaNhaId = true;
        } else {
            this.chkCumToaNhaId = false;
        }
    }

    newToaNha() {
        this.chkCumToaNhaId = false;
        this.isGeneralEditor = true;
        this.isNew = true;
        this.isEdit = false;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.ToaNhaEdit = new ToaNha();
        this.ToaNhaEdit.cumToaNhaId = 0;
        this.edit();
        return this.ToaNhaEdit;
    }

    private saveSuccessHelper(obj?: ToaNha) {
        if (obj)
            Object.assign(this.ToaNhaEdit, obj);

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
        this.ToaNhaEdit = new ToaNha();
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

    editToaNha(obj: ToaNha) {
        if (obj) {
            this.chkCumToaNhaId = true;
            this.isGeneralEditor = true;
            this.isNew = false;
            this.isEdit = true;
            this.editingRowName = obj.tenKhoiNha;
            this.ToaNhaEdit = new ToaNha();
            Object.assign(this.ToaNhaEdit, obj);
            Object.assign(this.ToaNhaEdit, obj);
            this.edit();
            return this.ToaNhaEdit;
            
        }
        else {
            return this.newToaNha();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.ToaNhaEdit) {
            this.ToaNhaEdit = new ToaNha();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.ToaNhaEdit = new ToaNha();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    private moveToEditForm() {
        this.isViewDetails = false;
        this.isEdit = true;
    }
    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }
}