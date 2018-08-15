import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { TangLau } from "../../models/tanglau.model";
import { TangLauService } from "./../../services/tanglau.service";
import { ToaNha } from "../../models/toanha.model";
import { CumToaNha } from '../../models/cumtoanha.model';
import { ToaNhaService } from '../../services/toanha.service';
import { CumToaNhaService } from '../../services/cumtoanha.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: "tanglau-info",
    templateUrl: "./tanglau-info.component.html",
    styleUrls: ["./tanglau-info.component.css"]
})

export class TangLauInfoComponent implements OnInit {
    public tenanglau: string = "";
    private isEdit = false;
    isViewDetails = false;
    public tenCumToaNha: string;
    public chkToaNhaId: boolean = false;
    //toanhas: ToaNha[];
    //cums: CumToaNha[];
    toaId: ToaNha;
    cumsSelected: number;
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private TangLauEdit: TangLau = new TangLau();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    loadingIndicator: boolean;
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

    constructor(private alertService: AlertService, private gvService: TangLauService, private toanhaService: ToaNhaService, private cumtoanhaService: CumToaNhaService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getTangLauByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: TangLau) {
        this.alertService.stopLoadingMessage();
    }

    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu tầng lầu từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
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
            this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
            this.TangLauEdit = new TangLau();
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
        if (this.chkToaNhaId == false) { return false; }
        else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            if (this.isNew) {
                this.gvService.addnewTangLau(this.TangLauEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateTangLau(this.TangLauEdit.tangLauId, this.TangLauEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }

    //toaNhaIdChange(toaId: number) {
    //    if (toaId > 0) {
    //        this.chkToaNhaId = true;
    //    } else {
    //        this.chkToaNhaId = false;
    //    }
    //}

    newTangLau(toanhaId: number) {
        this.chkToaNhaId = false;
        this.cumsSelected = 0;
        this.isGeneralEditor = true;
        this.isNew = true;
        this.isEdit = false;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.TangLauEdit = new TangLau();
        this.TangLauEdit.toaNhaId = toanhaId;
        this.edit();
        return this.TangLauEdit;
    }

    private saveSuccessHelper(obj?: TangLau) {
        if (obj)
            Object.assign(this.TangLauEdit, obj);

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
        this.TangLauEdit = new TangLau();
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Lưu không thành công", "Các lỗi sau đã xảy ra trong khi lưu các thay đổi của bạn:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }

    //cumToaNhaIdChange(cumId: number) {
    //    this.loadToaNhaByCumToaNha(cumId);
    //}

    //loadToaNhaByCumToaNha(s: number) {
    //    this.toanhaService.getToaNhaByCum(s).subscribe(results => this.onDataLoadToaNhaSuccessful(results), error => this.onDataLoadFailed(error));
    //}
    //onDataLoadToaNhaSuccessful(obj: ToaNha[]) {
    //    this.toanhas = obj;
    //}
    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }
    //loadToaNhaById(toanhaId: number) {
    //    this.toanhaService.getToaNhaByID(toanhaId).subscribe(results => this.onDataLoadToaNhaSuccessful1(results), error => this.onDataLoadFailed(error));
    //}
    //onDataLoadToaNhaSuccessful1(obj: ToaNha) {
    //    this.toaId = obj;
    //    this.tenCumToaNha = this.toaId.cumtoanhas.tenCumToaNha;
    //    this.cumsSelected = this.toaId.cumToaNhaId;
    //}
    //onDataLoadFailed(error: any) {
    //    this.alertService.stopLoadingMessage();
    //    this.loadingIndicator = false;

    //    this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
    //        MessageSeverity.error, error);
    //}
    editTangLau(obj: TangLau) {
        if (obj) {
            //this.loadToaNhaById(obj.toaNhaId);
            this.isGeneralEditor = true;
            this.isNew = false;
            this.isEdit = true;
            this.editingRowName = obj.tenTangLau;
            this.TangLauEdit = new TangLau();
            Object.assign(this.TangLauEdit, obj);
            //Object.assign(this.TangLauEdit, obj);
            this.edit();

            return this.TangLauEdit;
        }
        else {
            //return this.newTangLau();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.TangLauEdit) {
            this.TangLauEdit = new TangLau();
        }
        this.isEditMode = true;
        this.chkToaNhaId = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.TangLauEdit = new TangLau();
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