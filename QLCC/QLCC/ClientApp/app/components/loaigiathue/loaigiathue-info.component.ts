import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { LoaiGiaThue } from "../../models/loaigiathue.model";
import { LoaiGiaThueService } from "./../../services/loaigiathue.service";
import { LoaiTien } from '../../models/loaitien.model';

@Component({
    selector: "loaigiathue-info",
    templateUrl: "./loaigiathue-info.component.html",
    styleUrls: ["./loaigiathue-info.component.css"]
})

export class LoaiGiaThueInfoComponent implements OnInit {
    private isNew = false;
    chkLoaiTien: boolean = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private LoaiGiaThueEdit: LoaiGiaThue = new LoaiGiaThue();
    public loaitiens: LoaiTien[];
    public value: Date = new Date();
    public formResetToggle = true;
    valuedonGia: string = "0";
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
    
    constructor(private alertService: AlertService, private gvService: LoaiGiaThueService) {
    }
    
    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getLoaiGiaThueByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    
    private onDataLoadSuccessful(obj: LoaiGiaThue) {
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

    loaiTienIdChange(loaitien: number) {
        if (loaitien > 0) {
            this.chkLoaiTien = true;
        } else {
            this.chkLoaiTien = false;
        }
    }

    private cancel() {
        this.LoaiGiaThueEdit = new LoaiGiaThue();
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
        if (this.chkLoaiTien == false) { return false; }
        else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            if (this.isNew) {
                this.gvService.addnewLoaiGiaThue(this.LoaiGiaThueEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateLoaiGiaThue(this.LoaiGiaThueEdit.loaiGiaThueId, this.LoaiGiaThueEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }
    
    newLoaiGiaThue() {
        this.isGeneralEditor = true;
        this.chkLoaiTien = false;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.LoaiGiaThueEdit = new LoaiGiaThue();
        this.LoaiGiaThueEdit.loaiTienId = 0;
        this.edit();
        return this.LoaiGiaThueEdit;
    }


    ondonGiaChange(dt: number) {
        this.valuedonGia = Utilities.formatNumber(dt);
    }


    private saveSuccessHelper(obj?: LoaiGiaThue) {
        if (obj)
            Object.assign(this.LoaiGiaThueEdit, obj);

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
        this.LoaiGiaThueEdit = new LoaiGiaThue();
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

    editLoaiGiaThue(obj: LoaiGiaThue) {
        if (obj) {

            if (obj.loaiTienId > 0) {
                this.chkLoaiTien = true;
            }
            else {
                this.chkLoaiTien = false;
            }
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.tenLoaiGia;
            this.LoaiGiaThueEdit = new LoaiGiaThue();
            Object.assign(this.LoaiGiaThueEdit, obj);
            Object.assign(this.LoaiGiaThueEdit, obj);
            this.edit();

            return this.LoaiGiaThueEdit;
        }
        else {
            return this.newLoaiGiaThue();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.LoaiGiaThueEdit) {
            this.LoaiGiaThueEdit = new LoaiGiaThue();
        }
        this.isEditMode = true;
        
        this.showValidationErrors = true;
    }

    private close() {
        this.LoaiGiaThueEdit = new LoaiGiaThue();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }    
}