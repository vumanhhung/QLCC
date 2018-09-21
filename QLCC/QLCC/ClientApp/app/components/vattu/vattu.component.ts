﻿import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { VatTuService } from "../../services/vattu.service";
import { VatTu } from "../../models/vattu.model";
import { VatTuInfoComponent } from "./vattu-info.component";
import { QuocTichService } from '../../services/quoctich.service';
import { LoaiHangService } from '../../services/loaihang.service';
import { HangSanXuatService } from '../../services/hangsanxuat.service';
import { NhaCungCap } from '../../models/nhacungcap.model';
import { NhaCungCapService } from '../../services/nhacungcap.service';
import { DonViTinhService } from '../../services/donvitinh.service';
import { PhongBanService } from '../../services/phongban.service';
import { LoaiTienService } from '../../services/loaitien.service';
import { QuocTich } from '../../models/quoctich.model';
import { LoaiTien } from '../../models/loaitien.model';
import { HangSanXuat } from '../../models/hangsanxuat.model';
import { DonViTinh } from '../../models/donvitinh.model';
import { PhongBan } from '../../models/phongban.model';
import { LoaiHang } from '../../models/loaihang.model';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';
import { VatTuHinhAnhService } from '../../services/vattuhinhanh.service';
import { VatTuTaiLieuService } from '../../services/vattutailieu.service';
import { VatTuHinhAnh } from '../../models/vattuhinhanh.model';
import { VatTuTaiLieu } from '../../models/vattutailieu.model';
import { VatTuDetailComponent } from './vattu-detail.component';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import saveAs from 'save-as';

@Component({
    selector: "vattu",
    templateUrl: "./vattu.component.html",
    styleUrls: ["./vattu.component.css"]
})

