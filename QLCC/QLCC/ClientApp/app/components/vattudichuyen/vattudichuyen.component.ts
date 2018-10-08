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

@Component({
    selector: "vattudichuyen",
    templateUrl: "./vattudichuyen.component.html",
    styleUrls: ["./vattudichuyen.component.css"]
})

export class VatTuDiChuyenComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: VatTuDiChuyen[] = [];
    rowsCache: VatTuDiChuyen[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    vattudichuyenEdit: VatTuDiChuyen;
    sourcevattudichuyen: VatTuDiChuyen;
    editingRowName: { name: string };

    dexuats: VatTuPhieuYeuCau[] = [];
    phongbans: PhongBan[] = [];
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

    @ViewChild('vattudichuyenEditor')
    VatTuDiChuyenEditor: VatTuDiChuyenInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private authService: AuthService,
        private vattudichuyenService: VatTuDiChuyenService, private vattuphieuyeucauservice: VatTuPhieuYeuCauService,
        private NDTNService: NguoiDungToaNhaService, private phongbanservice: PhongBanService) {
    }
    
    ngOnInit() {
   //     let gT = (key: string) => this.translationService.getTranslation(key);

   //     this.columns = [
   //         { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			//{ prop: 'phieuDiChuyenId', name: gT('PhieuDiChuyenId')},
			//{ prop: 'vatTuId', name: gT('VatTuId')},
			//{ prop: 'donViTinhId', name: gT('DonViTinhId')},
			//{ prop: 'quocTichId', name: gT('QuocTichId')},
			//{ prop: 'soLuong', name: gT('SoLuong')},
			//{ prop: 'ghiChu', name: gT('GhiChu')},
			//{ prop: 'nguoiNhap', name: gT('NguoiNhap')},
			//{ prop: 'ngayNhap', name: gT('NgayNhap')},
			//{ prop: 'nguoiSua', name: gT('NguoiSua')},
			//{ prop: 'ngaySua', name: gT('NgaySua')},
   //         { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
   //     ];
        if (this.authService.currentUser) {
            var userId = this.authService.currentUser.id;
            var where = "NguoiDungId = '" + userId + "'";
            this.NDTNService.getItems(0, 1, where, "x").subscribe(result => this.getNguoiDungToaNha(result), error => {
                this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng tòa nhà từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
        }
        this.loadData();
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
        this.dexuats = obj;
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
        if (this.sourcevattudichuyen) {
            Object.assign(this.sourcevattudichuyen, this.vattudichuyenEdit);
            this.vattudichuyenEdit = null;
            this.sourcevattudichuyen = null;
        }
        else {
            let objVatTuDiChuyen = new VatTuDiChuyen();
            Object.assign(objVatTuDiChuyen, this.vattudichuyenEdit);
            this.vattudichuyenEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objVatTuDiChuyen).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objVatTuDiChuyen);
            this.rows.splice(0, 0, objVatTuDiChuyen);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.vattudichuyenService.getAllVatTuDiChuyen().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: VatTuDiChuyen[]) {
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
        this.vattudichuyenEdit = this.VatTuDiChuyenEditor.newVatTuDiChuyen();
        this.VatTuDiChuyenEditor.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.vatTuDiChuyenId,r.phieuDiChuyenId,r.vatTuId,r.donViTinhId,r.quocTichId,r.soLuong,r.ghiChu,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteVatTuDiChuyen(row: VatTuDiChuyen) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: VatTuDiChuyen) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.vattudichuyenService.deleteVatTuDiChuyen(row.vatTuDiChuyenId)
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

    editVatTuDiChuyen(row: VatTuDiChuyen) {
        this.sourcevattudichuyen = row;
        this.vattudichuyenEdit = this.VatTuDiChuyenEditor.editVatTuDiChuyen(row);
        this.VatTuDiChuyenEditor.editorModal.show();
    }    
}