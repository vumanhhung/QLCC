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
import { fadeInOut } from '../../services/animations';

@Component({
    selector: "vattudichuyen",
    templateUrl: "./vattudichuyen.component.html",
    styleUrls: ["./vattudichuyen.component.css"],
    animations: [fadeInOut]
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

    selected: any[] = [];
    dexuats: VatTuPhieuYeuCau[] = [];
    phongbans: PhongBan[] = [];
    NDTNs: NguoiDungToaNha[] = [];
    vattusFilter: VatTu[] = [];
    vattucha: VatTu[] = [];
    vattuDC: VatTuDiChuyen[] = [];
    objNDTN: NguoiDungToaNha = new NguoiDungToaNha();
    selectedGropup: number = 0;
    dvyc: string = "";
    dvtn: string = "";
    expanded: any = {};

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
        this.loadAllDC();
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

    loadAllDC() {
        this.vattudichuyenService.getAllVatTuDiChuyen().subscribe(results => this.onDataLoadDCSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadDCSuccessful(obj: VatTuDiChuyen[]) {
        this.vattuDC = obj;
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
        this.VatTuDiChuyenEditor.isViewDetails = false;
        this.VatTuDiChuyenEditor.isEdit = false;
        this.vattudichuyenEdit = this.VatTuDiChuyenEditor.newVatTuDiChuyen();
        this.VatTuDiChuyenEditor.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.noiDung, r.daiDienDVYC, r.daiDienDVN));
    }

    deleteVatTuDiChuyen(row: VatTuPhieuDiChuyen) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: VatTuPhieuDiChuyen) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;
        this.vattuphieudichuyenservice.deleteVatTuPhieuDiChuyen(row.phieuDiChuyenId).subscribe(result => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.vattudichuyenService.getByPhieuDiChuyen(row.phieuDiChuyenId)
                .subscribe(results => {
                    for (var item of results) {
                        this.vattudichuyenService.deleteVatTuDiChuyen(item.vatTuDiChuyenId).subscribe();
                        results = results.filter(i => i !== item);
                    }
                }, error => { });
            this.rowsCache = this.rowsCache.filter(item => item !== row)
            this.rows = this.rows.filter(item => item !== row)
            this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
        }, error => {
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
        this.VatTuDiChuyenEditor.isEdit = true;
        this.VatTuDiChuyenEditor.isViewDetails = false;
        this.vattudichuyenEdit = this.VatTuDiChuyenEditor.editVatTuDiChuyen(row);
        this.VatTuDiChuyenEditor.editorModal.show();
    }

    viewVatTuDiChuyen(row: VatTuPhieuDiChuyen) {
        this.sourcevattuphieudichuyen = row;
        this.VatTuDiChuyenEditor.phongbans = this.phongbans;
        this.VatTuDiChuyenEditor.dexuats = this.dexuats;
        this.VatTuDiChuyenEditor.NDTN = this.NDTNs;
        this.VatTuDiChuyenEditor.vattusFilter = this.vattusFilter;
        this.VatTuDiChuyenEditor.isViewDetails = true;
        this.VatTuDiChuyenEditor.isEdit = false;
        this.vattudichuyenEdit = this.VatTuDiChuyenEditor.editVatTuDiChuyen(row);
        this.VatTuDiChuyenEditor.editorModal.show();
    }

    SelectedStatusValue(status: number) {
        this.loadData(status);
    }

    getVatTuCha(row: VatTuPhieuDiChuyen) {
        var vtcha = this.vattuDC.filter(o => o.phieuDiChuyenId == row.phieuDiChuyenId);
        return vtcha;
    }

    getVatTuCon(row: VatTu) {
        var vt = this.vattusFilter.filter(o => o.maVatTuCha == row.vatTuId);
        return vt;
    }

    toggleExpandRow(row) {
        this.table.rowDetail.toggleExpandRow(row);
    }

    onDetailToggle(event) {
        console.log('Detail Toggled', event);
        console.log(this.expanded);
    }

    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    printDiv(selected: any[]) {
        var myWindow = window.open('', '', 'width=200,height=100');
        var date = new Date();
        for (let item of selected) {
            //var itemVatTu = this.listAll.filter(o => o.phieuYeuCauVTId == item.phieuYeuCauVTId);
            myWindow.document.write("<div style='font-size: 1em; padding: 4% 5%;; height:100%;'>");
            myWindow.document.write("<div style='text-align: center;'>");
            myWindow.document.write("<div style='font-weight: bold; font-size: 18px;'>CÔNG TY CỔ PHẦN ĐẦU TƯ VÀ DỊCH VỤ ĐÔ THỊ VIỆT NAM VINASINCO</div>");
            myWindow.document.write("</div><br/>");
            myWindow.document.write("<div style='text-align: right; font-style: italic;'>");
            myWindow.document.write("<div style='text-transform: uppercase; font-size: 14px;'>Ngày " + date.getDate() + " Tháng " + date.getMonth() + " Năm " + date.getFullYear() + "</div><br/>");
            myWindow.document.write("</div>");
            myWindow.document.write("<br/>");
            myWindow.document.write("<div style='text-align: center; font-size: 20px; font-weight: bolder;'>PHIẾU YÊU CẦU VẬT TƯ</div>");
            myWindow.document.write("<div style='float:left; width: 100%;'><h5>Người yêu cầu: " + item.nguoiYeuCau + "</h5>");
            myWindow.document.write("<h5>Bộ phận: " + item.phongbans.tenPhongBan + "</h5>");
            myWindow.document.write("<h5>Đơn vị sử dụng: " + item.nguoiTiepNhan + "</h5>");
            myWindow.document.write("<h5>Mục đích sử dụng: " + item.mucDichSuDung + "</h5>");
            myWindow.document.write("<h5>Đề xuất vật tư theo bảng liệt kê đính kèm:</h5></div>");
            myWindow.document.write("<br/><br/>");
            myWindow.document.write("<div style='text-align: center; font-size: 16px; font-weight: bolder; margin-bottom: 15px;'>BẢNG LIỆT KÊ VẬT TƯ</div>");
            myWindow.document.write("<table style='border-collapse: collapse;border: 1px solid black; text-align: center;' width='100%'>");
            myWindow.document.write("<thead><tr><td style='border: 1px solid black; width: 25%'>Vật tư</td><td style='border: 1px solid black; width: 20%'>ĐVT</td><td style ='border: 1px solid black; width: 17%'>Xuất xứ</td><td style='border: 1px solid black; width: 13%'>Số lượng</td><td style ='border: 1px solid black; width: 25%'>Ghi chú</td></tr></thead>");
            myWindow.document.write("<tbody>");
            //for (var vt of itemVatTu) {
            //    myWindow.document.write("<tr><td style='border: 1px solid black;'>" + vt.vattus.tenVatTu + "</td><td style='border: 1px solid black;'>" + vt.vattus.donViTinhs.tenDonViTinh + "</td><td style='border: 1px solid black;'>" + vt.vattus.quocTichs.tenNuoc + "</td><td style='border: 1px solid black;'>" + vt.soLuong + "</td><td style='border: 1px solid black;'>" + vt.ghiChu + "</td></tr>");
            //}
            myWindow.document.write("</tbody>");
            myWindow.document.write("</table>");
            myWindow.document.write("<br/><br/><br/><br/>");
            myWindow.document.write("<div style='display: inline-flex; width: 100%'>");
            myWindow.document.write("<div style='font-weight: bold; width: 30%; text-align: center; margin-right: 5%;'><h4>Người đề nghị</h4><span>(Ký, họ tên)</span></div>");
            myWindow.document.write("<div style='font-weight: bold; width: 30%; text-align: center; margin-right: 5%;'><h4>Kỹ sư / Đội Trưởng / Phòng kế toán - vật tư</h4></div>");
            myWindow.document.write("<div style='font-weight: bold; width: 30%; text-align: center;'><h4>Giám đốc</h4></div>");
            myWindow.document.write("</div>");
            myWindow.document.write("<hr/>");
            myWindow.document.write("</div>");
        }
        myWindow.document.close();
        myWindow.print();
        myWindow.close();
    }
}