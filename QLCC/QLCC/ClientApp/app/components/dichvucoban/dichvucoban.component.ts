import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { DichVuCoBanService } from "../../services/dichvucoban.service";
import { DichVuCoBan } from "../../models/dichvucoban.model";
import { DichVuCoBanInfoComponent } from "./dichvucoban-info.component";
import { MatBang } from '../../models/matbang.model';
import { KhachHang } from '../../models/khachhang.model';
import { LoaiDichVu } from '../../models/loaidichvu.model';
import { DonViTinh } from '../../models/donvitinh.model';
import { LoaiTien } from '../../models/loaitien.model';
import { KhachHangService } from '../../services/khachhang.service';
import { MatBangService } from '../../services/matbang.service';
import { LoaiDichVuService } from '../../services/loaidichvu.service';
import { DonViTinhService } from '../../services/donvitinh.service';
import { LoaiTienService } from '../../services/loaitien.service';
import * as XLSX from 'ts-xlsx';
import { DichVuCoBanImportComponent } from './dichvucoban-import.component';
import { DatePipe } from '@angular/common';
import { TangLau } from '../../models/tanglau.model';
import { TangLauService } from '../../services/tanglau.service';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { AuthService } from '../../services/auth.service';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';
import { BangGiaDichVuCoBan } from '../../models/banggiadichvucoban.model';
import { BangGiaDichVuCoBanService } from '../../services/banggiadichvucoban.service';
import { format } from '@telerik/kendo-intl';

@Component({
    selector: "dichvucoban",
    templateUrl: "./dichvucoban.component.html",
    styleUrls: ["./dichvucoban.component.css"]
})

