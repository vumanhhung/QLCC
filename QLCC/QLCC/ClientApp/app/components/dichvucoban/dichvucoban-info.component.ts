import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { DichVuCoBan } from "../../models/dichvucoban.model";
import { DichVuCoBanService } from "./../../services/dichvucoban.service";
import { MatBang } from '../../models/matbang.model';
import { KhachHang } from '../../models/khachhang.model';
import { LoaiDichVu } from '../../models/loaidichvu.model';
import { DonViTinh } from '../../models/donvitinh.model';
import { LoaiTien } from '../../models/loaitien.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoaiTienService } from '../../services/loaitien.service';

@Component({
    selector: "dichvucoban-info",
    templateUrl: "./dichvucoban-info.component.html",
    styleUrls: ["./dichvucoban-info.component.css"]
})

export class DichVuCoBanInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private isEdit = false;
    isViewDetail = false;

    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private DichVuCoBanEdit: DichVuCoBan = new DichVuCoBan();

    public valueNgayChungTu: Date = new Date();
    public valueNgayThanhToan: Date = new Date();
    public valueTuNgay: Date = new Date();
    public valueDenNgay: Date = new Date();

    public dongia: string = "0";
    public thanhtien: string = "0";
    public tygia: string = "0";
    public tienthanhtoan: string = "0";
    public tienquydoi: string = "0";

    ChkmatBang: boolean;
    ChkkhachHang: boolean;
    ChkloaiDichVu: boolean;
    ChkdonViTinh: boolean;
    ChkloaiTien: boolean;

    matBang: MatBang[] = [];
    khachHang: KhachHang[] = [];
    loaiDichVu: LoaiDichVu[] = [];
    donViTinh: DonViTinh[] = [];
    loaiTien: LoaiTien[] = [];

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

    constructor(private alertService: AlertService, private gvService: DichVuCoBanService, private loaitienService: LoaiTienService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getDichVuCoBanByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));

    }

    private onDataLoadSuccessful(obj: DichVuCoBan) {
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
        this.DichVuCoBanEdit = new DichVuCoBan();
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
            this.gvService.addnewDichVuCoBan(this.DichVuCoBanEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateDichVuCoBan(this.DichVuCoBanEdit.dichVuCoBanId, this.DichVuCoBanEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }

    newDichVuCoBan() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.ChkmatBang = false;
        this.ChkkhachHang = false;
        this.ChkloaiDichVu = false;
        this.ChkdonViTinh = false;
        this.ChkloaiTien = false;
        this.isEdit = false;
        this.DichVuCoBanEdit = new DichVuCoBan();
        this.DichVuCoBanEdit.matBangId = 0;
        this.DichVuCoBanEdit.khachHangId = 0;
        this.DichVuCoBanEdit.loaiDichVuId = 0;
        this.DichVuCoBanEdit.donViTinhId = 0;
        this.DichVuCoBanEdit.loaiTienId = 0;
        this.DichVuCoBanEdit.lapLai = false;
        this.DichVuCoBanEdit.trangThai = 1;
        this.DichVuCoBanEdit.soLuong = 0;
        this.dongia = this.formatPrice("0");
        this.tygia = this.formatPrice("0");
        var result = Number(this.dongia) * this.DichVuCoBanEdit.soLuong;
        this.thanhtien = this.formatPrice(result.toString());
        this.tienthanhtoan = this.formatPrice("0");
        this.tienquydoi = this.formatPrice("0");
        this.edit();
        return this.DichVuCoBanEdit;
    }

    private saveSuccessHelper(obj?: DichVuCoBan) {
        if (obj)
            Object.assign(this.DichVuCoBanEdit, obj);

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
        this.DichVuCoBanEdit = new DichVuCoBan();
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

    editDichVuCoBan(obj: DichVuCoBan) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.ChkmatBang = true;
            this.ChkkhachHang = true;
            this.ChkloaiDichVu = true;
            this.ChkdonViTinh = true;
            this.ChkloaiTien = true;
            //this.editingRowName = obj.tenDichVuCoBan;
            this.DichVuCoBanEdit = new DichVuCoBan();
            Object.assign(this.DichVuCoBanEdit, obj);
            Object.assign(this.DichVuCoBanEdit, obj);
            this.edit();

            return this.DichVuCoBanEdit;
        }
        else {
            return this.newDichVuCoBan();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.DichVuCoBanEdit) {
            this.DichVuCoBanEdit = new DichVuCoBan();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.DichVuCoBanEdit = new DichVuCoBan();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }

    matBangChk(id: number) {
        if (id > 0) {
            this.ChkmatBang = true;
        } else {
            this.ChkmatBang = false;
        }
    }

    khachHangChk(id: number) {
        if (id > 0) {
            this.ChkkhachHang = true;
        } else {
            this.ChkkhachHang = false;
        }
    }

    loaiDichVuChk(id: number) {
        if (id > 0) {
            this.ChkloaiDichVu = true;
        } else {
            this.ChkloaiDichVu = false;
        }
    }

    loaiTienChk(id: number) {
        if (id > 0) {
            var change = 0;
            this.loaitienService.getLoaiTienByID(id).subscribe(result => {
                this.tygia = this.formatPrice(result.tyGia.toString());
                var pS = this.tienthanhtoan.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
                change = Number(pS) * Number(this.tygia);
                this.tienquydoi = this.formatPrice(change.toString());
            });
            this.ChkloaiTien = true;
        } else {
            this.tygia = this.formatPrice("0");
            this.tienquydoi = this.formatPrice("0"); 
            this.ChkloaiTien = false;
        }
    }

    donViTinhChk(id: number) {
        if (id > 0) {
            this.ChkdonViTinh = true;
        } else {
            this.ChkdonViTinh = false;
        }
    }


    dongiaChange(price: string) {
        if (price) {
            var pS = price.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            var pN = Number(pS);
            var result = Number(pS) * this.DichVuCoBanEdit.soLuong;
            this.dongia = Utilities.formatNumber(pN);
            this.thanhtien = this.formatPrice(result.toString());
            this.tienthanhtoan = this.thanhtien
        }
    }
    soluongChange() {
        if (this.DichVuCoBanEdit.soLuong > 0) {
            var pS = this.dongia.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            var result = Number(pS) * this.DichVuCoBanEdit.soLuong;
            this.thanhtien = this.formatPrice(result.toString())
            this.tienthanhtoan = this.thanhtien
        }        
    }
    tygiaChange(price: string) {
        if (price) {
            var pS = price.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            var pN = Number(pS);
            this.tygia = Utilities.formatNumber(pN);
        }
    }
    tienquydoiChange(price: string) {
        if (price) {
            var pS = price.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            var pN = Number(pS);
            this.tienquydoi = Utilities.formatNumber(pN);
        }
    }
    formatPrice(price: string): string {
        if (price) {
            var pS = price.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            var pN = Number(price);
            var fm = Utilities.formatNumber(pN);
            return fm;
        } else {
            return "";
        }
    }
}