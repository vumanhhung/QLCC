import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { NguoiDungToaNha } from "../../models/nguoidungtoanha.model";
import { NguoiDungToaNhaService } from "./../../services/nguoidungtoanha.service";
import { UserEdit } from '../../models/user-edit.model';
import { ToaNha } from "../../models/toanha.model";
import { CumToaNha } from '../../models/cumtoanha.model';
import { ToaNhaService } from '../../services/toanha.service';
import { CumToaNhaService } from '../../services/cumtoanha.service';

@Component({
    selector: "nguoidungtoanha-info",
    templateUrl: "./nguoidungtoanha-info.component.html",
    styleUrls: ["./nguoidungtoanha-info.component.css"]
})

export class NguoiDungToaNhaInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private NguoiDungToaNhaEdit: NguoiDungToaNha = new NguoiDungToaNha();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    public userId: string;
    public nguoiDung: string;
    toanhas: ToaNha[] = [];
    cums: CumToaNha[] = [];
    chkToaNhaId: boolean = false;
    cumsSelected: number = 0;


    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    constructor(private alertService: AlertService, private gvService: NguoiDungToaNhaService, private toaNhaService: ToaNhaService, private cumtoanhaService: CumToaNhaService) {
    }

    ngOnInit() {
        //if (!this.isGeneralEditor) {
        //    this.loadData();
        //}
    }

    loadData() {
        this.alertService.startLoadingMessage();
        var where = "NguoiDungId = '" + this.userId + "'";
        this.gvService.getItems(0, 1, where, "x").subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    onDataCumLoadSuccessful(obj: CumToaNha[]) {
        this.cums = obj;
    }

    onDataToaNhaLoadSuccessful(obj: ToaNha[]) {
        this.NguoiDungToaNhaEdit.toaNhaId = 0;
        this.toanhas = obj;
    }

    private onDataLoadSuccessful(obj: NguoiDungToaNha[]) {
        this.alertService.stopLoadingMessage();
        this.cumtoanhaService.getAllCumToaNha().subscribe(results => this.cums = results, error => this.onDataLoadFailed(error));
        if (obj.length > 0) {
            this.NguoiDungToaNhaEdit = obj[0];
            this.NguoiDungToaNhaEdit.cumToaNhaId = obj[0].toaNha.cumToaNhaId;
            this.toaNhaService.getToaNhaByCum(obj[0].toaNha.cumToaNhaId).subscribe(results => this.toanhas = results, error => this.onDataLoadFailed(error));            
            this.isNew = false;
            this.chkToaNhaId = true;

        } else {
            this.toaNhaService.getToaNhaByCum(0).subscribe(results => this.toanhas = results, error => this.onDataLoadFailed(error));
            this.NguoiDungToaNhaEdit = new NguoiDungToaNha();
            this.cumsSelected = 0;
            this.NguoiDungToaNhaEdit.toaNhaId = 0;
            this.NguoiDungToaNhaEdit.cumToaNhaId = 0;
            this.isNew = true;
            this.chkToaNhaId = false;
        }
        return this.NguoiDungToaNhaEdit;
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    private onCurrentUserDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng tòa nhà từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    cumToaNhaIdChange(cumId: number) {
        this.toaNhaService.getToaNhaByCum(cumId).subscribe(results => this.onDataToaNhaLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    toaNhaIdChange(toaId: number) {
        if (toaId > 0) {           
            this.chkToaNhaId = true;
        } else {
            this.chkToaNhaId = false;
        }        
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
        this.NguoiDungToaNhaEdit = new NguoiDungToaNha();
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        this.editorModal.hide();
    }

    private save() {
        if (this.chkToaNhaId == false) { return false; }
        else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            if (this.isNew) {                
                this.NguoiDungToaNhaEdit.nguoiDungId = this.userId;
                this.NguoiDungToaNhaEdit.userName = this.nguoiDung;
                this.gvService.addnewNguoiDungToaNha(this.NguoiDungToaNhaEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateNguoiDungToaNha(this.NguoiDungToaNhaEdit.nguoiDungToaNhaId, this.NguoiDungToaNhaEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }

    private saveSuccessHelper(obj?: NguoiDungToaNha) {
        if (obj)
            Object.assign(this.NguoiDungToaNhaEdit, obj);

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
        this.NguoiDungToaNhaEdit = new NguoiDungToaNha();
        this.resetForm();
        this.editorModal.hide();
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

    editNguoiDungToaNha(obj: UserEdit) {
        if (obj) {
            this.isGeneralEditor = true;
            this.showValidationErrors = false;
            this.userId = obj.id;
            this.nguoiDung = obj.userName;
            this.loadData();
        }
    }
}