import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { LoaiTien } from "../../models/loaitien.model";
import { LoaiTienService } from "./../../services/loaitien.service";

@Component({
    selector: "loaitien-info",
    templateUrl: "./loaitien-info.component.html",
    styleUrls: ["./loaitien-info.component.css"]
})

export class LoaiTienInfoComponent implements OnInit {
    private isNew = false;
    valuetyGia: string = "0";
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private LoaiTienEdit: LoaiTien = new LoaiTien();
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
    
    constructor(private alertService: AlertService, private gvService: LoaiTienService) {
    }
    
    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    ontyGiaChange(dt: number) {
        this.valuetyGia = Utilities.formatNumber(dt);
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getLoaiTienByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    
    private onDataLoadSuccessful(obj: LoaiTien) {
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
        this.LoaiTienEdit = new LoaiTien();
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
            this.gvService.addnewLoaiTien(this.LoaiTienEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateLoaiTien(this.LoaiTienEdit.loaiTienId, this.LoaiTienEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }
    
    newLoaiTien() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.LoaiTienEdit = new LoaiTien();
        this.LoaiTienEdit.tyGia = 0;
        this.edit();
        return this.LoaiTienEdit;
    }

    private saveSuccessHelper(obj?: LoaiTien) {
        if (obj)
            Object.assign(this.LoaiTienEdit, obj);

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
        this.LoaiTienEdit = new LoaiTien();
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

    editLoaiTien(obj: LoaiTien) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.tenLoaiTien;
            this.LoaiTienEdit = new LoaiTien();
            Object.assign(this.LoaiTienEdit, obj);
            Object.assign(this.LoaiTienEdit, obj);
            this.valuetyGia = Utilities.formatNumber(obj.tyGia);
            this.edit();

            return this.LoaiTienEdit;
        }
        else {
            return this.newLoaiTien();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.LoaiTienEdit) {
            this.LoaiTienEdit = new LoaiTien();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.LoaiTienEdit = new LoaiTien();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }    
}