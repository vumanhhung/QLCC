import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { VatTuYeuCauService } from "../../services/vattuyeucau.service";
import { VatTuYeuCau } from "../../models/vattuyeucau.model";
import { VatTuYeuCauInfoComponent } from "./vattuyeucau-info.component";
import { QuocTichService } from '../../services/quoctich.service';
import { DonViTinhService } from '../../services/donvitinh.service';
import { PhongBanService } from '../../services/phongban.service';
import { QuocTich } from '../../models/quoctich.model';
import { PhongBan } from '../../models/phongban.model';
import { DonViTinh } from '../../models/donvitinh.model';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';
import { AuthService } from '../../services/auth.service';
import { VatTuPhieuYeuCauService } from '../../services/vattuphieuyeucau.service';
import { VatTuPhieuYeuCau } from '../../models/vattuphieuyeucau.model';

@Component({
    selector: "vattuyeucau",
    templateUrl: "./vattuyeucau.component.html",
    styleUrls: ["./vattuyeucau.component.css"]
})

export class VatTuYeuCauComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: VatTuPhieuYeuCau[] = [];
    rowsCache: VatTuPhieuYeuCau[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    vattuyeucauEdit: VatTuYeuCau;
    sourcevattuyeucau: VatTuYeuCau;
    editingRowName: { name: string };

    quoctichs: QuocTich[] = [];
    phongbans: PhongBan[] = [];
    donvitinhs: DonViTinh[] = [];
    NDTN: NguoiDungToaNha[] = [];
    objNDTN: NguoiDungToaNha = new NguoiDungToaNha();

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

    @ViewChild('vattuyeucauEditor')
    VatTuYeuCauEditor: VatTuYeuCauInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService,
        private vattuyeucauService: VatTuYeuCauService,
        private vattuphieuyeucauService: VatTuPhieuYeuCauService,
        private phongbanService: PhongBanService,
        private NDTNService: NguoiDungToaNhaService,
        private authService: AuthService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },      
            { prop: 'phongbans.tenPhongBan', name: gT('Phòng Ban') },
            { prop: 'nguoiYeuCau', name: gT('Người Yêu Cầu')},
            { prop: 'mucDichSuDung', name: gT('Mục đích sử dụng')},   
            { prop: 'trangThai', name: gT('TrangThai'), cellTemplate: this.descriptionTemplate},
            { name: gT('Chức năng'), width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];
        if (this.authService.currentUser) {
            var userId = this.authService.currentUser.id;
            var where = "NguoiDungId = '" + userId + "'";
            this.NDTNService.getItems(0, 1, where, "x").subscribe(result => this.getNguoiDungToaNha(result), error => {
                this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng tòa nhà từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
        }
        this.loadAllNDTN();
        this.loadData();
    }

    getNguoiDungToaNha(list: NguoiDungToaNha[]) {
        if (list.length > 0) {
            this.objNDTN = list[0];
            this.loadAllPhongBan(this.objNDTN.toaNhaId, this.objNDTN.cumToaNhaId);
        }
    }
    
    ngAfterViewInit() {
        this.VatTuYeuCauEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.VatTuYeuCauEditor.editorModal.hide();
        };

        this.VatTuYeuCauEditor.changesCancelledCallback = () => {
            this.vattuyeucauEdit = null;
            this.sourcevattuyeucau = null;
            this.VatTuYeuCauEditor.editorModal.hide();
        };
    }

    loadAllPhongBan(toanha: number, cumtoanha: number) {
        this.phongbanService.getPhongBanByToaNha(toanha, cumtoanha).subscribe(results => this.onDataLoadPhongBanSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadPhongBanSuccessful(obj: PhongBan[]) {
        this.phongbans = obj;
    }

    loadAllNDTN() {
        this.NDTNService.getAllNguoiDungToaNha().subscribe(results => this.onDataLoadNDTNSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadNDTNSuccessful(obj: NguoiDungToaNha[]) {
        this.NDTN = obj;
    }
    
    addNewToList() {
        if (this.sourcevattuyeucau) {
            Object.assign(this.sourcevattuyeucau, this.vattuyeucauEdit);
            this.vattuyeucauEdit = null;
            this.sourcevattuyeucau = null;
        }
        else {
            let objVatTuYeuCau = new VatTuPhieuYeuCau();
            Object.assign(objVatTuYeuCau, this.vattuyeucauEdit);
            this.vattuyeucauEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objVatTuYeuCau).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objVatTuYeuCau);
            this.rows.splice(0, 0, objVatTuYeuCau);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.vattuphieuyeucauService.getAllVatTuPhieuYeuCau().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: VatTuPhieuYeuCau[]) {
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

    newVatTuYeuCau() {
        this.editingRowName = null;
        this.sourcevattuyeucau = null;
        this.VatTuYeuCauEditor.phongbans = this.phongbans;
        this.VatTuYeuCauEditor.NDTN = this.NDTN;
        this.vattuyeucauEdit = this.VatTuYeuCauEditor.newVatTuYeuCau();
        this.VatTuYeuCauEditor.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        //this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.yeuCauvatTuId,r.phieuYeuCauVTId,r.vatTuId,r.donViTinhId,r.quocTichId,r.soLuong,r.ghiChu,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteVatTuYeuCau(row: VatTuPhieuYeuCau) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: VatTuPhieuYeuCau) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.vattuyeucauService.deleteVatTuYeuCau(row.phieuYeuCauVTId)
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

    editVatTuYeuCau(row: VatTuYeuCau) {
        //this.editingRowName = { name: row.tenVatTuYeuCau };
        this.sourcevattuyeucau = row;
        this.vattuyeucauEdit = this.VatTuYeuCauEditor.editVatTuYeuCau(row);
        this.VatTuYeuCauEditor.editorModal.show();
    }    
}