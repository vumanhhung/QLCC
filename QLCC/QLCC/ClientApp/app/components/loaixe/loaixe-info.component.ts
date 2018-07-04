import { Component, OnInit, ViewChild, Input, Renderer } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';
import { LoaiXeService } from '../../services/loaixe.service';
import { LoaiXe } from '../../models/loaixe.model';

@Component({
    selector: 'loaixe-info',
    templateUrl: './loaixe-info.component.html',
    styleUrls: ['./loaixe-info.component.css']
})

export class LoaiXeInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private showValidationError: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private loaixeEdit: LoaiXe = new LoaiXe();
    public valueNgayNhap: Date = new Date();
    public valueNgaySua: Date = new Date();
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

    @ViewChild("f")
    private form;

    constructor(private alertService: AlertService, private loaixeservice: LoaiXeService) {

    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loaixeservice.getLoaixeByID().subscribe(result => this.onDataSuccessful(result), error => this.onLoadDataFailed(error));
    }

    public onDataSuccessful(obj: LoaiXe) {
        return this.alertService.stopLoadingMessage();
    }

    public onLoadDataFailed(error: any) {
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
        this.loaixeEdit = new LoaiXe();
        this.showValidationError = false;
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
        this.alertService.showMessage("Đang thực hiện thao tác");
        this.loaixeEdit.ngayNhap = this.valueNgayNhap;
        this.loaixeEdit.ngaySua = this.valueNgaySua;
        if (this.isNew) {
            this.loaixeservice.addnewLoaixe(this.loaixeEdit).subcribe(result => this.onSavingSuccess(result), error => this.onSavingFailed(error));
        } else {
            this.loaixeservice.updateLoaixe(this.loaixeEdit.loaiXeId, this.loaixeEdit).subcribe(result => this.onSavingSuccess(result), error => this.onSavingFailed(error));
        }
    }

    private onSavingSuccess(obj?: LoaiXe) {
        if (obj) {
            Object.assign(this.loaixeEdit, obj);
        }
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationError = false;
        if (this.isGeneralEditor) {
            if (this.isNew) {
                this.alertService.showMessage("Thành Công", "Tạo mới thành công", MessageSeverity.success);
            } else {
                this.alertService.showMessage("Thành Công", "Thay đổi thành công", MessageSeverity.success);
            }
        }
        this.loaixeEdit = new LoaiXe();
        this.resetForm();
        this.isEditMode = false;        
        if (this.changesCancelledCallback) {
            this.changesCancelledCallback();
        }
    }

    private onSavingFailed(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showMessage("Lỗi", "Gặp lỗi trong khi thực thi thao tác", MessageSeverity.error);
        if (this.changesCancelledCallback) {
            this.changesCancelledCallback();
        }
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    newLoaiXe() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationError = true;
        this.editingRowName = null;
        this.loaixeEdit = new LoaiXe();
        this.edit();
        return this.loaixeEdit;
    }

    private edit() {
        if (!this.isGeneralEditor || !this.loaixeEdit) {
            this.loaixeEdit = new LoaiXe();
        }
        this.isEditMode = true;
        this.showValidationError = true;
    }

    editLoaiXe(obj: LoaiXe) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.tenLoaiXe;
            this.loaixeEdit = new LoaiXe();
            Object.assign(this.loaixeEdit, obj);
            this.edit();

            return this.loaixeEdit;
        } else {
            return this.newLoaiXe();
        }
    }

    private close() {
        this.loaixeEdit = new LoaiXe();
        this.showValidationError = false;
        this.resetForm();
        this.isEditMode = true;
        if (this.changesCancelledCallback) {
            this.changesCancelledCallback();
        }
    }
}