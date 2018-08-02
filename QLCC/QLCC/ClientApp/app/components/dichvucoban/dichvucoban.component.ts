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

@Component({
    selector: "dichvucoban",
    templateUrl: "./dichvucoban.component.html",
    styleUrls: ["./dichvucoban.component.css"]
})

export class DichVuCoBanComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    randomString: string = Utilities.RandomText(10);
    columns: any[] = [];
    rows: DichVuCoBan[] = [];
    rowsCache: DichVuCoBan[] = [];
    matBang: MatBang[] = [];
    khachHang: KhachHang[] = [];
    loaiDichVu: LoaiDichVu[] = [];
    donViTinh: DonViTinh[] = [];
    loaiTien: LoaiTien[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    dichvucobanEdit: DichVuCoBan;
    sourcedichvucoban: DichVuCoBan;
    editingRowName: { name: string };
    selectFileUpload: string = "";
    arrayBuffer: any;
    file: File;


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

    @ViewChild('dichvucobanEditor')
    DichVuCoBanEditor: DichVuCoBanInfoComponent;

    constructor(private alertService: AlertService, private translationService: AppTranslationService,
        private dichvucobanService: DichVuCoBanService,
        private khachHangService: KhachHangService,
        private matbangService: MatBangService,
        private loaidichvuService: LoaiDichVuService,
        private donvitinhService: DonViTinhService,
        private loaitienService: LoaiTienService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
            { prop: 'soChungTu', name: gT('Số chứng từ')},
            { prop: 'matBangs.tenMatBang', name: gT('Tên mặt bằng')},
            { prop: 'khachHangs.ten', name: gT('Tên khách hàng')},
            { prop: 'loaiDichVus.tenLoaiDichVu', name: gT('Loại dịch vụ') },
            { name: gT('Tổng thanh toán'), cell: this.priceTemplate },
            { name: gT('Ngày bắt đầu'), cellTemplate: this.startTemplate },
            { name: gT('Ngày hết hạn'), cellTemplate: this.endTemplate },
            { prop: 'lapLai', name: gT('Lặp lại'), cellTemplate: this.nameTemplate },
            { prop: 'trangThai', name: gT('Trạng thái'), cellTemplate: this.descriptionTemplate },
            { name: gT('matbang.qlmb_chucnang'), width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];
        this.loadData();
        this.loadAllKhachHang();
        this.loadAllLoaiDichVu();
        this.loadAllLoaiTien();
        this.loadAllDonViTinh();
        this.loadAllMatBang();
    }

    loadAllKhachHang() {
        this.khachHangService.getAllKhachHang().subscribe(results => this.onDataLoadKhachHangSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadKhachHangSuccessful(obj: KhachHang[]) {
        this.khachHang = obj;
    }

    loadAllMatBang() {
        this.matbangService.getAllMatBang().subscribe(results => this.onDataLoadMatBangSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadMatBangSuccessful(obj: MatBang[]) {
        this.matBang = obj;
    }

    loadAllLoaiDichVu() {
        this.loaidichvuService.dequy().subscribe(results => this.onDataLoadLoaiDichVuSuccessful(results), error => this.onDataLoadFailed(error))
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
        this.loadData();
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
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.dichvucobanService.getAllDichVuCoBan().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
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
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.dichVuCoBanId,r.soChungTu,r.ngayChungTu,r.matBangId,r.khachHangId,r.loaiDichVuId,r.donViTinhId,r.donGia,r.soLuong,r.thanhTien,r.ngayThanhToan,r.kyThanhToan,r.tienThanhToan,r.tienTTQuyDoi,r.loaiTienId,r.tyGia,r.tuNgay,r.denNgay,r.dienGiai,r.lapLai,r.trangThai,r.ngayNhap,r.nguoiNhap,r.ngaySua,r.nguoiSua));
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

    incomingfile(event: any) {
        this.file = event.target.files[0];
    }

    UploadFile() {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; i++) {
                arr[i] = String.fromCharCode(data[i]);
            }
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary" });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
        }
        fileReader.readAsArrayBuffer(this.file);
    }
}