import { Component, OnInit, ViewChild, Input } from '@angular/core';
//import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { YeuCau } from "../../models/yeucau.model";
import { YeuCauService } from "./../../services/yeucau.service";
import { ModalDirective } from 'ngx-bootstrap/modal';

import { CumToaNha } from '../../models/cumtoanha.model';
import { ToaNha } from '../../models/toanha.model';
import { TangLau } from '../../models/tanglau.model';
import { ToaNhaService } from '../../services/toanha.service';
import { CumToaNhaService } from '../../services/cumtoanha.service';
import { TangLauService } from '../../services/tanglau.service';
import { MatBang } from '../../models/matbang.model';
import { MatBangService } from '../../services/matbang.service';
import { CuDan } from '../../models/cudan.model';
import { CuDanService } from '../../services/cudan.service';
import { PhongBan } from '../../models/phongban.model';
import { PhongBanService } from '../../services/phongban.service';

import { LoaiYeuCau } from '../../models/loaiyeucau.model';
import { LoaiYeuCauService } from '../../services/loaiyeucau.service';
import { NguonTiepNhan } from '../../models/nguontiepnhan.model';
import { NguonTiepNhanService } from '../../services/nguontiepnhan.service';
import { MucDoUuTien } from '../../models/mucdouutien.model';
import { MucDoUuTienService } from '../../services/mucdouutien.service';
import { TrangThaiYeuCau } from '../../models/trangthaiyeucau.model';
import { TrangThaiYeuCauService } from '../../services/trangthaiyeucau.service';


@Component({
    selector: "yeucau-info",
    templateUrl: "./yeucau-info.component.html",
    styleUrls: ["./yeucau-info.component.css"]
})

export class YeuCauInfoComponent implements OnInit {
    public isFullScreenModal: boolean = false;
    heightScroll: number = 430;
    isViewDetails = false;
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    private isEdit = false;

    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;

    private uniqueId: string = Utilities.uniqueId();
    private YeuCauEdit: YeuCau = new YeuCau();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    cums: CumToaNha[] = [];
    toas: ToaNha[] = [];
    tangs: TangLau[] = [];
    matbangs: MatBang[] = [];
    cudans: CuDan[] = [];
    phongbans: PhongBan[] = [];
    loaiyeucaus: LoaiYeuCau[] = [];
    nguontiepnhans: NguonTiepNhan[] = [];
    mucdouutiens: MucDoUuTien[] = [];
    trangthaiyeucaus: TrangThaiYeuCau[] = [];
    arrMatBang: number[] = [];
    listToaNha: string = "";
    cumsSelected: number;
    toasSelected: number;
    tangsSelected: number;
    public valueNgayHen: Date = new Date();
    chkPhongBan: boolean = false;
    chkLoaiYeuCau: boolean = false;
    chkMucDoUuTien: boolean = false;
    chkNguonTiepNhan: boolean = false;
    chkTrangThaiYeuCau: boolean = false;
    toaNhaId: number;
    cumToaNhaId: number;

    public objCum: CumToaNha = new CumToaNha;
    public objMatBang: MatBang = new MatBang;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;


    @ViewChild('editorModal')
    editorModal: ModalDirective;

    constructor(private alertService: AlertService, private gvService: YeuCauService, private matbangService: MatBangService, private toanhaService: ToaNhaService, private cumtoanhaService: CumToaNhaService, private tanglauService: TangLauService, private cudanService: CuDanService, private phongbanService: PhongBanService, private loaiyeucauService: LoaiYeuCauService, private nguontiepnhanService: NguonTiepNhanService, private mucdouutienService: MucDoUuTienService, private trangthaiyeucauService: TrangThaiYeuCauService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getYeuCauByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: YeuCau) {
        this.alertService.stopLoadingMessage();
    }

    private onCurrentUserDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    resetForm(replace = false) {

        if (!replace) {
            this.form.reset();
        }
        else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }

    private cancel() {
        this.YeuCauEdit = new YeuCau();
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    private save() {
        if (this.chkPhongBan == false || this.chkLoaiYeuCau == false || this.chkMucDoUuTien == false || this.chkNguonTiepNhan == false || this.chkTrangThaiYeuCau == false) {
            return false;
        }
        else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");

            this.YeuCauEdit.thoiGianHen = this.valueNgayHen;
            this.YeuCauEdit.matBangId = this.objMatBang.matBangId;
            if (this.isNew) {
                this.gvService.addnewYeuCau(this.YeuCauEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateYeuCau(this.YeuCauEdit.yeuCauId, this.YeuCauEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }

    newYeuCau() {
        this.cumsSelected = 0;
        this.toasSelected = 0;
        this.tangsSelected = 0;
        this.isEdit = false;
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.YeuCauEdit = new YeuCau();
        this.YeuCauEdit.matBangId = 0;
        this.YeuCauEdit.cuDanId = 0;
        this.YeuCauEdit.phongBanId = 0;
        this.YeuCauEdit.loaiYeuCauId = 0;
        this.YeuCauEdit.mucDoUuTienId = 0;
        this.YeuCauEdit.nguonTiepNhanId = 0;
        this.YeuCauEdit.trangThaiYeuCauId = 0;
        this.loadCuDan(this.arrMatBang, true);
        this.loadPhongBan(true, 0, "");
        this.loadLoaiYeuCau();
        this.loadNguonTiepNhan();
        this.loadMucDoUuTien();
        this.loadTrangThaiYeuCau();
        this.edit();
        this.chkPhongBan = false;
        this.chkLoaiYeuCau = false;
        this.chkMucDoUuTien = false;
        this.chkNguonTiepNhan = false;
        this.chkTrangThaiYeuCau = false;
        return this.YeuCauEdit;
    }

    private saveSuccessHelper(obj?: YeuCau) {
        if (obj)
            Object.assign(this.YeuCauEdit, obj);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;
        if (this.isGeneralEditor) {
            if (this.isNew) {
                this.alertService.showMessage("Thành công", `Thực hiện thêm mới thành công`, MessageSeverity.success);
            }
            else
                this.alertService.showMessage("Thành công", `Thực hiện thay đổi thông tin thành công`, MessageSeverity.success);
        }
        this.YeuCauEdit = new YeuCau();
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    editYeuCau(obj: YeuCau) {
        if (obj) {
            this.loadMatBangId(obj.matBangId);
            this.isGeneralEditor = true;
            this.isNew = false;
            this.isEdit = true;
            this.editingRowName = obj.soYeuCau;
            this.YeuCauEdit = new YeuCau();
            Object.assign(this.YeuCauEdit, obj);
            this.edit();
            this.chkPhongBan = true;
            this.chkLoaiYeuCau = true;
            this.chkMucDoUuTien = true;
            this.chkNguonTiepNhan = true;
            this.chkTrangThaiYeuCau = true;
            return this.YeuCauEdit;
        }
        else {
            //return this.newYeuCau();
        }
    }

    loadMatBangId(matbangId: number) {
        this.matbangService.getMatBangByID(matbangId).subscribe(results => this.onDataLoadMatBangSuccessful1(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadMatBangSuccessful1(obj: MatBang) {
        this.tangsSelected = obj.tangLauId;
        this.toasSelected = obj.toaNhaId;
        this.cumsSelected = obj.cumToaNhaId;
        this.loadPhongBan(false, obj.cumToaNhaId, "(" + obj.toaNhaId + ")");
        this.matBangIdChange(obj.matBangId, obj.tangLauId, obj.toaNhaId, obj.cumToaNhaId);
        this.loadLoaiYeuCau();
        this.loadMucDoUuTien();
        this.loadNguonTiepNhan();
        this.loadTrangThaiYeuCau();
        this.objMatBang = obj;
        for (var i = 0; i < this.cums.length; i++) {
            if (this.cums[i].cumToaNhaId == obj.cumToaNhaId) {
                this.objCum = this.cums[i];
            }
        }

    }

    private edit() {
        if (!this.isGeneralEditor || !this.YeuCauEdit) {
            this.YeuCauEdit = new YeuCau();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.YeuCauEdit = new YeuCau();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }

    cumToaNhaIdChange(tangId: number, toaId: number, cumId: number) {
        this.toasSelected = 0;
        this.tangsSelected = 0;
        this.YeuCauEdit.matBangId = 0;
        this.loadToaNha(cumId);
        this.loadTangLau(toaId, cumId);
        this.loadMatBang(tangId, toaId, cumId);
    }
    ToaNhaIdChange(tangId: number, toaId: number, cumId: number) {
        this.tangsSelected = 0;
        this.YeuCauEdit.matBangId = 0;
        this.loadTangLau(toaId, cumId);
        this.loadMatBang(tangId, toaId, cumId);
        this.loadPhongBan(false, cumId, "(" + toaId + ")");
    }
    TangLauIdChange(tangId: number) {
        this.YeuCauEdit.matBangId = 0;
        this.loadMatBang(tangId, this.toaNhaId, this.cumToaNhaId);
    }

    matBangIdChange(matbang: number, tanglau: number, toanha: number, cumtoanha: number) {
        if (matbang != 0) {
            this.arrMatBang = [];
            this.arrMatBang.push(matbang);
            this.loadCuDan(this.arrMatBang, false);
        } else {
            this.loadCuDan(this.arrMatBang, true);
        }
    }
    mbChange(value) {
        this.arrMatBang = [];
        if (value != null) {
            var x: MatBang = value;
            this.arrMatBang.push(x.matBangId);
            this.loadCuDan(this.arrMatBang, false);
        } else {
            for (let u of this.matbangs) {
                this.arrMatBang.push(<any>u.matBangId);
            }
            if (this.arrMatBang.length < 1) {
                this.arrMatBang.push(0)
            }
            this.loadCuDan(this.arrMatBang, false);
        }
    }

    loadToaNha(cumtoanha: number) {
        this.toanhaService.getToaNhaByCum(cumtoanha).subscribe(results => this.onDataToaNhaLoadSuccessful(results, cumtoanha), error => this.onDataLoadFailed(error));
    }
    onDataToaNhaLoadSuccessful(obj: ToaNha[], cumtoanha: number) {
        this.toas = obj;
        if (this.toas.length > 0) {
            this.listToaNha = "(";
            for (let u of this.toas) {
                this.listToaNha += <any>u.toaNhaId + ",";
                this.arrMatBang.push(<any>u.toaNhaId);
            }
            this.listToaNha = this.listToaNha.substring(0, this.listToaNha.length - 1);
            this.listToaNha += ")";
        } else {
            this.listToaNha = "";
        }
        this.loadPhongBan(false, cumtoanha, this.listToaNha);
    }
    loadTangLau(toanha: number, cumtoanha: number) {
        this.tanglauService.getTangLauByToaNha(toanha, cumtoanha).subscribe(results => this.onDataLoadTangLauSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadTangLauSuccessful(obj: TangLau[]) {
        this.tangs = obj;
    }
    loadMatBang(tanglau: number, toanha: number, cumtoanha: number) {
        this.matbangService.getMatBangByToaNha(tanglau, toanha, cumtoanha).subscribe(results => this.onDataLoadMatBangSuccessful(results, tanglau, toanha, cumtoanha), error => this.onDataLoadFailed(error));
    }
    onDataLoadMatBangSuccessful(obj: MatBang[], tanglau: number, toanha: number, cumtoanha: number) {
        this.matbangs = obj;
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

        this.loadCuDan(this.arrMatBang, false);
    }

    loadCuDan(matbang: number[], chkAll: boolean) {
        if (chkAll)
            this.cudanService.getAllCuDan().subscribe(results => this.onDataLoadCuDanSuccessful(results), error => this.onDataLoadFailed(error));
        else
            this.cudanService.getCuDanByMatBang(matbang).subscribe(results => this.onDataLoadCuDanSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadCuDanSuccessful(obj: CuDan[]) {
        this.cudans = obj;
    }

    loadPhongBan(chkAll: boolean, cumId: number, listToaNha: string) {
        if (chkAll)
            this.phongbanService.getAllPhongBan().subscribe(results => this.onDataLoadPhongBanSuccessful(results), error => this.onDataLoadFailed(error));
        else {
            if (listToaNha.length > 0) {
                listToaNha = "ToaNhaId in " + listToaNha;
                this.phongbanService.getItems(0, 0, listToaNha, "x").subscribe(results => this.onDataLoadPhongBanSuccessful(results), error => this.onDataLoadFailed(error));
            }
        }
    }

    onDataLoadPhongBanSuccessful(obj: PhongBan[]) {
        this.phongbans = obj;
    }

    loadLoaiYeuCau() {
        this.loaiyeucauService.getAllLoaiYeuCau().subscribe(results => this.onDataLoadLoaiYeuCauSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadLoaiYeuCauSuccessful(obj: LoaiYeuCau[]) {
        this.loaiyeucaus = obj;
    }

    loadNguonTiepNhan() {
        this.nguontiepnhanService.getAllNguonTiepNhan().subscribe(results => this.onDataLoadNguonTiepNhanSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadNguonTiepNhanSuccessful(obj: NguonTiepNhan[]) {
        this.nguontiepnhans = obj;
    }

    loadMucDoUuTien() {
        this.mucdouutienService.getAllMucDoUuTien().subscribe(results => this.onDataLoadMucDoUuTienSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadMucDoUuTienSuccessful(obj: MucDoUuTien[]) {
        this.mucdouutiens = obj;
    }
    loadTrangThaiYeuCau() {
        this.trangthaiyeucauService.getAllTrangThaiYeuCau().subscribe(results => this.onDataLoadTrangThaiYeuCauSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadTrangThaiYeuCauSuccessful(obj: TrangThaiYeuCau[]) {
        this.trangthaiyeucaus = obj;
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }


    SelectCategoryChange(type: number, value: string) {
        switch (type) {
            case 1:
                if (value == "0") {
                    this.chkPhongBan = false;
                }
                else {
                    this.chkPhongBan = true;
                }
                break;
            case 2:
                if (value == "0") {
                    this.chkLoaiYeuCau = false;
                }
                else {
                    this.chkLoaiYeuCau = true;
                }
                break;
            case 3:
                if (value == "0") {
                    this.chkMucDoUuTien = false;
                }
                else {
                    this.chkMucDoUuTien = true;
                }
                break;
            case 4:
                if (value == "0") {
                    this.chkNguonTiepNhan = false;
                }
                else {
                    this.chkNguonTiepNhan = true;
                }
                break;
            case 5:
                if (value == "0") {
                    this.chkTrangThaiYeuCau = false;
                }
                else {
                    this.chkTrangThaiYeuCau = true;
                }
                break;
        }
    }

}