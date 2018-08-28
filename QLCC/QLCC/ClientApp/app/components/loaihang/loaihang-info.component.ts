import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { LoaiHang } from "../../models/loaihang.model";
import { LoaiHangService } from "./../../services/loaihang.service";
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: "loaihang-info",
    templateUrl: "./loaihang-info.component.html",
    styleUrls: ["./loaihang-info.component.css"]
})

export class LoaiHangInfoComponent implements OnInit {
    private isNew = false;
    private isEdit = false;
    isViewDetails = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private LoaiHangEdit: LoaiHang = new LoaiHang();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    checkTen: boolean;
    
    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    @ViewChild('editorModal')
    editorModal: ModalDirective;
    
    constructor(private alertService: AlertService, private gvService: LoaiHangService) {
    }
    
    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getLoaiHangByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    
    private onDataLoadSuccessful(obj: LoaiHang) {
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
        this.LoaiHangEdit = new LoaiHang();
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
            this.gvService.addnewLoaiHang(this.LoaiHangEdit).subscribe(results => {
                if (results.tenLoaiHang == "Exist") {
                    this.showErrorAlert("Lỗi nhập liệu", "Loại hàng: " + this.LoaiHangEdit.tenLoaiHang + " đã được sử dụng trên hệ thống, vui lòng chọn tên khác !");
                    this.alertService.stopLoadingMessage();
                    this.isSaving = false;
                    this.checkTen = false;
                } else this.saveSuccessHelper(results)
            }, error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateLoaiHang(this.LoaiHangEdit.loaiHangId, this.LoaiHangEdit).subscribe(response => {
                if (response == "Exist") {
                    this.showErrorAlert("Lỗi nhập liệu", "Loại hàng: " + this.LoaiHangEdit.tenLoaiHang + " đã tồn tại trên hệ thống, vui lòng chọn tên khác!");
                    this.alertService.stopLoadingMessage();
                    this.isSaving = false;
                    this.checkTen = false;
                } else this.saveSuccessHelper()
            }, error => this.saveFailedHelper(error));
        }
    }
    
    newLoaiHang() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.LoaiHangEdit = new LoaiHang();
        this.LoaiHangEdit.trangThai = true;
        this.edit();
        return this.LoaiHangEdit;
    }

    private saveSuccessHelper(obj?: LoaiHang) {
        if (obj)
            Object.assign(this.LoaiHangEdit, obj);

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
        this.LoaiHangEdit = new LoaiHang();
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

    editLoaiHang(obj: LoaiHang) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.tenLoaiHang;
            this.LoaiHangEdit = new LoaiHang();
            Object.assign(this.LoaiHangEdit, obj);
            Object.assign(this.LoaiHangEdit, obj);
            this.edit();

            return this.LoaiHangEdit;
        }
        else {
            return this.newLoaiHang();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.LoaiHangEdit) {
            this.LoaiHangEdit = new LoaiHang();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.LoaiHangEdit = new LoaiHang();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }    

    movetoEditForm() {
        this.isNew = false;
        this.isViewDetails = false;
        this.isEdit = true;
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }

    tenChk(ten: string) {
        if (ten != "") {
            this.checkTen = true;
        } else
            this.checkTen = false;
    }
}