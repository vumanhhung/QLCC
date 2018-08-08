import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { YeuCauService } from "../../services/yeucau.service";
import { YeuCau } from "../../models/yeucau.model";
import { YeuCauInfoComponent } from "./yeucau-info.component";

import { CumToaNha } from '../../models/cumtoanha.model';
import { ToaNha } from '../../models/toanha.model';
import { TangLau } from '../../models/tanglau.model';
import { ToaNhaService } from '../../services/toanha.service';
import { CumToaNhaService } from '../../services/cumtoanha.service';
import { TangLauService } from '../../services/tanglau.service';
import { MatBang } from '../../models/matbang.model';
import { MatBangService } from '../../services/matbang.service';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { AuthService } from '../../services/auth.service';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';

@Component({
    selector: "yeucau",
    templateUrl: "./yeucau.component.html",
    styleUrls: ["./yeucau.component.css"]

})

export class YeuCauComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: YeuCau[] = [];
    rowsCache: YeuCau[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    yeucauEdit: YeuCau;
    sourceyeucau: YeuCau;
    editingRowName: { name: string };
    chkAll: boolean = true;

    cums: CumToaNha[] = [];
    toas: ToaNha[] = [];
    tang: TangLau[] = [];
    matbangs: MatBang[] = [];
    arrMatBang: number[] = [];
    listMB: string = "";
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


    @ViewChild('yeucauEditor')
    YeuCauEditor: YeuCauInfoComponent;

    @ViewChild('ThoiGianHen')
    ThoiGianHen: TemplateRef<any>;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private yeucauService: YeuCauService, private matbangService: MatBangService, private toanhaService: ToaNhaService, private cumtoanhaService: CumToaNhaService, private tanglauService: TangLauService, private authService: AuthService, private nguoidungtoanhaService: NguoiDungToaNhaService) {
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'soYeuCau', name: "Số yêu cầu" },
            { prop: 'matBang.tenMatBang', name: "Mặt bằng" },
            { prop: 'nguoiGui', name: "Người gửi" },
            { prop: 'soDienThoai', name: "Số điện thoại" },
            { name: 'Thời gian hẹn', cellTemplate: this.ThoiGianHen },
            { prop: 'cuDan.hoTen', name: "Cư dân" },
            { prop: 'tieuDe', name: "Tiêu đề" },
            { prop: 'mucDoUuTien.tenMucDoUuTien', name: "Mức độ ưu tiên" },
            { prop: 'nguonTiepNhan.tenNguonTiepNhan', name: "Nguồn tiếp nhận" },
            { prop: 'phongBan.tenPhongBan', name: "Phòng ban tiếp nhận" },
            { prop: 'trangThaiYeuCau.tenTrangThaiYeuCau', name: "Trạng thái" },
            { prop: 'loaiYeuCau.tenLoaiYeuCau', name: "Loại yêu cầu" },
            { name: 'Chức năng', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
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
        //this.loadData(this.listMB, this.chkAll);
    }

    getNguoiDungToaNha(list: NguoiDungToaNha[]) {
        if (list.length > 0) {
            this.objNDTN = list[0];
            this.loadTangLau(this.objNDTN.toaNhaId, this.objNDTN.toaNha.cumToaNhaId);
            this.chkAll = false;
            this.loadMatBang(0, this.objNDTN.toaNhaId, this.objNDTN.toaNha.cumToaNhaId);
        }
    }

    ngAfterViewInit() {
        this.YeuCauEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.YeuCauEditor.editorModal.hide();
        };

        this.YeuCauEditor.changesCancelledCallback = () => {
            this.yeucauEdit = null;
            this.sourceyeucau = null;
            this.YeuCauEditor.editorModal.hide();
        };
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
        //this.matbangs = obj;
        //if (tanglau == 0 && toanha == 0 && cumtoanha == 0) {
        //    this.listMB = "";
        //}
        //else {
        //    if (this.matbangs.length > 0) {
        //        this.listMB = "(";
        //        for (let u of this.matbangs) {
        //            this.listMB += <any>u.matBangId + ",";
        //            this.arrMatBang.push(<any>u.matBangId);
        //        }
        //        this.listMB = this.listMB.substring(0, this.listMB.length - 1);
        //        this.listMB += ")";
        //    } else {
        //        this.listMB = "";
        //    }
        //}        
        this.listMB = "";
        this.matbangs = obj;
        if (this.matbangs.length > 0) {
            this.listMB = "(";
            for (let u of this.matbangs) {
                this.listMB += <any>u.matBangId + ",";
                this.arrMatBang.push(<any>u.matBangId);
            }
            this.listMB = this.listMB.substring(0, this.listMB.length - 1);
            this.listMB += ")";
        } else {
            this.listMB = "(0)";
        }
        console.log(this.listMB);
        this.loadData(this.listMB, this.chkAll);
    }

    addNewToList() {
        if (this.sourceyeucau) {
            Object.assign(this.sourceyeucau, this.yeucauEdit);
            this.yeucauEdit = null;
            this.sourceyeucau = null;
        }
        else {
            let objYeuCau = new YeuCau();
            Object.assign(objYeuCau, this.yeucauEdit);
            this.yeucauEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objYeuCau).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objYeuCau);
            this.rows.splice(0, 0, objYeuCau);
        }
    }

    loadData(where: string, chkAll: boolean) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        if (!chkAll) {
            where = "MatBangId in " + where;
            this.yeucauService.getItems(0, 0, where, "x").subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
        } else {
            this.yeucauService.getItems(0, 0, "", "x").subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
        }
    }

    onDataLoadSuccessful(obj: YeuCau[]) {
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
        this.YeuCauEditor.resetForm(true);
    }

    newYeuCau() {
        this.editingRowName = null;
        this.sourceyeucau = null;
        this.yeucauEdit = this.YeuCauEditor.newYeuCau();
        this.YeuCauEditor.toaNhaId = this.objNDTN.toaNhaId;
        this.YeuCauEditor.cumToaNhaId = this.objNDTN.toaNha.cumToaNhaId;
        this.YeuCauEditor.editorModal.show();
        this.YeuCauEditor.cums = this.cums;
        this.YeuCauEditor.toas = this.toas;
        this.YeuCauEditor.tangs = this.tang;
        this.YeuCauEditor.matbangs = this.matbangs;
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.yeuCauId, r.soYeuCau, r.matBangId, r.nguoiGui, r.soDienThoai, r.noiDung, r.thoiGianHen, r.mucDoUuTienId, r.nguonTiepNhanId, r.tieuDe, r.phongBanId, r.trangThaiYeuCauId, r.cuDanId, r.loaiYeuCauId));
    }

    deleteYeuCau(row: YeuCau) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: YeuCau) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.yeucauService.deleteYeuCau(row.yeuCauId)
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

    editYeuCau(row: YeuCau) {
        //this.editingRowName = { name: row.soYeuCau };
        this.sourceyeucau = row;
        this.yeucauEdit = this.YeuCauEditor.editYeuCau(row);
        this.YeuCauEditor.cums = this.cums;
        this.YeuCauEditor.toas = this.toas;
        this.YeuCauEditor.tangs = this.tang;
        this.YeuCauEditor.matbangs = this.matbangs;
        this.YeuCauEditor.toaNhaId = this.objNDTN.toaNhaId;
        this.YeuCauEditor.cumToaNhaId = this.objNDTN.toaNha.cumToaNhaId;
        this.YeuCauEditor.editorModal.show();
    }


    SelectedCumToaNha(matbang: number, tanglau: number, toanha: number, cumtoanha: number) {
        this.chkAll = false;
        this.loadToaNha(cumtoanha);
        this.loadTangLau(toanha, cumtoanha);
        this.loadMatBang(tanglau, toanha, cumtoanha);
    }
    SelectedToaNha(matbang: number, tanglau: number, toanha: number, cumtoanha: number) {
        this.chkAll = false;
        this.loadTangLau(toanha, cumtoanha);
        this.loadMatBang(tanglau, toanha, cumtoanha);
    }
    SelectedTangLauValue(tanglau: number) {
        this.chkAll = false;
        this.loadMatBang(tanglau, this.objNDTN.toaNhaId, this.objNDTN.toaNha.cumToaNhaId);
    }
    SelectedMatBang(matbang: number, tanglau: number) {
        if (matbang != 0) {
            this.listMB = "(" + matbang.toString() + ")";
            this.loadData(this.listMB, false);
        } else if (matbang == 0) {
            this.chkAll = false;
            this.loadMatBang(tanglau, this.objNDTN.toaNhaId, this.objNDTN.toaNha.cumToaNhaId);
        }
    }
}