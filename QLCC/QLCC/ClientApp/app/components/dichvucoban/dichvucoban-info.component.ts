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
import { DatePipe } from '@angular/common';
import { BangGiaDichVuCoBan } from '../../models/banggiadichvucoban.model';
import { BangGiaDichVuCoBanService } from '../../services/banggiadichvucoban.service';
import { KhachHangService } from '../../services/khachhang.service';
import { MatBangService } from '../../services/matbang.service';

@Component({
    selector: "dichvucoban-info",
    templateUrl: "./dichvucoban-info.component.html",
    styleUrls: ["./dichvucoban-info.component.css"]
})

export class DichVuCoBanInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private isEdit = false;
    isViewDetails = false;

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
    loaiTien: LoaiTien[] = [];
    donViTinh: DonViTinh[] = [];
    banggiadichvucoban: BangGiaDichVuCoBan[] = [];

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

    constructor(private alertService: AlertService, private gvService: DichVuCoBanService, private banggiadichvucobanservice: BangGiaDichVuCoBanService, private loaitienservice: LoaiTienService, private khachhangservice: KhachHangService, private matbangservice: MatBangService, private datePipe: DatePipe) {
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
        if (this.ChkdonViTinh == false || this.ChkkhachHang == false || this.ChkloaiDichVu == false || this.ChkloaiTien == false || this.ChkmatBang == false) {
            return false;
        } else if (this.DichVuCoBanEdit.soLuong == 0) {
            this.showErrorAlert("Lỗi nhập liệu", "Vui lòng nhập số lượng > 0!");
            this.alertService.stopLoadingMessage();
            this.isSaving = false;
        } else if (this.dongia == "0") {
            this.showErrorAlert("Lỗi nhập liệu", "Vui lòng nhập đơn giá > 0!");
            this.alertService.stopLoadingMessage();
            this.isSaving = false;
        } else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            this.DichVuCoBanEdit.donGia = Number(this.dongia.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            this.DichVuCoBanEdit.thanhTien = Number(this.thanhtien.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            this.DichVuCoBanEdit.tienThanhToan = Number(this.tienthanhtoan.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            this.DichVuCoBanEdit.tyGia = Number(this.tygia.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            this.DichVuCoBanEdit.tienTTQuyDoi = Number(this.tienquydoi.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            this.DichVuCoBanEdit.denNgay = this.valueDenNgay;
            this.DichVuCoBanEdit.tuNgay = this.valueTuNgay;
            this.DichVuCoBanEdit.ngayChungTu = this.valueNgayChungTu;
            this.DichVuCoBanEdit.ngayThanhToan = this.valueNgayThanhToan;
            if (this.isNew) {
                this.gvService.addnewDichVuCoBan(this.DichVuCoBanEdit).subscribe(results => {
                    if (results.soChungTu == "Exist") {
                        this.showErrorAlert("Lỗi nhập liệu", "Số chứng từ " + this.DichVuCoBanEdit.soChungTu + " đã tồn tại trên hệ thống, vui lòng chọn tên khác");
                        this.alertService.stopLoadingMessage();
                        return false;
                    } else this.saveSuccessHelper(results);
                }, error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateDichVuCoBan(this.DichVuCoBanEdit.dichVuCoBanId, this.DichVuCoBanEdit).subscribe(response => {
                    if (response == "Exist") {
                        this.showErrorAlert("Lỗi nhập liệu", "Số chứng từ " + this.DichVuCoBanEdit.soChungTu + " đã tồn tại trên hệ thống, vui lòng chọn tên khác");
                        this.alertService.stopLoadingMessage();
                        return false;
                    } else this.saveSuccessHelper();
                }, error => this.saveFailedHelper(error));
            }
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
        this.DichVuCoBanEdit.soLuong = 1;
        this.valueTuNgay = new Date(this.valueTuNgay.getFullYear(), this.valueTuNgay.getMonth(), 1);
        this.valueDenNgay = new Date(this.valueDenNgay.getFullYear(), this.valueDenNgay.getMonth() + 1, 0);
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
            this.isEdit = true;
            this.ChkmatBang = true;
            this.ChkkhachHang = true;
            this.ChkloaiDichVu = true;
            this.ChkdonViTinh = true;
            this.ChkloaiTien = true;
            //this.editingRowName = obj.tenDichVuCoBan;
            this.dongia = this.formatPrice(obj.donGia.toString());
            this.thanhtien = this.formatPrice(obj.thanhTien.toString());
            this.tienthanhtoan = this.formatPrice(obj.tienThanhToan.toString());
            this.tygia = this.formatPrice(obj.tyGia.toString());
            this.tienquydoi = this.formatPrice(obj.tienTTQuyDoi.toString());
            this.DichVuCoBanEdit = new DichVuCoBan();
            Object.assign(this.DichVuCoBanEdit, obj);
            Object.assign(this.DichVuCoBanEdit, obj);
            //this.valueNgayChungTu = obj.ngayChungTu;
            //this.valueNgayThanhToan = obj.ngayThanhToan;
            //this.valueTuNgay = obj.tuNgay;
            //this.valueDenNgay = obj.denNgay;
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
            this.matbangservice.getMatBangByID(id).subscribe(results => {
                this.DichVuCoBanEdit.khachHangId = results.khachHangId;
            }, error => { })
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
            var change = 0;
            this.banggiadichvucobanservice.getBangGiaDichVuCoBanByLoaiDichVuID(id).subscribe(results => {
                this.DichVuCoBanEdit.donViTinhId = results.donViTinhId;
                this.DichVuCoBanEdit.loaiTienId = results.loaiTienId;
                this.dongia = this.formatPrice(results.donGia.toString());
                var dg = this.dongia.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
                this.thanhtien = this.formatPrice((Number(dg) * Number(this.DichVuCoBanEdit.soLuong)).toString());
                this.tienthanhtoan = this.thanhtien;
                this.loaitienservice.getLoaiTienByID(results.loaiTienId).subscribe(result => {
                    this.tygia = this.formatPrice(result.tyGia.toString());
                    var pS = this.tienthanhtoan.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
                    change = Number(pS) * Number(this.tygia);
                    this.tienquydoi = this.formatPrice(change.toString());
                })
            }, error => { })
            this.ChkloaiDichVu = true;
        } else {
            this.ChkloaiDichVu = false;
        }
    }

    loaiTienChk(id: number) {
        if (id > 0) {            
            this.ChkloaiTien = true;
        } else {
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
    formatPrice(price: string): string {
        if (price) {
            var pN = Number(price);
            var fm = Utilities.formatNumber(pN);
            return fm;
        } else {
            return "";
        }
    }

    private movetoEditForm() {
        this.isViewDetails = false;
        this.isEdit = true;
    }

    closeModal() {
        this.editorModal.hide(); 
    }

    printOnly() {
        var myWindow = window.open('', '', 'width=200,height=100');
        myWindow.document.write("<div style='padding-top: 15px;padding-bottom: 15px'><p><span style='font-weight: bold;font-size: 14px;'>Số chứng từ: </span>" + this.DichVuCoBanEdit.soChungTu + "</p>")
        myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Ngày chứng từ: </span>" + this.datePipe.transform(this.DichVuCoBanEdit.ngayChungTu, 'dd/MM/yyyy') + "</p>");
        myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Mặt bằng: </span>" + this.DichVuCoBanEdit.matBangs.tenMatBang + "<p>");
        myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Khách hàng: </span>" + this.DichVuCoBanEdit.khachHangs.hoDem + " " + this.DichVuCoBanEdit.khachHangs.ten + "</p>");
        myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Loại dịch vụ: </span>" + this.DichVuCoBanEdit.loaiDichVus.tenLoaiDichVu + "</p>");
        myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Đơn vị tính: </span>" + this.DichVuCoBanEdit.donViTinhs.tenDonViTinh + "</p>");
        myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Diễn giải: </span>" + this.DichVuCoBanEdit.dienGiai + "<p>");
        myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Đơn giá: </span>" + this.formatPrice(this.DichVuCoBanEdit.donGia.toString()) + "</p>");
        myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Số lượng: </span>" + this.DichVuCoBanEdit.soLuong + "<p>");
        myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Thành tiền: </span>" + this.formatPrice(this.DichVuCoBanEdit.thanhTien.toString()) + "</p>");
        myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Ngày thanh toán: </span>" + this.datePipe.transform(this.DichVuCoBanEdit.ngayThanhToan, 'dd/MM/yyyy') + "</p>");
        myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Ngày bắt đầu: </span>" + this.datePipe.transform(this.DichVuCoBanEdit.tuNgay, 'dd/MM/yyyy') + "</p>");
        myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Ngày hết hạn: </span>" + this.datePipe.transform(this.DichVuCoBanEdit.denNgay, 'dd/MM/yyyy') + "</p></div>");
        myWindow.document.write("<hr/>");
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    }
}