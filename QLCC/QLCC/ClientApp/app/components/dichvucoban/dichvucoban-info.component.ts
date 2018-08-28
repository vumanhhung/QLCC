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
import { TangLau } from '../../models/tanglau.model';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';

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
    public valueDate: Date = new Date();

    public dongia: string = "0";
    public thanhtien: string = "0";
    public tygia: string = "0";
    public tienthanhtoan: string = "0";
    public tienquydoi: string = "0";
    public last: string = "";
    public tanglauids: number = 0;

    ChktangLau: boolean;
    ChkmatBang: boolean;
    ChkkhachHang: boolean;
    ChkloaiDichVu: boolean;
    ChkdonViTinh: boolean;
    ChkloaiTien: boolean;
    checkTen: boolean;
    checkLDV: boolean;

    matBang: MatBang[] = [];
    khachHang: KhachHang[] = [];
    loaiDichVu: LoaiDichVu[] = [];
    loaiTien: LoaiTien[] = [];
    donViTinh: DonViTinh[] = [];
    tanglau: TangLau[] = [];
    banggiadichvucoban: BangGiaDichVuCoBan[] = [];
    objNDTN: NguoiDungToaNha = new NguoiDungToaNha();

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

    constructor(private alertService: AlertService, private gvService: DichVuCoBanService, private nguoidungtoanhaService: NguoiDungToaNhaService, private banggiadichvucobanservice: BangGiaDichVuCoBanService, private loaitienservice: LoaiTienService, private khachhangservice: KhachHangService, private matbangservice: MatBangService, private datePipe: DatePipe) {
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
        if (this.ChkloaiDichVu == false || this.ChkmatBang == false) {
            this.isSaving = false;
        } else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            this.DichVuCoBanEdit.donGia = Number(this.dongia.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            this.DichVuCoBanEdit.thanhTien = Number(this.thanhtien.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            this.DichVuCoBanEdit.tienThanhToan = Number(this.tienthanhtoan.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            this.DichVuCoBanEdit.tyGia = Number(this.tygia.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            this.DichVuCoBanEdit.tienTTQuyDoi = Number(this.tienquydoi.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            this.DichVuCoBanEdit.denNgay = new Date(this.valueDenNgay.getFullYear(), this.valueDenNgay.getMonth() + 1, 1);
            this.DichVuCoBanEdit.tuNgay = new Date(this.valueTuNgay.getFullYear(), this.valueTuNgay.getMonth(), 2);
            this.DichVuCoBanEdit.ngayChungTu = this.valueNgayChungTu;
            this.DichVuCoBanEdit.ngayThanhToan = this.valueNgayThanhToan;
            this.DichVuCoBanEdit.tienThanhToan = this.DichVuCoBanEdit.thanhTien;
            if (this.isNew) {                
                this.gvService.addnewDichVuCoBan(this.DichVuCoBanEdit).subscribe(results => {
                    if (results.soChungTu == "Exist") {
                        this.showErrorAlert("Lỗi nhập liệu", "Số chứng từ " + this.DichVuCoBanEdit.soChungTu + " đã tồn tại trên hệ thống, vui lòng chọn tên khác");
                        this.alertService.stopLoadingMessage();
                        this.isSaving = false;
                        this.checkTen = false;
                    } else this.saveSuccessHelper(results);
                }, error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateDichVuCoBan(this.DichVuCoBanEdit.dichVuCoBanId, this.DichVuCoBanEdit).subscribe(response => {
                    if (response == "Exist") {
                        this.showErrorAlert("Lỗi nhập liệu", "Số chứng từ " + this.DichVuCoBanEdit.soChungTu + " đã tồn tại trên hệ thống, vui lòng chọn tên khác");
                        this.alertService.stopLoadingMessage();
                        this.isSaving = false;
                        this.checkTen = false;
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
        this.ChkloaiDichVu = false;
        this.isEdit = false;
        this.DichVuCoBanEdit = new DichVuCoBan();
        this.tanglauids = 0;
        this.DichVuCoBanEdit.matBangId = 0;
        this.DichVuCoBanEdit.khachHangId = 0;
        this.DichVuCoBanEdit.loaiDichVuId = 0;
        this.DichVuCoBanEdit.donViTinhId = 0;
        this.DichVuCoBanEdit.loaiTienId = 0;
        this.DichVuCoBanEdit.lapLai = false;
        this.DichVuCoBanEdit.trangThai = 1;
        this.DichVuCoBanEdit.soLuong = 1;
        this.DichVuCoBanEdit.kyThanhToan = 1;
        this.gvService.lastRecord().subscribe(results => {
            var numberLast = results.dichVuCoBanId + 1;
            var number = 10 - numberLast.toString().length;
            for (var i = 0; i < number; i++) {
                this.last += "0";
            }
            this.DichVuCoBanEdit.soChungTu = "PT-" + this.last + numberLast;
        });
        this.checkLDV = false;
        this.valueTuNgay = new Date(this.valueNgayChungTu.getFullYear(), this.valueNgayChungTu.getMonth(), 1);
        this.valueDenNgay = new Date(this.valueNgayChungTu.getFullYear(), this.valueNgayChungTu.getMonth() + 1, 0);
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
            if (obj.loaiDichVus.dichVuCoBan == true) {
                this.checkLDV = true;
            } else this.checkLDV = false;
            this.tanglauids = obj.matBangs.tangLauId;
            this.matbangservice.getMatBangByTangLau(obj.matBangs.tangLauId).subscribe(results => this.matBang = results);
            this.DichVuCoBanEdit.matBangId = obj.matBangId;
            this.dongia = this.formatPrice(obj.donGia.toString());
            this.thanhtien = this.formatPrice(obj.thanhTien.toString());
            this.tygia = this.formatPrice(obj.tyGia.toString());
            this.tienquydoi = this.formatPrice(obj.tienTTQuyDoi.toString());
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

    ngayChungTuChange(date: Date) {
        this.valueTuNgay = new Date(date.getFullYear(), date.getMonth(), 1);
        this.valueDenNgay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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

    tangLauChk(id: number) {
        if (id > 0) {
            this.ChktangLau = true;
            this.matbangservice.getMatBangByTangLau(id).subscribe(results => {
                this.matBang = results;
            }, error => { });
        } else {
            this.ChktangLau = false;
            this.matBang = null;
        }
    }

    loaiDichVuChk(id: number) {
        if (id > 0) {
            var change = 0;
            this.banggiadichvucobanservice.getBangGiaDichVuCoBanByLoaiDichVuID(id).subscribe(results => {
                if (results == null) {
                    this.showErrorAlert("Lỗi hệ thống", "Loại dịch vụ hiện tại chưa được sử dụng trong bảng Bảng Giá Dịch Vụ Cơ Bản. Vui lòng chọn loại dịch vụ khác hoặc nhập dữ liệu Bảng Giá !");
                    this.tygia = "0";
                    this.DichVuCoBanEdit.donViTinhId = 0;
                    this.DichVuCoBanEdit.loaiTienId = 0;
                    this.dongia = "0";
                    this.thanhtien = "0";
                    this.tienquydoi = "0";
                    this.isSaving = false;
                    this.ChkloaiDichVu = false;
                } else {
                    this.DichVuCoBanEdit.donViTinhId = results.donViTinhId;
                    this.DichVuCoBanEdit.loaiTienId = results.loaiTienId;
                    this.dongia = this.formatPrice(results.donGia.toString());
                    var dg = this.dongia.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");                    
                    if (results.loaiDichVu.dichVuCoBan == true) {     
                        this.checkLDV = true;
                        this.thanhtien = this.formatPrice((Number(dg) * Number(this.DichVuCoBanEdit.soLuong) * Number(this.DichVuCoBanEdit.kyThanhToan)).toString());
                    } else {
                        this.checkLDV = false;
                        this.thanhtien = this.formatPrice((Number(dg) * Number(this.DichVuCoBanEdit.soLuong)).toString());
                    }
                    this.loaitienservice.getLoaiTienByID(results.loaiTienId).subscribe(result => {
                        this.tygia = this.formatPrice(result.tyGia.toString());
                        var pS = this.thanhtien.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
                        change = Number(pS) / Number(result.tyGia.toString());
                        this.tienquydoi = this.formatPrice(change.toString());
                    })
                }
            }, error => {
                this.tygia = "0";
                this.DichVuCoBanEdit.donViTinhId = 0;
                this.DichVuCoBanEdit.loaiTienId = 0;
                this.dongia = "0";
                this.thanhtien = "0";
                this.tienquydoi = "0";
            });
            this.ChkloaiDichVu = true;
        } else {
            this.ChkloaiDichVu = false;
            this.checkLDV = false;
            this.tygia = "0";
            this.DichVuCoBanEdit.donViTinhId = 0;
            this.DichVuCoBanEdit.loaiTienId = 0;
            this.dongia = "0";
            this.thanhtien = "0";
            this.tienquydoi = "0";
        }
    }

    loaiTienChk(id: number) {
        this.ChkloaiTien = true;
        var change = 0;
        this.loaitienservice.getLoaiTienByID(id).subscribe(results => {
            this.tygia = this.formatPrice(results.tyGia.toString());
            var pS = this.thanhtien.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            change = Number(pS) / Number(results.tyGia.toString());
            this.tienquydoi = this.formatPrice(change.toString());
        }, error => {
            this.tygia = "0";
            this.tienquydoi = "0";
        })
    }

    donViTinhChk(id: number) {
        this.ChkdonViTinh = true;
    }

    soLuongChk(id: number) {
        var dongia = this.dongia.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
        this.thanhtien = this.formatPrice((Number(dongia) * Number(id) * Number(this.DichVuCoBanEdit.kyThanhToan)).toString());
        var thanhtien = this.thanhtien.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
        var tygia = this.tygia.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
        this.tienquydoi = this.formatPrice((Number(thanhtien) / Number(tygia)).toString());
    }

    kyThanhToanChk(id: number) {
        var dongia = this.dongia.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
        this.thanhtien = this.formatPrice((Number(dongia) * Number(this.DichVuCoBanEdit.soLuong) * Number(id)).toString());
        var thanhtien = this.thanhtien.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
        var tygia = this.tygia.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
        this.tienquydoi = this.formatPrice((Number(thanhtien) / Number(tygia)).toString());
        this.valueDenNgay = new Date(this.valueTuNgay.getFullYear(), this.valueTuNgay.getMonth() + this.DichVuCoBanEdit.kyThanhToan, 0);
    }

    tenChk(ten: string) {
        if (ten != "") {
            this.checkTen = true;
        } else
            this.checkTen = false;
    }

    tuNgayChk(date: Date) {
        this.valueDenNgay = new Date(date.getFullYear(), date.getMonth() + this.DichVuCoBanEdit.kyThanhToan, 0);
    }

    private movetoEditForm() {
        this.isViewDetails = false;
        this.isEdit = true;
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

    closeModal() {
        this.editorModal.hide();
    }

    printOnly() {
        var myWindow = window.open('', '', 'width=200,height=100');
        myWindow.document.write("<div style='font-size: 1em; padding: 5%;'><div style='width: 100%; display: flex;'>");
        myWindow.document.write("<div style='width: 45%; margin-left: 5%; text-align: center'>");
        myWindow.document.write("<div style='font-weight: bold;'>CÔNG TY CỔ PHẦN ĐẦU TƯ VÀ DỊCH VỤ ĐÔ THỊ VIỆT NAM VINASINCO</div><div>Số chứng từ: " + this.DichVuCoBanEdit.soChungTu + "</div>");
        myWindow.document.write("</div>");
        myWindow.document.write("<div style='width: 45%; margin-left: 5%; text-align: center'>");
        myWindow.document.write("<div style='text-transform: uppercase; font-size: 24px; font-weight: bold;'>Phiếu thu tiền</div><br/>");
        myWindow.document.write("<div>Từ ngày: " + this.datePipe.transform(this.DichVuCoBanEdit.tuNgay, 'dd/MM/yyyy') + " - " + this.datePipe.transform(this.DichVuCoBanEdit.denNgay, 'dd/MM/yyyy') + "</div>");
        myWindow.document.write("</div></div>");
        myWindow.document.write("<br/>");
        myWindow.document.write("<div><p>Khách hàng: " + this.DichVuCoBanEdit.khachHangs.hoDem + " " + this.DichVuCoBanEdit.khachHangs.ten + "</p><p><span style='padding-right:15px;'>Tòa nhà: " + this.DichVuCoBanEdit.matBangs.toanha.tenVietTat + "</span><span style='padding-right:15px;'>Tầng lầu: "  + this.DichVuCoBanEdit.matBangs.tanglau.tenTangLau + "</span><span>Địa chỉ: " + this.DichVuCoBanEdit.matBangs.tenMatBang + "</span></p></div>");
        myWindow.document.write("<div class='clearfix'></div>");
        myWindow.document.write("<table style='border-collapse: collapse;border: 1px solid black; text-align: center;' width='100%'>");
        myWindow.document.write("<tr><td style='border: 1px solid black; width: 25%'>Loại dịch vụ</td><td style='border: 1px solid black; width: 20%'>Đơn giá</td><td style='border: 1px solid black; width: 13%'>Số lượng</td><td style ='border: 1px solid black; width: 17%'>Kỳ thanh toán</td><td style ='border: 1px solid black; width: 25%'>Thành tiền</td></tr>");
        myWindow.document.write("<tr><td style='border: 1px solid black;'>" + this.DichVuCoBanEdit.loaiDichVus.tenLoaiDichVu + "</td><td style='border: 1px solid black;'>" + this.formatPrice(this.DichVuCoBanEdit.donGia.toString()) + "</td><td style='border: 1px solid black;'>" + this.DichVuCoBanEdit.soLuong + "</td><td style='border: 1px solid black;'>" + this.DichVuCoBanEdit.kyThanhToan + "</td><td style='border: 1px solid black;'>" + this.formatPrice(this.DichVuCoBanEdit.thanhTien.toString()) + "</td></tr>");
        myWindow.document.write("<tr><td colspan='4' style='border: 1px solid black;text-align: right; padding-right: 10px;'>Tổng:</td><td style='border: 1px solid black;'>" + this.formatPrice(this.DichVuCoBanEdit.thanhTien.toString()) + "</td></tr>");
        myWindow.document.write("<tr><td colspan='6' style='border: 1px solid black;text-align: left; padding-left: 25px;'>Bằng chữ: </td></tr>");
        myWindow.document.write("</table>");
        myWindow.document.write("<br/>");
        myWindow.document.write("<div style='display: flex; width: 100%'>");
        myWindow.document.write("<div style='text-transform: uppercase; font-weight: bold; width: 45%; text-align: center;'>Người nộp tiền</div>");
        myWindow.document.write("<div style='text-transform: uppercase; font-weight: bold; width: 45%; margin-left: 5%; text-align: center;'>Người thu tiền</div>");
        myWindow.document.write("</div>");
        myWindow.document.write("<br/><br/><br/><br/>");
        myWindow.document.write("<hr/>");
        myWindow.document.write("</div>");
        myWindow.document.close();
        myWindow.print();
        myWindow.close();
    }
}