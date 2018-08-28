import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { DichVuNuocService } from "../../services/dichvunuoc.service";
import { DichVuNuoc } from "../../models/dichvunuoc.model";
import { DichVuNuocInfoComponent } from "./dichvunuoc-info.component";
import { AuthService } from '../../services/auth.service';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { MatBang } from '../../models/matbang.model';
import { MatBangService } from '../../services/matbang.service';
import { CongThucNuocService } from '../../services/congthucnuoc.service';
import { DinhMucNuocService } from '../../services/dinhmucnuoc.service';
import { DinhMucNuoc } from '../../models/dinhmucnuoc.model';

@Component({
    selector: "dichvunuoc",
    templateUrl: "./dichvunuoc.component.html",
    styleUrls: ["./dichvunuoc.component.css"]
})

export class DichVuNuocComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: DichVuNuoc[] = [];
    rowsCache: DichVuNuoc[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    dichvunuocEdit: DichVuNuoc;
    sourcedichvunuoc: DichVuNuoc;
    editingRowName: { name: string };
    objNDTN: NguoiDungToaNha = new NguoiDungToaNha();
    matbangs: MatBang[] = [];
    matbangsFilter: MatBang[] = [];
    matbangSelected: MatBang = new MatBang();
    snam: number = 0;
    sthang: number = 0;
    nams = [];
    dinhMucNuocs: DinhMucNuoc[] = [];

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



    @ViewChild('dichvunuocEditor')
    DichVuNuocEditor: DichVuNuocInfoComponent;

    @ViewChild('namthangTemplate')
    namthangTemplate: TemplateRef<any>;

    @ViewChild('vatTemplate')
    vatTemplate: TemplateRef<any>;

    @ViewChild('bvmtTemplate')
    bvmtTemplate: TemplateRef<any>;

    @ViewChild('tienTemplate')
    tienTemplate: TemplateRef<any>;

    @ViewChild('tienthanhtoanTemplate')
    tienthanhtoanTemplate: TemplateRef<any>;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private dichvunuocService: DichVuNuocService, private authService: AuthService, private nguoidungtoanhaService: NguoiDungToaNhaService, private matbangService: MatBangService, private congthucnuocService: CongThucNuocService, private dinhmucnuocService: DinhMucNuocService) {
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { name: 'Tháng', cellTemplate: this.namthangTemplate, width: 100 },
            { prop: 'chiSoCu', name: gT('Chỉ số cũ') },
            { prop: 'chiSoMoi', name: gT('Chỉ số mới') },
            { prop: 'soTieuThu', name: gT('Số tiêu thụ') },
            { name: 'Thành tiền', cellTemplate: this.tienTemplate, width: 100 },
            { name: 'VAT', cellTemplate: this.vatTemplate, width: 100 },
            { name: 'BVMT', cellTemplate: this.bvmtTemplate, width: 100 },
            { name: 'Tiền thanh toán', cellTemplate: this.tienthanhtoanTemplate, width: 100 },
            { name: 'Chức năng', width: 110, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        if (this.authService.currentUser) {
            var userId = this.authService.currentUser.id;
            var where = "NguoiDungId = '" + userId + "'";
            this.nguoidungtoanhaService.getItems(0, 1, where, "x").subscribe(result => this.getNguoiDungToaNha(result), error => {
                this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng tòa nhà từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
        }
    }

    getNguoiDungToaNha(list: NguoiDungToaNha[]) {
        if (list.length > 0) {
            this.sthang = new Date().getMonth() + 1;
            this.snam = new Date().getFullYear();
            for (var i = this.snam + 1; i >= this.snam - 5; i--) {
                this.nams.push(i);
            }
            this.objNDTN = list[0];
            this.loadMatBang();
            this.congthucnuocService.getItems(0, 1, "Status = 1", "x").subscribe(r => {
                this.dinhmucnuocService.getItems(0, 0, "CongThucNuocId = " + r[0].congThucNuocId, "SoDau ASC").subscribe(r => {
                    this.dinhMucNuocs = r;
                    this.DichVuNuocEditor.dinhMucNuocs = r;
                }, error => this.onDataLoadFailed(error));
            }, error => this.onDataLoadFailed(error));
        }
    }

    loadMatBang() {
        var where = "ToaNhaId = " + this.objNDTN.toaNhaId + " AND CumToaNhaId = " + this.objNDTN.toaNha.cumToaNhaId;
        this.matbangService.getItems(0, 0, where, "TenMatBang ASC").subscribe(results => {
            this.matbangs = results;
            this.matbangsFilter = results;
            this.DichVuNuocEditor.matbangs = results;
            this.DichVuNuocEditor.matbangsFilter = results;
        }, error => this.onDataLoadFailed(error));
    }

    ngAfterViewInit() {
        this.DichVuNuocEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.DichVuNuocEditor.editorModal.hide();
        };

        this.DichVuNuocEditor.changesCancelledCallback = () => {
            this.dichvunuocEdit = null;
            this.sourcedichvunuoc = null;
            this.DichVuNuocEditor.editorModal.hide();
        };
    }

    addNewToList() {
        this.snam = new Date().getFullYear();
        this.sthang = 0;
        this.matbangSelected = this.matbangs.find(o => o.matBangId == this.dichvunuocEdit.matBangId);
        this.loadData(this.dichvunuocEdit.matBangId);
    }

    loadData(matBangId: number) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        var where = "MatBangId = " + matBangId + " AND Nam = " + this.snam;
        if (this.sthang > 0) where += " AND Thang = " + this.sthang;
        this.dichvunuocService.getItems(0, 0, where, "Nam DESC,Thang DESC").subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: DichVuNuoc[]) {
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

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }



    newDichVuNuoc() {
        this.editingRowName = null;
        this.sourcedichvunuoc = null;
        this.dichvunuocEdit = this.DichVuNuocEditor.newDichVuNuoc();
        this.DichVuNuocEditor.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.dichVuNuocId, r.matBangId, r.khachHangId, r.tuNgay, r.denNgay, r.chiSoCu, r.chiSoMoi, r.soTieuThu, r.thanhTien, r.tyLeVAT, r.tienVAT, r.tyLeBVMT, r.tienBVMT, r.ngayThanhToan, r.tienThanhToan, r.thang, r.nam, r.dienGiai, r.ngayNhap, r.nguoiNhap, r.ngaySua, r.nguoiSua));
    }

    deleteDichVuNuoc(row: DichVuNuoc) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: DichVuNuoc) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.dichvunuocService.deleteDichVuNuoc(row.dichVuNuocId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item !== row);
                this.rows = this.rows.filter(item => item !== row);
                this.loadMatBang();
                this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
            },
                error => {
                    this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;
                    this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                });
    }

    editDichVuNuoc(row: DichVuNuoc) {
        this.editingRowName = { name: row.thang.toString() };
        this.sourcedichvunuoc = row;
        this.dichvunuocEdit = this.DichVuNuocEditor.editDichVuNuoc(row);
        this.DichVuNuocEditor.editorModal.show();
    }

    matbangChange(matbang: MatBang) {
        if (matbang) this.loadData(matbang.matBangId);
        else this.loadData(0);
    }

    matbangfilterChange(value) {
        this.matbangsFilter = this.matbangs.filter((s) => s.tenMatBang.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    getFormatPrice(price: number): string {
        return Utilities.formatNumber(price);
    }

    sthangChange(thang: number) {
        if (this.matbangSelected != null) {
            if (this.matbangSelected.matBangId != null)
                this.loadData(this.matbangSelected.matBangId);
            else this.alertService.showMessage("Cảnh báo", "Vui lòng chọn căn hộ!", MessageSeverity.warn);
        } else this.alertService.showMessage("Cảnh báo", "Vui lòng chọn căn hộ!", MessageSeverity.warn);

    }

    snamChange(nam: number) {
        if (this.matbangSelected != null) {
            if (this.matbangSelected.matBangId != null)
                this.loadData(this.matbangSelected.matBangId);
            else this.alertService.showMessage("Cảnh báo", "Vui lòng chọn căn hộ!", MessageSeverity.warn);
        } else this.alertService.showMessage("Cảnh báo", "Vui lòng chọn căn hộ!", MessageSeverity.warn);
    }
}