import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
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

    loadingIndicator: boolean;
    public formResetToggle = true;
    vattuEdit: VatTu;
    sourcevattu: VatTu;
    editingRowName: { name: string };

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

    @ViewChild('vattuEditor')
    VatTuEditor: VatTuInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService,
        private vattuService: VatTuService,
        private quoctichService: QuocTichService,
        private loaihangService: LoaiHangService,
        private hangsxService: HangSanXuatService,
        private nhaccService: NhaCungCapService,
        private donvitinhService: DonViTinhService,
        private phongbanService: PhongBanService,
        private loaitienService: LoaiTienService,
        private NDTNService: NguoiDungToaNhaService
    ) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
            { prop: 'maVatTu', name: gT('Mã VT')},
            { prop: 'tenVatTu', name: gT('Tên VT')},
            { prop: 'quocTichId', name: gT('Xuất xứ')},
            { prop: 'nhaCungCapId', name: gT('Nhà cung cấp')},
            { prop: 'maVachNSX', name: gT('Mã vạch NSX')},            
            { prop: 'serialNumber', name: gT('SerialNumber') },
            { prop: 'giaVatTu', name: gT('Giá VT') },
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
        this.vattuService.getAllVatTu().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: VatTu[]) {
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
        this.vattuEdit = this.VatTuEditor.newVatTu();
        this.VatTuEditor.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.vatTuId,r.maVatTu,r.tenVatTu,r.quocTichId,r.loaiHangId,r.hangSanXuatId,r.nhaCungCapId,r.donViTinhId,r.phongBanId,r.maVatTuCha,r.nguoiQuanLy,r.maVachNSX,r.loaiTienId,r.giaVatTu,r.model,r.partNumber,r.serialNumber,r.thongSoKyThuat,r.ngayLap,r.namSD,r.ngayHHBaoHanh,r.khauHao,r.donViKhauHao,r.trangThai,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
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
        this.VatTuEditor.quoctichs = this.quoctichs;
        this.VatTuEditor.loaihangs = this.loaihangs;
        this.VatTuEditor.hangSX = this.hangSX;
        this.VatTuEditor.nhaCC = this.nhaCC;
        this.VatTuEditor.donvitinhs = this.donvitinhs;
        this.VatTuEditor.phongbans = this.phongbans;
        this.VatTuEditor.loaitiens = this.loaitiens;
        this.VatTuEditor.NDTN = this.NDTN;
        this.vattuEdit = this.VatTuEditor.editVatTu(row);
        this.VatTuEditor.editorModal.show();
    }    
}