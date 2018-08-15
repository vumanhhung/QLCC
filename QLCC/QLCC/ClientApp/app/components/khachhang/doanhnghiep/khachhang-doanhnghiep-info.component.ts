import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { Utilities } from '../../../services/utilities';
import { KhachHang } from "../../../models/khachhang.model";
import { KhachHangService } from "./../../../services/khachhang.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { QuocTich } from '../../../models/quoctich.model';
import { NganHang } from '../../../models/nganhang.model';
import { NhomKhachHang } from '../../../models/nhomkhachhang.model';

@Component({
    selector: "khachhang-doanhnghiep-info",
    templateUrl: "./khachhang-doanhnghiep-info.component.html",
    styleUrls: ["./khachhang-doanhnghiep-info.component.css"]
})

export class KhachHangDoanhNghiepInfoComponent implements OnInit {
    public isFullScreenModal: boolean = false;
    isViewDetails = false;
    private isEdit = false;
    heightScroll: number = 430;
    public tenkhachhangdoanhnghiep: string = "";
    chkquocTich: boolean;
    chknganHang: boolean;
    chkNhomKhachHang: boolean;
    quoctich: QuocTich[] = [];
    nganhang: NganHang[] = [];
    nhomKhachHang: NhomKhachHang[] = [];
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    public valueNgayDKKD: Date = new Date();

    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private KhachHangEdit: KhachHang = new KhachHang();
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
    
    constructor(private alertService: AlertService, private gvService: KhachHangService) {
    }
    
    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getKhachHangByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    
    private onDataLoadSuccessful(obj: KhachHang) {
        this.alertService.stopLoadingMessage();
    }

    private onCurrentUserDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
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
        this.KhachHangEdit = new KhachHang();
        this.showValidationErrors = false;
        this.resetForm();
        if (this.isViewDetails == false) {
            this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        }
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    private save() {
        if (this.chkquocTich == false || this.chknganHang == false || !this.chkNhomKhachHang) { return false; }
        else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            this.KhachHangEdit.ngayDkKinhDoanh = this.valueNgayDKKD;
            this.KhachHangEdit.khDoanhNghiep = true;
            if (this.isNew) {
                this.gvService.addnewKhachHang(this.KhachHangEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateKhachHang(this.KhachHangEdit.khachHangId, this.KhachHangEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }
    
    newKhachHang() {        
        this.isEdit = false;
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.KhachHangEdit = new KhachHang();
        this.KhachHangEdit.gioiTinh = 1;
        this.KhachHangEdit.quocTich = "0";
        this.KhachHangEdit.nganHang = '0';
        this.KhachHangEdit.nhomKhachHangId = 0;
        this.chkquocTich = false;
        this.chknganHang = true;
        this.chkNhomKhachHang = false;
        this.edit();
        return this.KhachHangEdit;
    }

    nhomKhachHangChk(id: number) {
        if (id > 0) {
            this.chkNhomKhachHang = true;
        } else {
            this.chkNhomKhachHang = false;
        }
    }

    quocTichChange(quoctich: string) {
        if (quoctich != '0') {
            this.chkquocTich = true;
        } else {
            this.chkquocTich = false;
        }
    }
    nganHangChange(nganhang: string, tknganhang: string) {

        if (tknganhang != null && tknganhang.length > 0 && nganhang == '0') {
            this.chknganHang = false;
        } else {
            this.chknganHang = true;
        }
    }

    onTKNganHangChange(value: any, nganhang: string) {
        if (value != null && value.length > 0) {
            if (nganhang == '0') {
                this.chknganHang = false;
            }
            else {
                this.chknganHang = true;
            }
        }
        else {
            this.chknganHang = true;
        }
    }


    private saveSuccessHelper(obj?: KhachHang) {
        if (obj)
            Object.assign(this.KhachHangEdit, obj);

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
        this.KhachHangEdit = new KhachHang();
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

    editKhachHang(obj: KhachHang) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.isEdit = true;
            this.editingRowName = obj.ten;
            this.chkquocTich = true;
            this.chknganHang = true;
            this.KhachHangEdit = new KhachHang();
            Object.assign(this.KhachHangEdit, obj);
            Object.assign(this.KhachHangEdit, obj);
            this.edit();

            return this.KhachHangEdit;
        }
        else {
            return this.newKhachHang();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.KhachHangEdit) {
            this.KhachHangEdit = new KhachHang();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.KhachHangEdit = new KhachHang();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }    
    private moveToEditForm() {
        this.isViewDetails = false;
        this.isEdit = true;
        this.isFullScreenModal = false;
    }
    ResizeFullScreen() {
        this.isFullScreenModal = false;
        this.heightScroll = 430;
    }
    FullScreen() {
        this.isFullScreenModal = true;
        this.heightScroll = 540;
    }
}