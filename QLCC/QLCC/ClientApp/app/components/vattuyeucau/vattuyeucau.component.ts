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
    selectedGropup: number = 0;
    editingRowName: { name: string };

    selected: any[] = [];
    selectedRemove: VatTuPhieuYeuCau[] = [];
    listAll: VatTuYeuCau[] = [];

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

    @ViewChild('checkTemplate')
    checkTemplate: TemplateRef<any>;

    @ViewChild('checkAllTemplate')
    checkAllTemplate: TemplateRef<any>;

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
            { headerTemplate: this.checkAllTemplate, width: 38, cellTemplate: this.checkTemplate, canAutoResize: false, sortable: false, draggable: false },
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'phongbans.tenPhongBan', name: gT('Phòng Ban') },
            { prop: 'nguoiYeuCau', name: gT('Người Yêu Cầu') },
            { prop: 'mucDichSuDung', name: gT('Mục đích sử dụng') },
            { prop: 'trangThai', name: gT('Trạng thái'), cellTemplate: this.descriptionTemplate },
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
        this.loadData(0);
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
        this.loadData(0);
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

    loadData(status) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.vattuyeucauService.getAllVatTuYeuCau().subscribe(results => {
            this.listAll = results
        }, error => this.onDataLoadFailed(error))
        this.vattuphieuyeucauService.getAllVatTuPhieuYeuCau().subscribe(results => {
            if (status == 0) {
                this.onDataLoadSuccessful(results)
            } else {
                var filter = results.filter(f => f.trangThai == status);
                this.onDataLoadSuccessful(filter);
            }            
        }, error => this.onDataLoadFailed(error));
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

    newDeXuat() {
        this.editingRowName = null;
        this.sourcevattuyeucau = null;
        this.VatTuYeuCauEditor.phongbans = this.phongbans;
        this.VatTuYeuCauEditor.NDTN = this.NDTN;
        this.VatTuYeuCauEditor.isEdit = false;
        this.VatTuYeuCauEditor.isViewDetail = false;
        this.VatTuYeuCauEditor.toanhaID = this.objNDTN.toaNhaId;
        this.vattuyeucauEdit = this.VatTuYeuCauEditor.newDeXuat();
        this.VatTuYeuCauEditor.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.phongbans.tenPhongBan, r.nguoiYeuCau, r.mucDichSuDung));
    }

    deleteDeXuat(row: VatTuPhieuYeuCau) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: VatTuPhieuYeuCau) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.vattuphieuyeucauService.deleteVatTuPhieuYeuCau(row.phieuYeuCauVTId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.vattuyeucauService.getByPhieuYeuCau(row.phieuYeuCauVTId).subscribe(results => {
                    for (var item of results) {
                        this.vattuyeucauService.deleteVatTuYeuCau(item.yeuCauvatTuId).subscribe();
                        results = results.filter(i => i !== item);
                    }
                }, error => {
                    this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;
                    this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                });
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

    editDeXuat(row: VatTuPhieuYeuCau) {
        this.VatTuYeuCauEditor.phongbans = this.phongbans;
        this.VatTuYeuCauEditor.NDTN = this.NDTN;
        this.VatTuYeuCauEditor.isEdit = true;
        this.VatTuYeuCauEditor.isViewDetail = false;
        this.VatTuYeuCauEditor.toanhaID = this.objNDTN.toaNhaId;
        this.VatTuYeuCauEditor.list = this.listAll.filter(o => o.phieuYeuCauVTId == row.phieuYeuCauVTId);
        this.vattuyeucauEdit = this.VatTuYeuCauEditor.editDeXuat(row);
        this.VatTuYeuCauEditor.editorModal.show();
    }

    viewDeXuat(row: VatTuPhieuYeuCau) {
        this.VatTuYeuCauEditor.phongbans = this.phongbans;
        this.VatTuYeuCauEditor.NDTN = this.NDTN;
        this.VatTuYeuCauEditor.isEdit = false;
        this.VatTuYeuCauEditor.isViewDetail = true;
        this.VatTuYeuCauEditor.list = this.listAll.filter(o => o.phieuYeuCauVTId == row.phieuYeuCauVTId);
        this.vattuyeucauEdit = this.VatTuYeuCauEditor.editDeXuat(row);
        this.VatTuYeuCauEditor.editorModal.show();
    }

    SelectedStatusValue(status: number) {
        this.loadData(status);
    }

    printDiv(selected: any[]) {
        var myWindow = window.open('', '', 'width=200,height=100');
        var date = new Date();
        for (let item of selected) {
            var itemVatTu = this.listAll.filter(o => o.phieuYeuCauVTId == item.phieuYeuCauVTId);
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
            for (var vt of itemVatTu) {
                myWindow.document.write("<tr><td style='border: 1px solid black;'>" + vt.vattus.tenVatTu + "</td><td style='border: 1px solid black;'>" + vt.vattus.donViTinhs.tenDonViTinh + "</td><td style='border: 1px solid black;'>" + vt.vattus.quocTichs.tenNuoc + "</td><td style='border: 1px solid black;'>" + vt.soLuong + "</td><td style='border: 1px solid black;'>" + vt.ghiChu + "</td></tr>");
            }    
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

<<<<<<< HEAD
    duyetDeXuat(selected: VatTuPhieuYeuCau[]) {
        for (let item of selected) {
            item.trangThai = 2;
            this.vattuphieuyeucauService.updateVatTuPhieuYeuCau(item.phieuYeuCauVTId, item).subscribe(response => {
                this.alertService.showStickyMessage("Thành công", "Cập nhật trạng thái đề xuất thành công", MessageSeverity.success);
                //this.loadData(0);
            }, error => { });
        }
    }

    huyDeXuat(selected: VatTuPhieuYeuCau[]) {
        for (let item of selected) {
            if (item.trangThai == 2) {
                //this.selected.splice(this.selected.indexOf(item), 1);
                this.alertService.showStickyMessage("Lỗi thực thi", "Đề xuất đã được phê duyệt không thể thay đổi trạng thái!", MessageSeverity.warn);
            } else {
                item.trangThai = 3;
                this.vattuphieuyeucauService.updateVatTuPhieuYeuCau(item.phieuYeuCauVTId, item).subscribe(response => {
                    this.alertService.showStickyMessage("Thành công", "Cập nhật trạng thái đề xuất thành công", MessageSeverity.success);
                    //this.loadData(0);
                }, error => { });
            }
        }
    }

=======
>>>>>>> f30f3881b323bd20f60e6de665e864fea9ec54ec
    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }
}