import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { CuDanService } from "../../services/cudan.service";
import { CuDan } from "../../models/cudan.model";
import { CuDanInfoComponent } from "./cudan-info.component";
import { CumToaNha } from '../../models/cumtoanha.model';
import { ToaNha } from '../../models/toanha.model';
import { TangLau } from '../../models/tanglau.model';
import { MatBang } from '../../models/matbang.model';
import { MatBangService } from '../../services/matbang.service';
import { ToaNhaService } from '../../services/toanha.service';
import { CumToaNhaService } from '../../services/cumtoanha.service';
import { TangLauService } from '../../services/tanglau.service';
import { QuocTichService } from '../../services/quoctich.service';
import { QuocTich } from '../../models/quoctich.model';
import { QuanHeChuHo } from '../../models/quanhechuho.model';
import { QuanHeChuHoService } from '../../services/quanhechuho.service';
import { TrangThaiCuDanService } from '../../services/trangthaicudan.service';
import { TrangThaiCuDan } from '../../models/trangthaicudan.model';

import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { AuthService } from '../../services/auth.service';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';

@Component({
    selector: "cudan",
    templateUrl: "./cudan.component.html",
    styleUrls: ["./cudan.component.css"]
})

export class CuDanComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: CuDan[] = [];
    rowsCache: CuDan[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    cudanEdit: CuDan;
    sourcecudan: CuDan;
    editingRowName: { name: string };
    arrMatBang: number[] = [];
    cums: CumToaNha[] = [];
    toas: ToaNha[] = [];
    tang: TangLau[] = [];
    matbangs: MatBang[] = [];
    quoctich: QuocTich[] = [];
    chuho: CuDan[] = [];
    qhch: QuanHeChuHo[] = [];
    trangthaicudan: TrangThaiCuDan[] = [];
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

    @ViewChild('ngayDenTemplate')
    ngayDenTemplate: TemplateRef<any>;
    @ViewChild('ngayDiTemplate')
    ngayDiTemplate: TemplateRef<any>;
    @ViewChild('TrangThaiTamTruTemplate')
    TrangThaiTamTruTemplate: TemplateRef<any>;

    @ViewChild('cudanEditor')
    CuDanEditor: CuDanInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private cudanService: CuDanService, private matbangService: MatBangService, private toanhaService: ToaNhaService, private cumtoanhaService: CumToaNhaService, private tanglauService: TangLauService, private quoctichService: QuocTichService, private qhchService: QuanHeChuHoService, private trangthaicudanService: TrangThaiCuDanService, private authService: AuthService, private nguoidungtoanhaService: NguoiDungToaNhaService) {
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'hoTen', name: gT('Họ tên') },
            { prop: 'quanhechuhos.tenQuanHeChuHo', name: gT('Quan hệ chủ hộ') },
            { name: gT('Ngày đến'), cellTemplate: this.ngayDenTemplate },
            { name: gT('Ngày đi'), cellTemplate: this.ngayDiTemplate },
            { name: gT('ĐK tạm trú'), cellTemplate: this.TrangThaiTamTruTemplate },
            { prop: 'trangthaicudans.tenTrangThaiCuDan', name: gT('Trạng thái') },
            { name: 'Chức năng', width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];

        //this.loadCumToaNha();
        //this.loadToaNha(0);
        
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
            this.objNDTN = list[0];
            this.loadTangLau(this.objNDTN.toaNhaId, this.objNDTN.toaNha.cumToaNhaId);
            this.loadMatBang(0, this.objNDTN.toaNhaId, this.objNDTN.toaNha.cumToaNhaId);
            this.loadAllQuocTich();
            this.loadChuHo();
            this.loadQuanHeChuHo();
            this.loadTrangThaiCuDan();
        }
    }

    loadMatBangById(id: number) {
        this.matbangService.getMatBangByID(id).subscribe(results => this.onDataloadMatBangByIdSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataloadMatBangByIdSuccessful(obj: MatBang) {
        this.CuDanEditor.cumtoanhaView = obj.cumtoanha.tenCumToaNha;
        this.CuDanEditor.toanhaView = obj.toanha.tenKhoiNha;
        this.CuDanEditor.tanglauView = obj.tanglau.tenTangLau;
    }
    loadCuDanById(id: number) {
        this.cudanService.getCuDanByID(id).subscribe(results => this.onDataloadCuDanByIdSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataloadCuDanByIdSuccessful(obj: CuDan) {
        this.CuDanEditor.ChuHoView = obj.hoTen;
    }
    loadChuHo() {
        this.cudanService.getChuHo().subscribe(results => this.onDataChuHoLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataChuHoLoadSuccessful(obj: CuDan[]) {
        this.chuho = obj;
    }

    loadTrangThaiCuDan() {
        this.trangthaicudanService.getAllTrangThaiCuDan().subscribe(results => this.onDataTrangThaiCuDanSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataTrangThaiCuDanSuccessful(obj: TrangThaiCuDan[]) {
        this.trangthaicudan = obj;
    }

    loadQuanHeChuHo() {
        this.qhchService.getAllQuanHeChuHo().subscribe(results => this.onDataloadQuanHeChuHoLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataloadQuanHeChuHoLoadSuccessful(obj: QuanHeChuHo[]) {
        this.qhch = obj;
    }

    loadCumToaNha() {
        this.cumtoanhaService.getAllCumToaNha().subscribe(results => this.onDataCumToaNhaLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataCumToaNhaLoadSuccessful(obj: CumToaNha[]) {
        this.cums = obj;
    }
    loadToaNha(cumtoanha: number) {
        this.toanhaService.getToaNhaByCum(cumtoanha).subscribe(results => this.onDataToaNhaLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataToaNhaLoadSuccessful(obj: ToaNha[]) {
        this.toas = obj;
    }
    loadTangLau(toanha: number, cumtoanha: number) {
        this.tanglauService.getTangLauByToaNha(toanha, cumtoanha).subscribe(results => this.onDataLoadTangLauSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadTangLauSuccessful(obj: TangLau[]) {
        this.tang = obj;
    }
    loadMatBang(tanglau: number, toanha: number, cumtoanha: number) {
        this.matbangService.getMatBangByToaNha(tanglau, toanha, cumtoanha).subscribe(results => this.onDataLoadMatBangSuccessful(results, tanglau, toanha, cumtoanha), error => this.onDataLoadFailed(error));
    }
    onDataLoadMatBangSuccessful(obj: MatBang[], tanglau: number, toanha: number, cumtoanha: number) {
        this.matbangs = obj;
        //alert(tanglau + "/" + toanha + "/" + cumtoanha);
        if (tanglau == 0 && toanha == 0 && cumtoanha == 0) {
            this.arrMatBang = [];
        }
        else {
            this.arrMatBang = [];
            for (let u of this.matbangs) {
                this.arrMatBang.push(<any>u.matBangId);
            }
            if (this.arrMatBang.length < 1) {
                this.arrMatBang.push(0)
            }
        }

        // alert(this.arrMatBang.length)
        this.loadData(this.arrMatBang);
    }
    loadAllQuocTich() {
        this.quoctichService.getAllQuocTich().subscribe(results => this.onDataLoadQuocTichSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadQuocTichSuccessful(obj: QuocTich[]) {
        this.quoctich = obj;
    }
    SelectedCumToaNha(matbang: number, tanglau: number, toanha: number, cumtoanha: number) {

        this.loadToaNha(cumtoanha);
        this.loadTangLau(toanha, cumtoanha);
        this.loadMatBang(tanglau, toanha, cumtoanha);
        //if (matbang == 0 && tanglau == 0 && toanha == 0 && cumtoanha == 0) {
        //    this.arrMatBang = [];
        //}
        //else {
        //    if (this.arrMatBang.length < 1) {
        //        this.arrMatBang.push("0")
        //    }
        //}
        //this.loadData(this.arrMatBang);
    }
    SelectedToaNha(matbang: number, tanglau: number, toanha: number, cumtoanha: number) {
        this.loadTangLau(toanha, cumtoanha);
        this.loadMatBang(tanglau, toanha, cumtoanha);
        //if (matbang == 0 && tanglau == 0 && toanha == 0 && cumtoanha == 0) {
        //    this.arrMatBang = [];
        //}
        //else {
        //    if (this.arrMatBang.length < 1) {
        //        this.arrMatBang.push("0")
        //    }
        //}
        //this.loadData(this.arrMatBang);
    }
    SelectedTangLauValue(matbang: number, tanglau: number, toanha: number, cumtoanha: number) {
        this.loadMatBang(tanglau, toanha, cumtoanha);
        //if (matbang == 0 && tanglau == 0 && toanha == 0 && cumtoanha == 0) {
        //    this.arrMatBang = [];
        //}
        //else {
        //    if (this.arrMatBang.length < 1) {
        //        this.arrMatBang.push("0")
        //    }
        //}
        //this.loadData(this.arrMatBang);
    }
    SelectedMatBang(matbang: number, tanglau: number, toanha: number, cumtoanha: number) {
        this.arrMatBang = [];
        this.arrMatBang.push(matbang);
        if (matbang == 0 && tanglau == 0 && toanha == 0 && cumtoanha == 0) {
            this.arrMatBang = [];
        }
        else {
            if (this.arrMatBang.length < 1) {
                this.arrMatBang.push(0)
            }
        }
        this.loadData(this.arrMatBang);
    }

    ngAfterViewInit() {
        this.CuDanEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.CuDanEditor.editorModal.hide();
        };

        this.CuDanEditor.changesCancelledCallback = () => {
            this.cudanEdit = null;
            this.sourcecudan = null;
            this.CuDanEditor.editorModal.hide();
        };
    }

    addNewToList() {
        if (this.sourcecudan) {
            Object.assign(this.sourcecudan, this.cudanEdit);
            this.cudanEdit = null;
            this.sourcecudan = null;
        }
        else {
            let objCuDan = new CuDan();
            Object.assign(objCuDan, this.cudanEdit);
            this.cudanEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objCuDan).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objCuDan);
            this.rows.splice(0, 0, objCuDan);
        }
    }

    loadData(matbang: number[]) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.cudanService.getCuDanByMatBang(matbang).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: CuDan[]) {
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
        this.CuDanEditor.resetForm(true);
    }

    newCuDan() {
        this.CuDanEditor.tencudan = "";
        this.editingRowName = null;
        this.sourcecudan = null;
        this.CuDanEditor.cums = this.cums;
        this.CuDanEditor.toas = this.toas;
        this.CuDanEditor.tangs = this.tang;
        this.CuDanEditor.chuho = this.chuho;
        this.CuDanEditor.trangthaicudan = this.trangthaicudan;
        this.CuDanEditor.matbangs = this.matbangs;
        this.CuDanEditor.qhch = this.qhch;
        this.CuDanEditor.quoctich = this.quoctich;
        this.cudanEdit = this.CuDanEditor.newCuDan();
        this.CuDanEditor.toaNhaId = this.objNDTN.toaNhaId;
        this.CuDanEditor.cumToaNhaId = this.objNDTN.toaNha.cumToaNhaId;
        this.CuDanEditor.isViewDetails = false;
        this.CuDanEditor.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.cuDanId, r.hoTen, r.ngaySinh, r.gioiTinh, r.queQuan, r.quocTich, r.cmt, r.tonGiao, r.ngheNghiep, r.soViSa, r.ngayHetHanViSa, r.matBangId, r.chuHo, r.quanHeChuHoId, r.soHoKhau, r.ngayCapHoKhau, r.noiCapHoKhau, r.ngayChuyenDen, r.ngayDi, r.dienThoai, r.email, r.trangThaiTamTru, r.ngayDkTamTru, r.ngayHetHanTamTru, r.trangThaiCuDanId, r.ghiChu, r.nguoiNhap, r.ngayNhap, r.nguoiSua, r.ngaySua));
    }

    deleteCuDan(row: CuDan) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: CuDan) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.cudanService.deleteCuDan(row.cuDanId)
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

    editCuDan(row: CuDan) {
        this.CuDanEditor.tencudan = "- " + row.hoTen;
        this.editingRowName = { name: row.hoTen };
        this.sourcecudan = row;
        this.CuDanEditor.cums = this.cums;
        this.CuDanEditor.toas = this.toas;
        this.CuDanEditor.tangs = this.tang;
        this.CuDanEditor.chuho = this.chuho;
        this.CuDanEditor.trangthaicudan = this.trangthaicudan;
        this.CuDanEditor.matbangs = this.matbangs;
        this.CuDanEditor.qhch = this.qhch;
        this.CuDanEditor.quoctich = this.quoctich;
        this.cudanEdit = this.CuDanEditor.editCuDan(row);
        this.CuDanEditor.isViewDetails = false;
        this.CuDanEditor.toaNhaId = this.objNDTN.toaNhaId;
        this.CuDanEditor.cumToaNhaId = this.objNDTN.toaNha.cumToaNhaId;
        this.CuDanEditor.editorModal.show();
    }
    viewCuDan(row: CuDan) {
        this.CuDanEditor.tencudan = "- " + row.hoTen;
        this.editingRowName = { name: row.hoTen };
        this.sourcecudan = row;
        this.CuDanEditor.cums = this.cums;
        this.CuDanEditor.toas = this.toas;
        this.CuDanEditor.tangs = this.tang;
        this.CuDanEditor.chuho = this.chuho;
        this.loadMatBangById(row.matBangId);
        this.loadCuDanById(parseInt(row.chuHo));
        this.CuDanEditor.trangthaicudan = this.trangthaicudan;
        this.CuDanEditor.matbangs = this.matbangs;
        this.CuDanEditor.qhch = this.qhch;
        this.CuDanEditor.quoctich = this.quoctich;
        this.cudanEdit = this.CuDanEditor.editCuDan(row);
        this.CuDanEditor.isViewDetails = true;
        this.CuDanEditor.editorModal.show();
    }
}