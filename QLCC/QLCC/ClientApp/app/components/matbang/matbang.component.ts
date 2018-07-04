import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { MatBangService } from "../../services/matbang.service";
import { MatBang } from "../../models/matbang.model";
import { MatBangInfoComponent } from "./matbang-info.component";
import { CumToaNha } from '../../models/cumtoanha.model';
import { ToaNha } from '../../models/toanha.model';
import { ToaNhaService } from '../../services/toanha.service';
import { CumToaNhaService } from '../../services/cumtoanha.service';
import { TangLau } from '../../models/tanglau.model';
import { TangLauService } from '../../services/tanglau.service';
import { TrangThai } from '../../models/trangthai.model';
import { TrangThaiService } from '../../services/trangthai.service';
import { LoaiTien } from '../../models/loaitien.model';
import { LoaiTienService } from '../../services/loaitien.service';
import { LoaiMatBang } from '../../models/loaimatbang.model';
import { LoaiMatBangService } from '../../services/loaimatbang.service';
import { ImportExcelComponent } from '../controls/import-excel.component';

@Component({
    selector: "matbang",
    templateUrl: "./matbang.component.html",
    styleUrls: ["./matbang.component.css"]
})

export class MatBangComponent implements OnInit, AfterViewInit {
    columns: any[] = [];
    randomString: string = Utilities.RandomText(10);
    public limit: number = 10;
    rows: MatBang[] = [];
    rowsCache: MatBang[] = [];
    groups: CumToaNha[] = [];
    loaitien: LoaiTien[] = [];
    items: ToaNha[] = [];
    tanglau: TangLau[] = [];
    trangthai: TrangThai[] = [];
    loaimatbang: LoaiMatBang[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    matbangEdit: MatBang;
    sourcematbang: MatBang;
    editingRowName: { name: string };
    public hidden: number = 0;
    isCloseBox: boolean = false;
    public maunenThayDoi: string = "";
    private isActiveViewStatus: boolean = false;

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

    @ViewChild('BackGroundTemplate')
    BackGroundTemplate: TemplateRef<any>;

    @ViewChild('matbangEditor')
    MatBangEditor: MatBangInfoComponent;

    @ViewChild('importexcel')
    importexcel: ImportExcelComponent;


    constructor(private alertService: AlertService, private translationService: AppTranslationService, private matbangService: MatBangService, private toanhaService: ToaNhaService, private cumtoanhaService: CumToaNhaService, private tanglauService: TangLauService, private trangthaiService: TrangThaiService, private loaitienService: LoaiTienService, private loaimatbangService: LoaiMatBangService) {
    }
    public headerPaddingCells: any = {
        background: '#048b8b',
        textAlign:'center'
    }

    changeRandomString() {
        this.randomString = Utilities.RandomText(10);
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'tenMatBang', name: gT('matbang.qlmb_sophong'), width: 80 },
            { prop: 'tanglau.tenTangLau', name: gT('matbang.qlmb_sotang'), width: 80 },
            { prop: 'toanha.tenKhoiNha', name: gT('matbang.qlmb_toanha') },
            { prop: 'trangthai.tenTrangThai', name: gT('matbang.qlmb_trangthai'), width: 40, cellTemplate: this.BackGroundTemplate },
            { name: gT('matbang.qlmb_chucnang'), width: 180, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];

        this.loadData(0, 0, 0);
        this.loadGroup(0);
        this.loadTangLau(0, 0);
        this.loadItem(0);
        this.loadAllTrangThai();
        this.loadAllLoaiTien();
        this.loadAllLoaiMatBang();
    }

    ngAfterViewInit() {
        this.MatBangEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.MatBangEditor.editorModal.hide();
        };

