import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { PhongBan } from "../../models/phongban.model";
import { PhongBanService } from "./../../services/phongban.service";
import { ToaNha } from '../../models/toanha.model';
import { CumToaNha } from '../../models/cumtoanha.model';
import { ToaNhaService } from '../../services/toanha.service';
import { CumToaNhaService } from '../../services/cumtoanha.service';

@Component({
    selector: "phongban-info",
    templateUrl: "./phongban-info.component.html",
    styleUrls: ["./phongban-info.component.css"]
})

export class PhongBanInfoComponent implements OnInit {
    chkToaNhaId: boolean = false;
    private isNew = false;
    cumsSelected: number;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private PhongBanEdit: PhongBan = new PhongBan();
    public value: Date = new Date();
    public cums: CumToaNha[];
    public toanhas: ToaNha[];
    public toaId: ToaNha = new ToaNha;
    loadingIndicator: boolean;
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

    constructor(private alertService: AlertService, private gvService: PhongBanService, private toanhaService: ToaNhaService, private cumtoanhaService: CumToaNhaService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getPhongBanByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: PhongBan) {
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
        this.PhongBanEdit = new PhongBan();
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
        if (this.chkToaNhaId == false) { return false; }
        else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            if (this.isNew) {
                this.gvService.addnewPhongBan(this.PhongBanEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updatePhongBan(this.PhongBanEdit.phongBanId, this.PhongBanEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }

    cumToaNhaIdChange(cumId: number) {
        this.loadToaNhaByCumToaNha(cumId);
    }

    ToaNhaIdChange(toanhaId: number) {
        if (toanhaId > 0) {
            this.chkToaNhaId = true;
        } else {
            this.chkToaNhaId = false;
        }
    }
    loadToaNhaByCumToaNha(s: number) {
        this.toanhaService.getToaNhaByCum(s).subscribe(results => this.onDataLoadToaNhaSuccessful(results), error => this.onDataLoadFailed(error));
    }

    loadToaNhaById(toanhaId: number) {
        this.toanhaService.getToaNhaByID(toanhaId).subscribe(results => this.onDataLoadToaNhaSuccessful1(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadToaNhaSuccessful1(obj: ToaNha) {
        this.toaId = obj;
        this.cumsSelected = this.toaId.cumToaNhaId;
    }
    onDataLoadToaNhaSuccessful(obj: ToaNha[]) {
        this.toanhas = obj;
    }
    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }
    newPhongBan() {
        this.chkToaNhaId == false;
        this.cumsSelected = 0;
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.PhongBanEdit = new PhongBan();
        this.PhongBanEdit.toaNhaId = 0;
        this.edit();
        return this.PhongBanEdit;
    }

    private saveSuccessHelper(obj?: PhongBan) {
        if (obj)
            Object.assign(this.PhongBanEdit, obj);

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
        this.PhongBanEdit = new PhongBan();
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

    editPhongBan(obj: PhongBan) {
        if (obj) {
            this.loadToaNhaById(obj.toaNhaId);
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.tenPhongBan;
            this.PhongBanEdit = new PhongBan();
            Object.assign(this.PhongBanEdit, obj);
            Object.assign(this.PhongBanEdit, obj);
            this.edit();

            return this.PhongBanEdit;
        }
        else {
            return this.newPhongBan();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.PhongBanEdit) {
            this.PhongBanEdit = new PhongBan();
        }
        this.chkToaNhaId == true;
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.PhongBanEdit = new PhongBan();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;
        this.chkToaNhaId == false;
        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }
}