export class DichVuCoBanComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    randomString: string = Utilities.RandomText(10);
    columns: any[] = [];
    selected: any[] = [];

    rows: DichVuCoBan[] = [];
    rowsCache: DichVuCoBan[] = [];
    matBang: MatBang[] = [];
    khachHang: KhachHang[] = [];
    loaiDichVu: LoaiDichVu[] = [];
    donViTinh: DonViTinh[] = [];
    loaiTien: LoaiTien[] = [];
    tanglau: TangLau[] = [];
    banggia: BangGiaDichVuCoBan[] = [];
    objNDTN: NguoiDungToaNha = new NguoiDungToaNha();

    loadingIndicator: boolean;
    public formResetToggle = true;
    dichvucobanEdit: DichVuCoBan;
    sourcedichvucoban: DichVuCoBan;
    editingRowName: { name: string };
    selectFileUpload: string = "";
    arrayBuffer: any;

    public selectedTangLau: number = 0;
    public selectedTrangThai: number = 0;
    public selectedLoaiDV: number = 0;
    public valueDate: Date = new Date();
    //public valueDate: Date;

    @ViewChild('f')
    private form;

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('nameTemplate')
    nameTemplate: TemplateRef<any>;

    @ViewChild('descriptionTemplate')
    descriptionTemplate: TemplateRef<any>;

    @ViewChild('customerTemplate')
    customerTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('startTemplate')
    startTemplate: TemplateRef<any>;

    @ViewChild('endTemplate')
    endTemplate: TemplateRef<any>;

    @ViewChild('priceTemplate')
    priceTemplate: TemplateRef<any>;

    @ViewChild('checkTemplate')
    checkTemplate: TemplateRef<any>;

    @ViewChild('checkAllTemplate')
    checkAllTemplate: TemplateRef<any>;

    @ViewChild('importexcel')
    importexcel: DichVuCoBanImportComponent;

    @ViewChild('dichvucobanEditor')
    DichVuCoBanEditor: DichVuCoBanInfoComponent;

    constructor(private alertService: AlertService, private translationService: AppTranslationService,
        private dichvucobanService: DichVuCoBanService,
        private khachHangService: KhachHangService,
        private matbangService: MatBangService,
        private loaidichvuService: LoaiDichVuService,
        private donvitinhService: DonViTinhService,
        private loaitienService: LoaiTienService,
        private tanglauService: TangLauService,
        private nguoidungtoanhaService: NguoiDungToaNhaService,
        private banggiaService: BangGiaDichVuCoBanService,
        private authService: AuthService,
        private datePipe: DatePipe) {
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { headerTemplate: this.checkAllTemplate, width: 38, cellTemplate: this.checkTemplate, canAutoResize: false, sortable: false, draggable: false },
            { prop: "index", name: '#', width: 35, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'soChungTu', name: gT('Số CT'), canAutoResize: true },
            { prop: 'matBangs.tenMatBang', name: gT('Mặt bằng'), width: 100, canAutoResize: false },
            { name: gT('Khách hàng'), cellTemplate: this.customerTemplate },
            { name: gT('Tổng tiền'), cellTemplate: this.priceTemplate, canAutoResize: true },
            { prop: 'lapLai', name: gT('Lặp lại'), width: 70, cellTemplate: this.nameTemplate, canAutoResize: false },
            { prop: 'trangThai', name: gT('Trạng thái'), cellTemplate: this.descriptionTemplate },
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, canAutoResize: false, sortable: false, draggable: false }
        ];
        this.loadData(0, 0, 0, this.valueDate);
        this.loadAllKhachHang();
        this.loadAllLoaiDichVu();
        this.loadAllLoaiTien();
        this.loadAllDonViTinh();
        if (this.authService.currentUser) {
            var userId = this.authService.currentUser.id;
            var where = "NguoiDungId = '" + userId + "'";
            this.nguoidungtoanhaService.getItems(0, 1, where, "x").subscribe(result => this.getNguoiDungToaNha(result), error => {
                this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng tòa nhà từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
        }
        //this.loadAllTangLau();
    }

    getNguoiDungToaNha(list: NguoiDungToaNha[]) {
        if (list.length > 0) {
            this.objNDTN = list[0];
            this.loadAllTangLau(this.objNDTN.toaNhaId, this.objNDTN.toaNha.cumToaNhaId);
            this.loadAllMatBang(0, this.objNDTN.toaNhaId, this.objNDTN.toaNha.cumToaNhaId);
        }
    }

    loadAllTangLau(toanha: number, cumtoanha: number) {
        this.tanglauService.getTangLauByToaNha(toanha, cumtoanha).subscribe(results => this.onDataLoadTangLauSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadTangLauSuccessful(obj: TangLau[]) {
        this.tanglau = obj;
    }
    loadAllKhachHang() {
        this.khachHangService.getAllKhachHang().subscribe(results => this.onDataLoadKhachHangSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadKhachHangSuccessful(obj: KhachHang[]) {
        this.khachHang = obj;
    }
    loadAllMatBang(tanglau: number, toanha: number, cumtoanha: number, ) {
        this.matbangService.getMatBangByToaNha(tanglau, toanha, cumtoanha).subscribe(results => this.onDataLoadMatBangSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadMatBangSuccessful(obj: MatBang[]) {
        this.matBang = obj;
    }
    loadAllLoaiDichVu() {
        this.loaidichvuService.listDVCB().subscribe(results => this.onDataLoadLoaiDichVuSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadLoaiDichVuSuccessful(obj: LoaiDichVu[]) {
        this.loaiDichVu = obj;
    }
    loadAllDonViTinh() {
        this.donvitinhService.getAllDonViTinh().subscribe(results => this.onDataLoadDonViTinhSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadDonViTinhSuccessful(obj: DonViTinh[]) {
        this.donViTinh = obj;
    }
    loadAllLoaiTien() {
        this.loaitienService.getAllLoaiTien().subscribe(results => this.onDataLoadLoaiTienSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadLoaiTienSuccessful(obj: LoaiTien[]) {
        this.loaiTien = obj;
    }

    ngAfterViewInit() {
        this.DichVuCoBanEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.DichVuCoBanEditor.editorModal.hide();
        };

        this.DichVuCoBanEditor.changesCancelledCallback = () => {
            this.dichvucobanEdit = null;
            this.sourcedichvucoban = null;
            this.DichVuCoBanEditor.editorModal.hide();
        };
    }

    addNewToList() {
        this.loadData(0, 0, 0, this.valueDate);
        if (this.sourcedichvucoban) {
            Object.assign(this.sourcedichvucoban, this.dichvucobanEdit);
            this.dichvucobanEdit = null;
            this.sourcedichvucoban = null;
        }
        else {
            let objDichVuCoBan = new DichVuCoBan();
            Object.assign(objDichVuCoBan, this.dichvucobanEdit);
            this.dichvucobanEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objDichVuCoBan).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objDichVuCoBan);
            this.rows.splice(0, 0, objDichVuCoBan);
        }
    }

    loadData(tanglauId: number, loaidichvuId: number, status: number, date: Date) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        //this.dichvucobanService.getAllDichVuCoBan().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
        if (tanglauId == 0 && loaidichvuId == 0 && status == 0) {
            this.dichvucobanService.filterByDate(date.getMonth(), date.getFullYear()).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
        } else
            this.dichvucobanService.getItemByFilter(tanglauId, loaidichvuId, status, date.getMonth(), date.getFullYear()).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: DichVuCoBan[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        obj.forEach((item, index, obj) => {
            (<any>item).index = index + 1;
        });

        this.rowsCache = [...obj];
        this.rows = obj;
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    newDichVuCoBan() {
        this.editingRowName = null;
        this.sourcedichvucoban = null;
        this.DichVuCoBanEditor.tanglau = this.tanglau;
        this.DichVuCoBanEditor.khachHang = this.khachHang;
        this.DichVuCoBanEditor.loaiDichVu = this.loaiDichVu;
        this.DichVuCoBanEditor.loaiTien = this.loaiTien;
        this.DichVuCoBanEditor.donViTinh = this.donViTinh;
        this.DichVuCoBanEditor.isViewDetails = false;
        this.dichvucobanEdit = this.DichVuCoBanEditor.newDichVuCoBan();
        this.DichVuCoBanEditor.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.soChungTu, r.matBangs.tenMatBang, r.khachHangs.ten, r.thanhTien));
    }

    deleteDichVuCoBan(row: DichVuCoBan) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: DichVuCoBan) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.dichvucobanService.deleteDichVuCoBan(row.dichVuCoBanId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
                this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
            },
                error => {
                    this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;
                    this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                });
    }

    editDichVuCoBan(row: DichVuCoBan) {
        //this.editingRowName = { name: row.tenichVuCoBan };
        this.sourcedichvucoban = row;        
        this.DichVuCoBanEditor.tanglau = this.tanglau;
        this.DichVuCoBanEditor.khachHang = this.khachHang;
        this.DichVuCoBanEditor.matBang = this.matBang;
        this.DichVuCoBanEditor.loaiDichVu = this.loaiDichVu;
        this.DichVuCoBanEditor.loaiTien = this.loaiTien;
        this.DichVuCoBanEditor.donViTinh = this.donViTinh;
        this.DichVuCoBanEditor.ChktangLau = true;
        this.dichvucobanEdit = this.DichVuCoBanEditor.editDichVuCoBan(row);
        try {
            this.DichVuCoBanEditor.valueTuNgay = new Date(row.tuNgay.toString());
            this.DichVuCoBanEditor.valueDenNgay = new Date(row.denNgay.toString());
            this.DichVuCoBanEditor.valueNgayChungTu = new Date(row.ngayChungTu.toString());
            this.DichVuCoBanEditor.valueNgayThanhToan = new Date(row.ngayThanhToan.toString());
        }
        catch{
            this.DichVuCoBanEditor.valueNgayThanhToan = new Date();
            this.DichVuCoBanEditor.valueNgayChungTu = new Date();
            this.DichVuCoBanEditor.valueTuNgay = new Date();
            this.DichVuCoBanEditor.valueDenNgay = new Date();
        }
        this.DichVuCoBanEditor.isViewDetails = false;
        this.DichVuCoBanEditor.editorModal.show();
    }

    viewDichVuCoBan(row: DichVuCoBan) {
        //this.editingRowName = { name: row.tenichVuCoBan };
        this.sourcedichvucoban = row;
        this.DichVuCoBanEditor.khachHang = this.khachHang;
        this.DichVuCoBanEditor.matBang = this.matBang;
        this.DichVuCoBanEditor.loaiDichVu = this.loaiDichVu;
        this.DichVuCoBanEditor.loaiTien = this.loaiTien;
        this.DichVuCoBanEditor.donViTinh = this.donViTinh;
        if (row.lapLai == true) {
            row.ngayChungTu = this.valueDate;
            row.tuNgay = new Date(this.valueDate.getFullYear(), this.valueDate.getMonth(), 1);
            row.denNgay = new Date(this.valueDate.getFullYear(), this.valueDate.getMonth() + 1, 0);
            this.dichvucobanEdit = this.DichVuCoBanEditor.editDichVuCoBan(row);
        } else {
            this.dichvucobanEdit = this.DichVuCoBanEditor.editDichVuCoBan(row);
        }
        this.DichVuCoBanEditor.isViewDetails = true;
        this.DichVuCoBanEditor.editorModal.show();
    }

    changeRandomString() {
        this.randomString = Utilities.RandomText(10);
    }

    formatPrice(price: string): string {
        if (price) {
            var pN = Number(price);
            var fm = Utilities.formatNumber(pN);
            return fm;
        } else return "";
    }

    printDiv(selected: any[]) {        
        var myWindow = window.open('', '', 'width=200,height=100');
        var dateTuNgay = new Date(this.valueDate.getFullYear(), this.valueDate.getMonth(), 1);
        var dateDenNgay = new Date(this.valueDate.getFullYear(), this.valueDate.getMonth() + 1, 0);
        for (let item of selected) {
            myWindow.document.write("<div style='font-size: 1em; padding: 4% 5%; height: 45%;'><div style='width: 100%; display: flex;'>");
            myWindow.document.write("<div style='width: 45%; margin-left: 5%; text-align: center'>");
            myWindow.document.write("<div style='font-weight: bold;'>CÔNG TY CỔ PHẦN ĐẦU TƯ VÀ DỊCH VỤ ĐÔ THỊ VIỆT NAM VINASINCO</div><div>Số chứng từ: " + item.soChungTu + "</div>");
            myWindow.document.write("</div>");
            myWindow.document.write("<div style='width: 45%; margin-left: 5%; text-align: center'>");
            myWindow.document.write("<div style='text-transform: uppercase; font-size: 24px; font-weight: bold;'>Phiếu thu tiền</div><br/>");
            if (item.laplai == true) {
                myWindow.document.write("<div>Từ ngày: " + this.datePipe.transform(dateTuNgay, 'dd/MM/yyyy') + " - " + this.datePipe.transform(dateDenNgay, 'dd/MM/yyyy') + "</div>");
            } else {
                myWindow.document.write("<div>Từ ngày: " + this.datePipe.transform(item.tuNgay, 'dd/MM/yyyy') + " - " + this.datePipe.transform(item.denNgay, 'dd/MM/yyyy') + "</div>");
            }            
            myWindow.document.write("</div></div>");
            myWindow.document.write("<br/>");
            myWindow.document.write("<div><p>Khách hàng: " + item.khachHangs.hoDem + " " + item.khachHangs.ten + "</p><p><span style='padding-right:15px;'>Địa chỉ:  tòa nhà " + item.matBangs.toanha.tenVietTat + " - tầng lầu " + item.matBangs.tanglau.tenTangLau + "</span><span>Căn hộ: " + item.matBangs.tenMatBang + "</span></p></div>");
            myWindow.document.write("<div class='clearfix'></div>");
            myWindow.document.write("<table style='border-collapse: collapse;border: 1px solid black; text-align: center;' width='100%'>");
            myWindow.document.write("<tr><td style='border: 1px solid black; width: 25%'>Loại dịch vụ</td><td style='border: 1px solid black; width: 20%'>Đơn giá</td><td style='border: 1px solid black; width: 13%'>Số lượng</td><td style ='border: 1px solid black; width: 17%'>Kỳ thanh toán</td><td style ='border: 1px solid black; width: 25%'>Thành tiền</td></tr>");
            myWindow.document.write("<tr><td style='border: 1px solid black;'>" + item.loaiDichVus.tenLoaiDichVu + "</td><td style='border: 1px solid black;'>" + this.formatPrice(item.donGia.toString()) + "</td><td style='border: 1px solid black;'>" + item.soLuong + "</td><td style='border: 1px solid black;'>" + item.kyThanhToan + "</td><td style='border: 1px solid black;'>" + this.formatPrice(item.thanhTien.toString()) + "</td></tr>");
            myWindow.document.write("<tr><td colspan='4' style='border: 1px solid black;text-align: right; padding-right: 10px;'>Tổng:</td><td style='border: 1px solid black;'>" + this.formatPrice(item.thanhTien.toString()) + "</td></tr>");
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
        }        
        myWindow.document.close();
        myWindow.print();
        myWindow.close();
    }

    importDichVuCoBan() {
        this.importexcel.khachHangs = this.khachHang;
        this.importexcel.matBangs = this.matBang;
        this.importexcel.loaiDichVus = this.loaiDichVu;
        this.importexcel.donViTinhs = this.donViTinh;
        this.importexcel.loaiTiens = this.loaiTien;
        this.importexcel.dvcbModal.show();
    }

    lapLaiEvent() {
        this.dichvucobanService.checkExpire().subscribe(results => {
            if (results != null) {
                this.dichvucobanService.addnewDichVuCoBan(results).subscribe(result => {
                    result.ngayChungTu = new Date();
                    result.ngayThanhToan = new Date();
                    result.tuNgay = new Date();
                    result.denNgay = new Date(result.denNgay.setMonth(result.tuNgay.getMonth() + Number(result.kyThanhToan)));
                })
            }
        });
    }

    SelectedTangLauValue(tanglauId: number, loaidichvuId: number, status: number, date: Date) {
        this.valueDate = date;
        this.loadData(tanglauId, loaidichvuId, status, date);
    }

    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }
}