export class VatTuComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];

    rows: VatTu[] = [];
    rowsCache: VatTu[] = [];
    quoctichs: QuocTich[] = [];
    loaihangs: LoaiHang[] = [];
    hangSX: HangSanXuat[] = [];
    nhaCC: NhaCungCap[] = [];
    donvitinhs: DonViTinh[] = [];
    phongbans: PhongBan[] = [];
    loaitiens: LoaiTien[] = [];
    NDTN: NguoiDungToaNha[] = [];
    vattuCha: VatTu[] = [];

    loadingIndicator: boolean;
    public formResetToggle = true;
    vattuEdit: VatTu;
    vattuHinhAnhEdit: VatTuHinhAnh;
    vattuTaiLieuEdit: VatTuTaiLieu;
    sourcevattu: VatTu;
    editingRowName: { name: string };

    @ViewChild('f')
    private form;

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('nameTemplate')
    nameTemplate: TemplateRef<any>;

    @ViewChild('priceTemplate')
    priceTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('vattuEditor')
    VatTuEditor: VatTuInfoComponent;

    @ViewChild('vattuDetailEditor')
    vattuDetailEditor: VatTuDetailComponent;

    constructor(private alertService: AlertService, private translationService: AppTranslationService,
        private vattuService: VatTuService,
        private quoctichService: QuocTichService,
        private loaihangService: LoaiHangService,
        private hangsxService: HangSanXuatService,
        private nhaccService: NhaCungCapService,
        private donvitinhService: DonViTinhService,
        private phongbanService: PhongBanService,
        private loaitienService: LoaiTienService,
        private NDTNService: NguoiDungToaNhaService,
        private vattuhinhanhservice: VatTuHinhAnhService,
        private vattutailieuservice: VatTuTaiLieuService
    ) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
            { prop: 'maVatTu', name: gT('Mã VT')},
            { prop: 'tenVatTu', name: gT('Tên VT')},
            { prop: 'quocTichs.tenNuoc', name: gT('Xuất xứ')},
            { prop: 'nhaCungCaps.tenNhaCungCap', name: gT('Nhà cung cấp')},
            { prop: 'maVachNSX', name: gT('Mã vạch NSX')},            
            { prop: 'serialNumber', name: gT('SerialNumber') },
            { prop: 'giaVatTu', name: gT('Giá VT'), cellTemplate: this.priceTemplate },
            { name: gT('Chức năng'), width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];
        this.loadAllQuocTich();
        this.loadAllLoaiHang();
        this.loadAllHangSanXuat();
        this.loadAllNhaCungCap();
        this.loadAllPhongBan();
        this.loadAllLoaiTien();
        this.loadAllDonViTinh();
        this.loadAllNDTN();
        this.loadData();
    }

    loadAllQuocTich() {
        this.quoctichService.getAllQuocTich().subscribe(results => this.onDataLoadQuocTichSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadQuocTichSuccessful(obj: QuocTich[]) {
        this.quoctichs = obj;
    }

    loadAllLoaiHang() {
        this.loaihangService.getAllLoaiHang().subscribe(results => this.onDataLoadLoaiHangSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadLoaiHangSuccessful(obj: LoaiHang[]) {
        this.loaihangs = obj;
    }

    loadAllHangSanXuat() {
        this.hangsxService.getAllHangSanXuat().subscribe(results => this.onDataLoadHangSanXuatSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadHangSanXuatSuccessful(obj: HangSanXuat[]) {
        this.hangSX = obj;
    }

    loadAllNhaCungCap() {
        this.nhaccService.getAllNhaCungCap().subscribe(results => this.onDataLoadNhaCungCapSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadNhaCungCapSuccessful(obj: NhaCungCap[]) {
        this.nhaCC = obj;
    }

    loadAllPhongBan() {
        this.phongbanService.getAllPhongBan().subscribe(results => this.onDataLoadPhongBanSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadPhongBanSuccessful(obj: PhongBan[]) {
        this.phongbans = obj;
    }

    loadAllDonViTinh() {
        this.donvitinhService.getAllDonViTinh().subscribe(results => this.onDataLoadDonViTinhSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadDonViTinhSuccessful(obj: DonViTinh[]) {
        this.donvitinhs = obj;
    }

    loadAllLoaiTien() {
        this.loaitienService.getAllLoaiTien().subscribe(results => this.onDataLoadLoaiTienSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadLoaiTienSuccessful(obj: LoaiTien[]) {
        this.loaitiens = obj;
    }

    loadAllNDTN() {
        this.NDTNService.getAllNguoiDungToaNha().subscribe(results => this.onDataLoadNDTNSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadNDTNSuccessful(obj: NguoiDungToaNha[]) {
        this.NDTN = obj;
    }
    
    ngAfterViewInit() {
        this.VatTuEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.VatTuEditor.editorModal.hide();
        };

        this.VatTuEditor.changesCancelledCallback = () => {
            this.vattuEdit = null;
            this.sourcevattu = null;
            this.VatTuEditor.editorModal.hide();
        };
    }
    
    addNewToList() {
        this.loadData();
        if (this.sourcevattu) {
            Object.assign(this.sourcevattu, this.vattuEdit);
            this.vattuEdit = null;
            this.sourcevattu = null;
        }
        else {
            let objVatTu = new VatTu();
            Object.assign(objVatTu, this.vattuEdit);
            this.vattuEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objVatTu).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objVatTu);
            this.rows.splice(0, 0, objVatTu);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.vattuService.getAllVatTu().subscribe(results => {
            this.onDataLoadSuccessful(results);
        }, error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: VatTu[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        obj.forEach((item, index, obj) => {
            (<any>item).index = index + 1;
        });
        this.vattuCha = obj;
        this.rowsCache = [...obj];
        this.rows = obj;
    }
    
    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }
    
    onEditorModalHidden() {
        this.editingRowName = null;
        this.VatTuEditor.resetForm(true);
    }

    newVatTu() {
        this.editingRowName = null;
        this.sourcevattu = null;
        this.VatTuEditor.quoctichs = this.quoctichs;
        this.VatTuEditor.loaihangs = this.loaihangs;
        this.VatTuEditor.hangSX = this.hangSX;
        this.VatTuEditor.nhaCC = this.nhaCC;
        this.VatTuEditor.donvitinhs = this.donvitinhs;
        this.VatTuEditor.phongbans = this.phongbans;
        this.VatTuEditor.loaitiens = this.loaitiens;
        this.VatTuEditor.NDTN = this.NDTN;
        this.VatTuEditor.vattuCha = this.vattuCha;
        this.VatTuEditor.isViewDetails = false;
        this.VatTuEditor.step1 = true;
        this.vattuEdit = this.VatTuEditor.newVatTu();
        this.VatTuEditor.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.maVatTu, r.tenVatTu, r.quocTichs.tenNuoc, r.nhaCungCaps.tenNhaCungCap, r.maVachNSX, r.serialNumber, r.giaVatTu));
    }

    deleteVatTu(row: VatTu) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: VatTu) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.vattuService.deleteVatTu(row.vatTuId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.vattuhinhanhservice.deleteAllVatTuHinhAnh(row.vatTuId).subscribe(results => { console.log(results) }, error => { console.log(error) });
                this.vattutailieuservice.deleteAllVatTuTaiLieu(row.vatTuId).subscribe(results => { console.log(results) }, error => { console.log(error) });
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

    editVatTu(row: VatTu) {
        this.editingRowName = { name: row.tenVatTu };
        this.sourcevattu = row;
        this.VatTuEditor.checkTen = true;
        this.VatTuEditor.quoctichs = this.quoctichs;
        this.VatTuEditor.loaihangs = this.loaihangs;
        this.VatTuEditor.hangSX = this.hangSX;
        this.VatTuEditor.nhaCC = this.nhaCC;
        this.VatTuEditor.donvitinhs = this.donvitinhs;
        this.VatTuEditor.phongbans = this.phongbans;
        this.VatTuEditor.loaitiens = this.loaitiens;
        this.VatTuEditor.NDTN = this.NDTN;
        this.VatTuEditor.vattuCha = this.vattuCha;
        this.VatTuEditor.isViewDetails = false;
        this.VatTuEditor.isEdit = true;
        this.VatTuEditor.step1 = true;
        this.VatTuEditor.step2 = false;
        this.VatTuEditor.step3 = false;
        this.vattuEdit = this.VatTuEditor.editVatTu(row);        
        this.VatTuEditor.editorModal.show();
    } 

    viewVatTu(row: VatTu) {
        //this.editingRowName = { name: row.tenichVuCoBan };
        this.vattuDetailEditor.vattuEdit = row;
        this.vattuDetailEditor.isViewDetails = true;
        this.vattuDetailEditor.quoctichs = this.quoctichs;
        this.vattuDetailEditor.loaihangs = this.loaihangs;
        this.vattuDetailEditor.hangSX = this.hangSX;
        this.vattuDetailEditor.nhaCC = this.nhaCC;
        this.vattuDetailEditor.donvitinhs = this.donvitinhs;
        this.vattuDetailEditor.phongbans = this.phongbans;
        this.vattuDetailEditor.loaitiens = this.loaitiens;
        this.vattuhinhanhservice.getVatTuHinhAnhByID(row.vatTuId).subscribe(results => this.vattuDetailEditor.VTHAs = results, error => { });
        this.vattutailieuservice.getVatTuTaiLieuByID(row.vatTuId).subscribe(result => this.vattuDetailEditor.VTTLs = result, error => { });
        this.vattuDetailEditor.editorModal1.show();
    }

    formatPrice(price: string): string {
        if (price) {
            var pN = Number(price);
            var fm = Utilities.formatNumber(pN);
            return fm;
        } else return "";
    }

    download(id: number, name: string) {
        console.log(name);
        var zip = new JSZip();
        var count = 0;
        this.vattutailieuservice.getVatTuTaiLieuByID(id).subscribe(results => {
            results.forEach(function (files) {
                console.log(files);
                JSZipUtils.getBinaryContent(files, function (err, data) {
                    if (err) {
                        throw err;
                    }
                    zip.file(files.tenTaiLieu, data);
                    count++;
                    if (count == results.length) {
                        zip.generateAsync({ type: 'blob' }).then(function (content) {
                            saveAs(content, name + ".zip");
                        });
                    }
                });
            });
        })
    }
}