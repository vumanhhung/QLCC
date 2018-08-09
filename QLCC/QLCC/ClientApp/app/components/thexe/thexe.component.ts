import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { TheXeService } from "../../services/thexe.service";
import { TheXe } from "../../models/thexe.model";
import { TheXeInfoComponent } from "./thexe-info.component";
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { AuthService } from '../../services/auth.service';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';
import { MatBangService } from '../../services/matbang.service';
import { TangLauService } from '../../services/tanglau.service';
import { TangLau } from '../../models/tanglau.model';
import { MatBang } from '../../models/matbang.model';
import { LoaiXe } from '../../models/loaixe.model';
import { LoaiXeService } from '../../services/loaixe.service';
import { PhieuThuInfoComponent } from '../phieuthu/phieuthu-info.component';
import { TheXeThungRacComponent } from './thexe-thungrac.component';

@Component({
    selector: "thexe",
    templateUrl: "./thexe.component.html",
    styleUrls: ["./thexe.component.css"]
})

export class TheXeComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    mbcolumns: any[] = [];
    rows: TheXe[] = [];
    rowsCache: TheXe[] = [];
    rowsDelete: TheXe[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    thexeEdit: TheXe;
    sourcethexe: TheXe;
    editingRowName: { name: string };
    objNDTN: NguoiDungToaNha = new NguoiDungToaNha();
    tanglaus: TangLau[] = [];
    matbangs: MatBang[] = [];
    matbangsCache: MatBang[] = [];
    loaixes: LoaiXe[] = [];
    matbangObj: MatBang = new MatBang();
    date: Date = new Date();

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

    @ViewChild('actionsMBTemplate')
    actionsMBTemplate: TemplateRef<any>;

    @ViewChild('trangthaiTemplate')
    trangthaiTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('thexeEditor')
    TheXeEditor: TheXeInfoComponent;

    @ViewChild('phieuthuEditor')
    PhieuThuEditor: PhieuThuInfoComponent;

    @ViewChild('thexethungracEditor')
    TheXeThungRacEditor: TheXeThungRacComponent;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private thexeService: TheXeService, private authService: AuthService, private nguoidungtoanhaService: NguoiDungToaNhaService, private matbangService: MatBangService, private tanglauService: TangLauService, private loaixeService: LoaiXeService) {
    }

    ngOnInit() {
        //console.log(this.date.toISOString());
        //var cM = this.date.getMonth();
        //this.date.setMonth(cM + 1);
        //console.log(" | " + this.date.toISOString());

        let gT = (key: string) => this.translationService.getTranslation(key);

        this.mbcolumns = [
            { prop: "index", name: '#', width: 40, resizeable: false, canAutoResize: false },
            //{ name: '', width: 50, cellTemplate: this.actionsMBTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "boxViewTheXe" },
            { prop: 'tenMatBang', width: 80, name: 'Căn hộ', resizeable: false, canAutoResize: false },
            { prop: 'khachHangs.tenDayDu', name: 'Chủ hộ', resizeable: false, canAutoResize: false }
        ];

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'maTheXe', name: gT('Mã thẻ') },
            { prop: 'loaiXes.tenLoaiXe', name: gT('Loại xe') },
            { prop: 'phiGuiXe', name: gT('Phí gửi xe') },
            { prop: 'bienSoXe', name: gT('Biển số') },
            { prop: 'mauXe', name: gT('Màu xe') },
            { name: 'Trạng thái', cellTemplate: this.trangthaiTemplate },
            { prop: 'kyThanhToan', name: gT('Kỳ thanh toán') },
            { name: '', width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
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
            this.loaixeService.getAllLoaiXe().subscribe(results => { this.loaixes = results; this.TheXeEditor.loaixes = this.loaixes; }, error => this.onDataLoadFailed(error));
            this.objNDTN = list[0];
            this.loadTangLau(this.objNDTN.toaNhaId, this.objNDTN.toaNha.cumToaNhaId);
            this.TheXeEditor.toaNhaId = this.objNDTN.toaNhaId;
        }
    }

    loadTangLau(toanha: number, cumtoanha: number) {
        this.tanglauService.getTangLauByToaNha(toanha, cumtoanha).subscribe(results => {
            this.tanglaus = results;
            this.TheXeEditor.tanglaus = results;
            this.matbangService.getMatBangByToaNha(0, this.objNDTN.toaNhaId, this.objNDTN.toaNha.cumToaNhaId).subscribe(results => {
                results.forEach((item, index, results) => {
                    (<any>item).index = index + 1;
                });
                this.matbangsCache = [...results];
                this.matbangs = results;
                this.TheXeEditor.matbangsCache = [...results];
                this.TheXeEditor.matbangs = results;
            }, error => this.onDataLoadFailed(error));

        }, error => this.onDataLoadFailed(error));
    }

    SelectedTangLauValue(tanglau: number) {
        this.matbangService.getMatBangByToaNha(tanglau, this.objNDTN.toaNhaId, this.objNDTN.toaNha.cumToaNhaId).subscribe(results => {
            results.forEach((item, index, results) => {
                (<any>item).index = index + 1;
            });
            this.matbangsCache = [...results];
            this.matbangs = results;
        }, error => this.onDataLoadFailed(error));
        this.rows = this.rowsCache = [];
    }
    
    ngAfterViewInit() {
        this.TheXeEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.TheXeEditor.changesCancelledCallback = () => {
            this.thexeEdit = null;
            this.sourcethexe = null;
            this.editorModal.hide();
        };

        this.PhieuThuEditor.changesSavedCallback = () => {
            //sau khi save phiếu thu            
        };

        this.PhieuThuEditor.changesCancelledCallback = () => {
            //hủy phiếu thu            
        };

        this.TheXeThungRacEditor.changesSavedCallback = () => {
            this.loadAllTheXe();
            this.TheXeThungRacEditor.thungracModal.hide();
        };
    }

    addNewToList() {
        this.loadXe(this.thexeEdit.matBangId);
        this.thexeEdit = null;
        this.sourcethexe = null;
    }

    loadXe(matBangId: number) {     
        var where = "MatBangId = " + matBangId + " AND (TrangThai = 0 or TrangThai = 1)";
        this.thexeService.getItems(0, 0, where, "x").subscribe(results => {
            this.rows = results;
            this.rowsCache = results;
        }, error => this.onDataLoadFailed(error));
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.TheXeEditor.resetForm(true);
    }

    newTheXe() {
        this.editingRowName = null;
        this.sourcethexe = null;
        this.thexeEdit = this.TheXeEditor.newTheXe();
        this.editorModal.show();
        if (this.TheXeEditor.matbangs.length != this.TheXeEditor.matbangsCache.length) {
            this.TheXeEditor.matbangs = this.TheXeEditor.matbangsCache;
        }
    }

    onSearchChanged(value: string) {
        this.matbangs = this.matbangsCache.filter(r => Utilities.searchArray(value, false, r.tenMatBang));
    }

    onSearchTheXeChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.maTheXe, r.bienSoXe, r.mauXe));
    }

    deleteTheXe(row: TheXe) {
        //this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa xe này?', DialogType.confirm, () => {
            row.trangThai = -1;
            this.thexeService.updateTheXe(row.theXeId, row).subscribe(response => {
                this.alertService.showMessage("Thành công", `Thẻ xe được đưa vào thùng rác thành công`, MessageSeverity.success);
                var index = this.rowsCache.indexOf(row);
                if (index != -1) this.rowsCache.splice(index, 1);
                var index1 = this.rows.indexOf(row);
                if (index1 != -1) this.rows.splice(index1, 1);
                this.rowsDelete.push(row);
            }, error => {
                this.alertService.showStickyMessage("Lỗi", "Lỗi trong quá trình thực hiện cập nhật dữ liệu:", MessageSeverity.error, error);
            });
        });
    }

    editTheXe(row: TheXe) {
        this.editingRowName = { name: row.maTheXe };
        this.sourcethexe = row;
        this.thexeEdit = this.TheXeEditor.editTheXe(row);
        this.editorModal.show();
    }

    editStatus(row: TheXe) {
        this.alertService.showDialog('Bạn có chắc chắn muốn cập nhật trạng thái xe này?', DialogType.confirm, () => {
            if (row.trangThai == 1) row.trangThai = 0; else row.trangThai = 1;
            this.thexeService.updateTheXe(row.theXeId, row).subscribe(response => {
                this.alertService.showMessage("Thành công", `Thực hiện cập nhật trạng thái thành công`, MessageSeverity.success);
            }, error => {
                this.alertService.showStickyMessage("Lỗi", "Lỗi trong quá trình thực hiện cập nhật dữ liệu:", MessageSeverity.error, error);
            });
        });
    }

    newPhieuThu() {
        if (this.matbangObj.matBangId != null) {
            if (this.rows.length > 0) {
                var xeDangSuDung = this.rows.filter(o => o.trangThai == 1);
                if (xeDangSuDung.length > 0) {
                    this.PhieuThuEditor.phieuthuModal.show();
                    this.PhieuThuEditor.matbangObj = this.matbangObj;
                    this.PhieuThuEditor.newPhieuThu(xeDangSuDung);

                } else {
                    this.alertService.showMessage("Xe thuộc căn hộ: " + this.matbangObj.tenMatBang + " - Ngừng sử dụng", "Vui lòng thêm xe vào căn hộ hoặc đưa các xe trở lại trạng thái sử dụng dịch vụ!", MessageSeverity.error);
                }
            } else {
                this.alertService.showMessage("Căn hộ: " + this.matbangObj.tenMatBang + " - Chưa có xe để thu phí", "Vui lòng thêm xe vào căn hộ!", MessageSeverity.error);
            }
        } else {
            this.alertService.showMessage("Chưa chọn căn hộ", "Vui lòng chọn căn hộ cần thu phí gửi xe!", MessageSeverity.error);
        }

    }

    thungrac() {
        this.TheXeThungRacEditor.thexes = this.rowsDelete;
        this.TheXeThungRacEditor.thexesCache = this.rowsDelete;
        this.TheXeThungRacEditor.matbangObj = this.matbangObj;
        this.TheXeThungRacEditor.thungracModal.show();
    }

    onSelect({ selected }) {
        var row: MatBang = selected[0];
        this.matbangObj = this.matbangsCache.find(o => o.matBangId == row.matBangId);       
        this.loadAllTheXe();
    }

    loadAllTheXe() {
        var where = "MatBangId = " + this.matbangObj.matBangId;
        this.thexeService.getItems(0, 0, where, "x").subscribe(results => {
            this.rowsDelete = results.filter(o => o.trangThai == -1);
            this.rows = results.filter(o => o.trangThai == 0 || o.trangThai == 1);
            this.rowsCache = results.filter(o => o.trangThai == 0 || o.trangThai == 1);
        }, error => this.onDataLoadFailed(error));
    }
}