        this.MatBangEditor.changesCancelledCallback = () => {
            this.matbangEdit = null;
            this.sourcematbang = null;
            this.MatBangEditor.editorModal.hide();
        };
    }

    SetBackground(row: MatBang) {
        let styles = {
            'background': row.trangthai.mauNen,
            'width': '100%',
            'height': '30px',
            'text-align': 'center'
        };
        return styles;
    }

    addNewToList() {
        this.loadData(0, 0, 0);
        if (this.sourcematbang) {
            Object.assign(this.sourcematbang, this.matbangEdit);
            this.matbangEdit = null;
            this.sourcematbang = null;
        }
        else {
            let objMatBang = new MatBang();
            Object.assign(objMatBang, this.matbangEdit);
            this.matbangEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objMatBang).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objMatBang);
            this.rows.splice(0, 0, objMatBang);
        }
    }

    setDisibleBox(maunen: string) {
        this.maunenThayDoi = maunen;
        this.isActiveViewStatus = true;
    }

    loadData(tanglau: number, toanha: number, cumtoanha: number) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.matbangService.getMatBangByToaNha(tanglau, toanha, cumtoanha).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    loadItem(s: number) {
        this.toanhaService.getToaNhaByCum(s).subscribe(results => this.onDataLoadItemSuccessful(results), error => this.onDataLoadFailed(error));
    }
    loadAllTrangThai() {
        this.trangthaiService.getAllTrangThai().subscribe(results => this.onDataLoadTrangThaiSuccessful(results), error => this.onDataLoadFailed(error))
    }
    loadGroup(s: number) {
        this.cumtoanhaService.getAllCumToaNha().subscribe(results => this.onDataCumLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    loadTangLau(toanha: number, cumtoanha: number) {
        this.tanglauService.getTangLauByToaNha(toanha, cumtoanha).subscribe(results => this.onDataLoadTangLauSuccessful(results), error => this.onDataLoadFailed(error));
    }
    loadAllLoaiTien() {
        this.loaitienService.getAllLoaiTien().subscribe(results => this.onDataLoadLoaiTienSuccessful(results), error => this.onDataLoadFailed(error))
    }
    loadAllLoaiMatBang() {
        this.loaimatbangService.getAllLoaiMatBang().subscribe(results => this.onDataLoadLoaiMatBangSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadLoaiMatBangSuccessful(obj: LoaiMatBang[]) {
        this.loaimatbang = obj;
    }
    onDataLoadLoaiTienSuccessful(obj: LoaiTien[]) {
        this.loaitien = obj;
    }
    onDataLoadItemSuccessful(obj: ToaNha[]) {
        this.items = obj;
    }
    onDataLoadTrangThaiSuccessful(obj: TrangThai[]) {
        this.trangthai = obj;
    }
    onDataLoadTangLauSuccessful(obj: TangLau[]) {
        this.tanglau = obj;
    }
    SelectedGroupValue(tanglau: number, valueitem: number, value: number) {
        this.loadItem(value);
        this.loadTangLau(valueitem, value);
        this.loadData(tanglau, valueitem, value);
    }

    SelectedTangLauValue(tanglau: number, toanha: number, cumtoanha: number) {
        this.loadData(tanglau, toanha, cumtoanha);
    }


    onDataCumLoadSuccessful(obj: CumToaNha[]) {
        this.groups = obj;
    }

    SelectedItemValue(tanglau: number, value: number, cumvalue: number) {
        this.loadTangLau(value, cumvalue);
        this.loadData(tanglau, value, cumvalue);
    }

    onDataLoadSuccessful(obj: MatBang[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        obj.forEach((item, index, obj) => {
            (<any>item).index = index + 1;
        });

        this.rowsCache = [...obj];
        this.rows = obj;
        // this.groups = obj;
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    openBox() {
        if (this.isCloseBox == false) {
            this.isCloseBox = true;        }
        else {
            this.isCloseBox = false;
            this.isActiveViewStatus = false;
            this.maunenThayDoi = "";
        }
    }

    importMatBang() {
        this.importexcel.cumtoanhas = this.groups;
        this.importexcel.toanhas = this.items;
        this.importexcel.tanglaus = this.tanglau;
        this.importexcel.editorModal.show();
    }

    newMatBang() {
        this.MatBangEditor.isFullScreenModal = false;
        this.MatBangEditor.tenmatbang = "";
        this.editingRowName = null;
        this.sourcematbang = null;
        this.MatBangEditor.cums = this.groups;
        this.MatBangEditor.toas = this.items;
        this.MatBangEditor.trangthais = this.trangthai;
        this.MatBangEditor.tangs = this.tanglau;

        this.MatBangEditor.loaitien = this.loaitien;
        this.MatBangEditor.loaimatbangs = this.loaimatbang;
        this.matbangEdit = this.MatBangEditor.newMatBang();
        this.MatBangEditor.isViewDetails = false
        this.MatBangEditor.editorModal.show();
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.matBangId, r.cumToaNhaId, r.toaNhaId, r.tangLauId, r.trangThaiId, r.loaiMatBangId, r.maMatBang, r.tenMatBang, r.dienTich, r.giaThue, r.loaiTien, r.caNhan, r.giaoChiaKhoa, r.ngaybanGiao, r.dienGiai, r.chuSoHuu, r.khachThue));
    }

    deleteMatBang(row: MatBang) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: MatBang) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.matbangService.deleteMatBang(row.matBangId)
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

    editMatBang(row: MatBang) {
        this.MatBangEditor.isFullScreenModal = false;
        this.MatBangEditor.tenmatbang = "- " + row.tenMatBang;
        this.editingRowName = { name: row.tenMatBang };
        this.sourcematbang = row;
        this.matbangEdit = this.MatBangEditor.editMatBang(row);
        try {
            this.MatBangEditor.value = new Date(row.ngaybanGiao.toString());
        }
        catch{ this.MatBangEditor.value = new Date(); }
        if (row.giaoChiaKhoa != 1) {
            this.MatBangEditor.trangthaichiakhoa = false;
        }
        else {
            this.MatBangEditor.trangthaichiakhoa = true;
        }
        this.MatBangEditor.loaitien = this.loaitien;
        this.MatBangEditor.cums = this.groups;
        this.MatBangEditor.toas = this.items;
        this.MatBangEditor.trangthais = this.trangthai;
        this.MatBangEditor.tangs = this.tanglau;
        this.MatBangEditor.loaimatbangs = this.loaimatbang;

        if (row.cumToaNhaId != 0) {
            this.MatBangEditor.chkCumToaNhaId = true;
        }
        if (row.toaNhaId != 0) {
            this.MatBangEditor.chkToaNhaId = true;
        }
        if (row.tangLauId != 0) {
            this.MatBangEditor.chktangLauId = true;
        }
        if (row.trangThaiId != 0) {
            this.MatBangEditor.chkTrangThaiId = true;
        }
        if (row.loaiMatBangId != 0) {
            this.MatBangEditor.chkloaiMatBangId = true;
        }
        if (row.loaiTien != '0') {
            this.MatBangEditor.chkloaiTien = true;
        }
        if (row.caNhan != 0) {
            this.MatBangEditor.chkcaNhan = true;
        }
        if (row.giaoChiaKhoa != 0) {
            this.MatBangEditor.chkgiaoChiaKhoa = true;
        }
        if (row.chuSoHuu != 0) {
            this.MatBangEditor.chkchuSoHuu = true;
        }
        if (row.khachThue != 0) {
            this.MatBangEditor.chkkhachThue = true;
        }
        this.MatBangEditor.isViewDetails = false;
        this.MatBangEditor.editorModal.show();
    }

    ViewMatBang(row: MatBang) {
        this.MatBangEditor.isFullScreenModal = true;
        this.MatBangEditor.tenmatbang = "- " + row.tenMatBang;
        this.editingRowName = { name: row.tenMatBang };
        this.sourcematbang = row;
        this.matbangEdit = this.MatBangEditor.editMatBang(row);
        try {
            this.MatBangEditor.value = new Date(row.ngaybanGiao.toString());
        }
        catch{ this.MatBangEditor.value = new Date(); }
        if (row.giaoChiaKhoa != 1) {
            this.MatBangEditor.trangthaichiakhoa = false;
        }
        else {
            this.MatBangEditor.trangthaichiakhoa = true;
        }
        this.MatBangEditor.loaitien = this.loaitien;
        this.MatBangEditor.cums = this.groups;
        this.MatBangEditor.toas = this.items;
        this.MatBangEditor.trangthais = this.trangthai;
        this.MatBangEditor.tangs = this.tanglau;
        this.MatBangEditor.loaimatbangs = this.loaimatbang;

        if (row.cumToaNhaId != 0) {
            this.MatBangEditor.chkCumToaNhaId = true;
        }
        if (row.toaNhaId != 0) {
            this.MatBangEditor.chkToaNhaId = true;
        }
        if (row.tangLauId != 0) {
            this.MatBangEditor.chktangLauId = true;
        }
        if (row.trangThaiId != 0) {
            this.MatBangEditor.chkTrangThaiId = true;
        }
        if (row.loaiMatBangId != 0) {
            this.MatBangEditor.chkloaiMatBangId = true;
        }
        if (row.loaiTien != '0') {
            this.MatBangEditor.chkloaiTien = true;
        }
        if (row.caNhan != 0) {
            this.MatBangEditor.chkcaNhan = true;
        }
        if (row.giaoChiaKhoa != 0) {
            this.MatBangEditor.chkgiaoChiaKhoa = true;
        }
        if (row.chuSoHuu != 0) {
            this.MatBangEditor.chkchuSoHuu = true;
        }
        if (row.khachThue != 0) {
            this.MatBangEditor.chkkhachThue = true;
        }
        this.MatBangEditor.isViewDetails = false;
        this.MatBangEditor.isViewDetails = true;
        this.MatBangEditor.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    viewtotalMatBang() {
        if (this.hidden == 0) {
            this.hidden = 1;
        }
        else {
            this.hidden = 0;
        }
    }

    buiding(row: MatBang) {
        this.alertService.showDialog('Chức năng đang được xây dựng?', DialogType.alert);
    }
}