import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { CuDan } from "../../models/cudan.model";
import { CuDanService } from "./../../services/cudan.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CumToaNha } from '../../models/cumtoanha.model';
import { ToaNha } from '../../models/toanha.model';
import { TangLau } from '../../models/tanglau.model';
import { MatBang } from '../../models/matbang.model';
import * as EmailValidator from 'email-validator';
import { QuocTich } from '../../models/quoctich.model';
import { QuanHeChuHo } from '../../models/quanhechuho.model';
import { TrangThaiCuDan } from '../../models/trangthaicudan.model';
import { ToaNhaService } from '../../services/toanha.service';
import { CumToaNhaService } from '../../services/cumtoanha.service';
import { TangLauService } from '../../services/tanglau.service';
import { MatBangService } from '../../services/matbang.service';

@Component({
    selector: "cudan-info",
    templateUrl: "./cudan-info.component.html",
    styleUrls: ["./cudan-info.component.css"]
})

export class CuDanInfoComponent implements OnInit {
    public isFullScreenModal: boolean = false;
    heightScroll: number = 430;
    isViewDetails = false;
    public tencudan: string = "";
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    private isEdit = false;
    cums: CumToaNha[] = [];
    toas: ToaNha[] = [];
    tangs: TangLau[] = [];
    matbangs: MatBang[] = [];
    quoctich: QuocTich[] = [];
    chuho: CuDan[] = [];
    qhch: QuanHeChuHo[] = [];
    trangthaicudan: TrangThaiCuDan[] = [];
    cumsSelected: number;
    toasSelected: number;
    tangsSelected: number;
    isValidateEmail: boolean;
    public valueNgaySinh: Date = new Date();
    public valueNgayHetHanVisa: Date = new Date();
    public valueNgayCapHoKhau: Date = new Date();
    public valueNgayChuyenden: Date = new Date();
    public valueNgayChuyendi: Date = new Date();
    public valuengayDangKyTamTru: Date = new Date();
    public valuengayHetHanTamTru: Date = new Date();
    chkMatBangId: boolean;
    chkquocTich: boolean;
    chkChuHoId: boolean;
    chkquanHeChuHo: boolean;
    chktrangThaiTamTru: boolean;
    chktrangThaiCuDanId: boolean;
    isDisibleInputVisa: boolean = false;
    cumtoanhaView: string = "";
    toanhaView: string = "";
    tanglauView: string = "";
    ChuHoView: string = "";
    toaNhaId: number;
    cumToaNhaId: number;

    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private CuDanEdit: CuDan = new CuDan();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;
    @ViewChild('editorModal')
    editorModal: ModalDirective;

    constructor(private alertService: AlertService, private gvService: CuDanService, private toanhaService: ToaNhaService, private cumtoanhaService: CumToaNhaService, private tanglauService: TangLauService, private matbangService: MatBangService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getCuDanByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }

