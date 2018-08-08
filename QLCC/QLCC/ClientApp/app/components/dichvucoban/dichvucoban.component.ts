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
import { formatDate } from '@telerik/kendo-intl';
import { DichVuCoBanImportComponent } from './dichvucoban-import.component';
import { DatePipe } from '@angular/common';
import { TangLau } from '../../models/tanglau.model';
import { TangLauService } from '../../services/tanglau.service';
import { take } from 'rxjs/operator/take';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { AuthService } from '../../services/auth.service';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';

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

    @ViewChild('f')
    private form;

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('nameTemplate')
    nameTemplate: TemplateRef<any>;

    @ViewChild('descriptionTemplate')
    descriptionTemplate: TemplateRef<any>;

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
        private authService: AuthService,
        private datePipe: DatePipe) {
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { headerTemplate: this.checkAllTemplate, width: 50, cellTemplate: this.checkTemplate, canAutoResize: false, sortable: false, draggable: false },
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'soChungTu', name: gT('Số chứng từ') },
            { prop: 'matBangs.tenMatBang', name: gT('Tên mặt bằng') },
            { prop: 'khachHangs.ten', name: gT('Tên khách hàng') },
            { name: gT('Tổng thanh toán'), cellTemplate: this.priceTemplate },
            { name: gT('Ngày bắt đầu'), cellTemplate: this.startTemplate },
            { name: gT('Ngày hết hạn'), cellTemplate: this.endTemplate },
            { prop: 'lapLai', name: gT('Lặp lại'), cellTemplate: this.nameTemplate },
            { prop: 'trangThai', name: gT('Trạng thái'), cellTemplate: this.descriptionTemplate },
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, canAutoResize: false, sortable: false, draggable: false }
        ];
        this.loadData(0, 0, 0);
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
        this.tanglauService.getTangLauByToaNha(toanha, cumtoanha).subscribe(results => {
            this.onDataLoadTangLauSuccessful(results)
        }, error => this.onDataLoadFailed(error));
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
        this.loadData(0, 0, 0);
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

    loadData(tanglauId: number, loaidichvuId: number, status: number) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        if (tanglauId > 0 || loaidichvuId > 0 || status > 0) {
            this.dichvucobanService.getItemByFilter(tanglauId, loaidichvuId, status).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
        } else {
            this.dichvucobanService.getAllDichVuCoBan().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
        }

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
        this.DichVuCoBanEditor.khachHang = this.khachHang;
        this.DichVuCoBanEditor.matBang = this.matBang;
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
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.dichVuCoBanId, r.soChungTu, r.ngayChungTu, r.matBangId, r.khachHangId, r.loaiDichVuId, r.donViTinhId, r.donGia, r.soLuong, r.thanhTien, r.ngayThanhToan, r.kyThanhToan, r.tienThanhToan, r.tienTTQuyDoi, r.loaiTienId, r.tyGia, r.tuNgay, r.denNgay, r.dienGiai, r.lapLai, r.trangThai, r.ngayNhap, r.nguoiNhap, r.ngaySua, r.nguoiSua));
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
        this.dichvucobanEdit = this.DichVuCoBanEditor.editDichVuCoBan(row);
        this.DichVuCoBanEditor.khachHang = this.khachHang;
        this.DichVuCoBanEditor.matBang = this.matBang;
        this.DichVuCoBanEditor.loaiDichVu = this.loaiDichVu;
        this.DichVuCoBanEditor.loaiTien = this.loaiTien;
        this.DichVuCoBanEditor.donViTinh = this.donViTinh;
        this.DichVuCoBanEditor.isViewDetails = false;
        this.DichVuCoBanEditor.editorModal.show();
    }

    viewDichVuCoBan(row: DichVuCoBan) {
        //this.editingRowName = { name: row.tenichVuCoBan };
        this.sourcedichvucoban = row;
        this.dichvucobanEdit = this.DichVuCoBanEditor.editDichVuCoBan(row);
        this.DichVuCoBanEditor.khachHang = this.khachHang;
        this.DichVuCoBanEditor.matBang = this.matBang;
        this.DichVuCoBanEditor.loaiDichVu = this.loaiDichVu;
        this.DichVuCoBanEditor.loaiTien = this.loaiTien;
        this.DichVuCoBanEditor.donViTinh = this.donViTinh;
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
        for (let item of selected) {
            myWindow.document.write("<div style='padding-top: 10px;'><p><span style='font-weight: bold;font-size: 14px;'>Số chứng từ: </span>" + item.soChungTu + "</p>")
            myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Ngày chứng từ: </span>" + this.datePipe.transform(item.ngayChungTu, 'dd/MM/yyyy') + "</p>");
            myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Mặt bằng: </span>" + item.matBangs.tenMatBang + "</p>");
            myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Khách hàng: </span>" + item.khachHangs.hoDem + " " + item.khachHangs.ten + "</p>");
            myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Loại dịch vụ: </span>" + item.loaiDichVus.tenLoaiDichVu + "</p>");
            myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Đơn vị tính: </span>" + item.donViTinhs.tenDonViTinh + "</p>");
            myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Diễn giải: </span>" + item.dienGiai + "</p>");
            myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Đơn giá: </span>" + this.formatPrice(item.donGia.toString()) + "</p>");
            myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Số lượng: </span>" + item.soLuong + "</p>");
            myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Thành tiền: </span>" + this.formatPrice(item.thanhTien.toString()) + "</p>");
            myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Ngày thanh toán: </span>" + this.datePipe.transform(item.ngayThanhToan, 'dd/MM/yyyy') + "</p>");
            myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Ngày bắt đầu: </span>" + this.datePipe.transform(item.tuNgay, 'dd/MM/yyyy') + "</p>");
            myWindow.document.write("<p><span style='font-weight: bold;font-size: 14px;'>Ngày hết hạn: </span>" + this.datePipe.transform(item.denNgay, 'dd/MM/yyyy') + "</p></div>");
            myWindow.document.write("<hr/>");
        }
        myWindow.focus();
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

    SelectedTangLauValue(tanglauId: number, loaidichvuId: number, status: number) {
        this.loadData(tanglauId, loaidichvuId, status);
    }

    filterDate(value: Date): void {
        console.log(formatDate(value, 'MM yyyy'));
        this.dichvucobanService.filterByDate(value.getMonth(), value.getFullYear()).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }
}