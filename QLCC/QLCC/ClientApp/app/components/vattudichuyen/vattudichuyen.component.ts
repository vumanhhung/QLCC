import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { VatTuDiChuyenService } from "../../services/vattudichuyen.service";
import { VatTuDiChuyen } from "../../models/vattudichuyen.model";
import { VatTuDiChuyenInfoComponent } from "./vattudichuyen-info.component";
import { VatTuPhieuYeuCauService } from '../../services/vattuphieuyeucau.service';
import { AuthService } from '../../services/auth.service';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';
import { PhongBanService } from '../../services/phongban.service';
import { VatTuPhieuYeuCau } from '../../models/vattuphieuyeucau.model';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { PhongBan } from '../../models/phongban.model';
import { VatTuPhieuDiChuyen } from '../../models/vattuphieudichuyen.model';
import { VatTuPhieuDiChuyenService } from '../../services/vattuphieudichuyen.service';
import { VatTuService } from '../../services/vattu.service';
import { VatTu } from '../../models/vattu.model';

@Component({
    selector: "vattudichuyen",
    templateUrl: "./vattudichuyen.component.html",
    styleUrls: ["./vattudichuyen.component.css"]
})

export class VatTuDiChuyenComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: VatTuPhieuDiChuyen[] = [];
    rowsCache: VatTuPhieuDiChuyen[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    vattudichuyenEdit: VatTuDiChuyen;
    sourcevattudichuyen: VatTuDiChuyen;
    vattuphieudichuyenEdit: VatTuPhieuDiChuyen;
    sourcevattuphieudichuyen: VatTuPhieuDiChuyen;
    editingRowName: { name: string };

    dexuats: VatTuPhieuYeuCau[] = [];
    phongbans: PhongBan[] = [];
    NDTNs: NguoiDungToaNha[] = [];
    vattusFilter: VatTu[] = [];
    objNDTN: NguoiDungToaNha = new NguoiDungToaNha();
    selectedGropup: number = 0;
    dvyc: string = "";
    dvtn: string = "";

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

    @ViewChild('vattudichuyenEditor')
    VatTuDiChuyenEditor: VatTuDiChuyenInfoComponent;

    @ViewChild('myTable') table: any;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private authService: AuthService,
        private vattuphieuyeucauservice: VatTuPhieuYeuCauService, private vattuservice: VatTuService,
        private vattudichuyenService: VatTuDiChuyenService, private vattuphieudichuyenservice: VatTuPhieuDiChuyenService,
        private NDTNService: NguoiDungToaNhaService, private phongbanservice: PhongBanService) {
    }
    
    ngOnInit() {        
        if (this.authService.currentUser) {            
            var userId = this.authService.currentUser.id;
            var where = "NguoiDungId = '" + userId + "'";
            this.NDTNService.getItems(0, 1, where, "x").subscribe(result => this.getNguoiDungToaNha(result), error => {
                this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng tòa nhà từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
                });
        }          
        this.loadAllDeXuat();
        this.loadVatTu();
        this.loadData(0);  
    }

    getNguoiDungToaNha(list: NguoiDungToaNha[]) {
        if (list.length > 0) {
            this.objNDTN = list[0];
            this.loadAllPhongBan(this.objNDTN.toaNhaId, this.objNDTN.cumToaNhaId);
        }
    }

    loadAllPhongBan(toanha: number, cumtoanha: number) {
        this.phongbanservice.getPhongBanByToaNha(toanha, cumtoanha).subscribe(results => this.onDataLoadPhongBanSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadPhongBanSuccessful(obj: PhongBan[]) {
        this.phongbans = obj;
    }

    loadAllDeXuat() {
        this.vattuphieuyeucauservice.getAllVatTuPhieuYeuCau().subscribe(results => this.onDataLoadDeXuatSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadDeXuatSuccessful(obj: VatTuPhieuYeuCau[]) {
        this.dexuats = obj.filter(o => o.trangThai == 2);
    }

    loadAllNDTN() {
        this.NDTNService.getAllNguoiDungToaNha().subscribe(results => this.onDataLoadNDTNSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadNDTNSuccessful(obj: NguoiDungToaNha[]) {
        this.NDTNs = obj;
    }

    loadVatTu() {
        this.alertService.startLoadingMessage();
        this.vattuservice.getAllVatTu().subscribe(result => this.onDataLoadVatTuSuccessful(result), error => this.onDataLoadFailed(error));
    }

    private onDataLoadVatTuSuccessful(obj: VatTu[]) {
        this.alertService.stopLoadingMessage();
        this.vattusFilter = obj;
    }
    
    ngAfterViewInit() {
        this.VatTuDiChuyenEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.VatTuDiChuyenEditor.editorModal.hide();
        };

        this.VatTuDiChuyenEditor.changesCancelledCallback = () => {
            this.vattudichuyenEdit = null;
            this.sourcevattudichuyen = null;
            this.VatTuDiChuyenEditor.editorModal.hide();
        };
    }
    
    addNewToList() {
        this.loadData(0);
        if (this.sourcevattudichuyen) {
            Object.assign(this.sourcevattudichuyen, this.vattudichuyenEdit);
            this.vattudichuyenEdit = null;
            this.sourcevattudichuyen = null;
        }
        else {
            let objVatTuPhieuDiChuyen = new VatTuPhieuDiChuyen();
            Object.assign(objVatTuPhieuDiChuyen, this.vattudichuyenEdit);
            this.vattudichuyenEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objVatTuPhieuDiChuyen).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objVatTuPhieuDiChuyen);
            this.rows.splice(0, 0, objVatTuPhieuDiChuyen);
        }
    }

    loadData(status: number) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.vattuphieudichuyenservice.getAllVatTuPhieuDiChuyen().subscribe(results => {
            if (status == 0) {
                this.onDataLoadSuccessful(results);
            } else {
                this.onDataLoadSuccessful(results.filter(o => o.trangThai == status));
            }
        }, error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: VatTuPhieuDiChuyen[]) {
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

    newVatTuDiChuyen() {
        this.editingRowName = null;
        this.sourcevattudichuyen = null;
        this.VatTuDiChuyenEditor.phongbans = this.phongbans;
        this.VatTuDiChuyenEditor.dexuats = this.dexuats;
        this.VatTuDiChuyenEditor.NDTN = this.NDTNs;
        this.VatTuDiChuyenEditor.vattusFilter = this.vattusFilter;
        this.vattudichuyenEdit = this.VatTuDiChuyenEditor.newVatTuDiChuyen();
        this.VatTuDiChuyenEditor.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        //this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.vatTuDiChuyenId,r.phieuDiChuyenId,r.vatTuId,r.donViTinhId,r.quocTichId,r.soLuong,r.ghiChu,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteVatTuDiChuyen(row: VatTuPhieuDiChuyen) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: VatTuPhieuDiChuyen) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.vattudichuyenService.deleteVatTuDiChuyen(row.phieuDiChuyenId)
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

    editVatTuDiChuyen(row: VatTuPhieuDiChuyen) {
        this.sourcevattuphieudichuyen = row;
        this.VatTuDiChuyenEditor.phongbans = this.phongbans;
        this.VatTuDiChuyenEditor.dexuats = this.dexuats;
        this.VatTuDiChuyenEditor.NDTN = this.NDTNs;
        this.VatTuDiChuyenEditor.vattusFilter = this.vattusFilter;
        this.vattudichuyenEdit = this.VatTuDiChuyenEditor.editVatTuDiChuyen(row);
        this.VatTuDiChuyenEditor.editorModal.show();
    }    

    SelectedStatusValue(status: number) {
        this.loadData(status);
    }

    toggleExpandRow(row) {
        this.table.rowDetail.toggleExpandRow(row);
    }
}