    private onDataLoadSuccessful(obj: CuDan) {
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

    onValidateEmail(email: string) {
        this.isValidateEmail = EmailValidator.validate(email); // true
    }
    changeVisa(visa: string) {
        try {
            if (visa.length > 0) {
                this.isDisibleInputVisa = true;
            }
            else {
                this.isDisibleInputVisa = false;
            }
        }
        catch { }
    }
    private cancel() {
        this.CuDanEdit = new CuDan();
        this.showValidationErrors = false;
        this.resetForm();
        if (this.isViewDetails == false) {
            this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        }
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    private save() {
        if (this.chkMatBangId == false || this.chkquocTich == false || this.chkquanHeChuHo == false || this.chktrangThaiTamTru == false || this.chktrangThaiCuDanId == false) {
            return false;
        }
        else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            this.CuDanEdit.ngaySinh = this.valueNgaySinh;
            this.CuDanEdit.ngayCapHoKhau = this.valueNgayCapHoKhau;
            this.CuDanEdit.ngayChuyenDen = this.valueNgayChuyenden;
            this.CuDanEdit.ngayDi = this.valueNgayChuyendi;
            this.CuDanEdit.ngayDkTamTru = this.valuengayDangKyTamTru;
            this.CuDanEdit.ngayHetHanTamTru = this.valuengayHetHanTamTru;
            this.CuDanEdit.ngayHetHanViSa = this.valueNgayHetHanVisa;

            if (this.isNew) {
                this.gvService.addnewCuDan(this.CuDanEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateCuDan(this.CuDanEdit.cuDanId, this.CuDanEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }

    cumToaNhaIdChange(tangId: number, toaId: number, cumId: number) {
        this.toasSelected = 0;
        this.tangsSelected = 0;
        this.CuDanEdit.matBangId = 0;
        this.loadToaNha(cumId);
        this.loadTangLau(toaId, cumId);
        this.loadMatBang(tangId, toaId, cumId);
    }
    ToaNhaIdChange(tangId: number, toaId: number, cumId: number) {
        this.tangsSelected = 0;
        this.CuDanEdit.matBangId = 0;
        this.loadTangLau(toaId, cumId);
        this.loadMatBang(tangId, toaId, cumId);
    }
    TangLauIdChange(tangId: number) {
        this.CuDanEdit.matBangId = 0;
        this.loadMatBang(tangId, this.toaNhaId, this.cumToaNhaId);
    }
    matBangIdChange(matbang: number) {
        if (matbang > 0) {
            this.chkMatBangId = true;
        } else {
            this.chkMatBangId = false;
        }
    }
    quocTichChange(quoctich: string) {
        if (quoctich == "0") {
            this.chkquocTich = false;
        }
        else {
            this.chkquocTich = true;
        }
    }
    chuHoChange(chuho: number) {
        if (chuho == 0) {
            this.chkChuHoId = false;
        }
        else {
            this.chkChuHoId = true;
        }
    }
    quanHeChuHoIdChange(qhch: number) {
        if (qhch == 0) {
            this.chkquanHeChuHo = false;
        }
        else {
            this.chkquanHeChuHo = true;
        }
    }
    trangThaiTamTruChange(tttt: string) {
        if (tttt == "0") {
            this.chktrangThaiTamTru = false;
        }
        else {
            this.chktrangThaiTamTru = true;
        }
    }
    trangThaiCuDanIdChange(ttcd: number) {
        if (ttcd == 0) {
            this.chktrangThaiCuDanId = false;
        }
        else {
            this.chktrangThaiCuDanId = true;
        }
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
        this.tangs = obj;
    }
    loadMatBang(tanglau: number, toanha: number, cumtoanha: number) {
        this.matbangService.getMatBangByToaNha(tanglau, toanha, cumtoanha).subscribe(results => this.onDataLoadMatBangSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadMatBangSuccessful(obj: MatBang[]) {
        this.matbangs = obj;

    }
    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }
    newCuDan() {        
        this.isEdit = false;
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.CuDanEdit = new CuDan();
        this.CuDanEdit.matBangId = 0;
        this.CuDanEdit.gioiTinh = 1;
        this.CuDanEdit.chuHo = "0";
        this.CuDanEdit.quanHeChuHoId = 0;
        this.CuDanEdit.trangThaiTamTru = 0;
        this.CuDanEdit.trangThaiCuDanId = 0;
        this.CuDanEdit.quocTich = "0";
        this.cumsSelected = 0;
        this.toasSelected = 0;
        this.tangsSelected = 0;
        this.chkMatBangId = false;
        this.chkquocTich = false;
        this.chkChuHoId = false;
        this.chkquanHeChuHo = false;
        this.chktrangThaiTamTru = false;
        this.chktrangThaiCuDanId = false;
        this.isDisibleInputVisa = false;
        this.edit();
        return this.CuDanEdit;
    }

    private saveSuccessHelper(obj?: CuDan) {
        if (obj)
            Object.assign(this.CuDanEdit, obj);

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
        this.CuDanEdit = new CuDan();
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

    editCuDan(obj: CuDan) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.isEdit = true;
            this.editingRowName = obj.hoTen;
            this.CuDanEdit = new CuDan();
            this.CuDanEdit.matBangId = obj.matBangId;
            this.CuDanEdit.gioiTinh = obj.gioiTinh;
            this.CuDanEdit.chuHo = obj.chuHo;
            this.CuDanEdit.quanHeChuHoId = obj.quanHeChuHoId;
            this.CuDanEdit.trangThaiTamTru = obj.trangThaiTamTru;
            this.CuDanEdit.trangThaiCuDanId = obj.trangThaiCuDanId;
            this.CuDanEdit.quocTich = obj.quocTich;
            //this.cumsSelected = 0;
            //this.toasSelected = 0;
            //this.tangsSelected = 0;
            if (obj.soViSa != null) {
                if (obj.soViSa.length > 0) {
                    this.isDisibleInputVisa = true;
                }
            }
            this.loadMatBangId(obj.matBangId);
            this.chkMatBangId = true;
            this.chkquocTich = true;
            this.chkChuHoId = true;
            this.chkquanHeChuHo = true;
            this.chktrangThaiTamTru = true;
            this.chktrangThaiCuDanId = true;
            Object.assign(this.CuDanEdit, obj);
            Object.assign(this.CuDanEdit, obj);
            this.edit();

            return this.CuDanEdit;
        }
        else {
            //return this.newCuDan();
        }
    }

    loadMatBangId(matbangId: number) {
        this.matbangService.getMatBangByID(matbangId).subscribe(results => this.onDataLoadMatBangSuccessful1(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadMatBangSuccessful1(obj: MatBang) {
        this.tangsSelected = obj.tangLauId;
        this.toasSelected = obj.toaNhaId;
        this.cumsSelected = obj.cumToaNhaId;
    }

    private edit() {
        if (!this.isGeneralEditor || !this.CuDanEdit) {
            this.CuDanEdit = new CuDan();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.CuDanEdit = new CuDan();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }
    private moveToEditForm() {
        this.isViewDetails = false;
        this.isEdit = true;
        this.isFullScreenModal = false;
    }
    ResizeFullScreen() {
        this.isFullScreenModal = false;
        this.heightScroll = 430;
    }
    FullScreen() {
        this.isFullScreenModal = true;
        this.heightScroll = 540;
    }
    closeModal() {
        this.isFullScreenModal = false;
        this.editorModal.hide();
    }
    SetBackground(row: CuDan) {
        let styles = {
            'background': row.trangthaicudan.mauNen
        };
        return styles;
    }
}