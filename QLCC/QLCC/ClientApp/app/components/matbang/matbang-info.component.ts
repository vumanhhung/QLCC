import { Component, OnInit, ViewChild, Input, ElementRef, HostListener } from '@angular/core';
import { fadeInOut } from '../../services/animations';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { MatBang } from "../../models/matbang.model";
import { MatBangService } from "./../../services/matbang.service";
import { CumToaNha } from '../../models/cumtoanha.model';
import { ToaNha } from '../../models/toanha.model';
import { TangLau } from '../../models/tanglau.model';
import { ToaNhaService } from '../../services/toanha.service';
import { CumToaNhaService } from '../../services/cumtoanha.service';
import { TangLauService } from '../../services/tanglau.service';
import { TrangThai } from '../../models/trangthai.model';
import { TrangThaiService } from '../../services/trangthai.service';
import { LoaiTien } from '../../models/loaitien.model';
import { LoaiTienService } from '../../services/loaitien.service';
import { LoaiMatBang } from '../../models/loaimatbang.model';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { KhachHang } from '../../models/khachhang.model';
import { KhachHangService } from '../../services/khachhang.service';
import { CuDan } from '../../models/cudan.model';
import { CuDanService } from '../../services/cudan.service';
import { concat } from 'rxjs/operator/concat';

@Component({
    selector: "matbang-info",
    templateUrl: "./matbang-info.component.html",
    styleUrls: ["./matbang-info.component.css"],
    animations: [fadeInOut]
})

export class MatBangInfoComponent implements OnInit {
    khachhangsFilter: KhachHang[];
    cudansFilter: CuDan[];
    public tenmatbang: string = "";
    public isFullScreenModal: boolean = false;
    isViewDetails = false;
    valuedienTich: string = "0";
    public scrollbarOptions = { axis: 'xy', theme: 'minimal-dark' };
    public heightScroll: any = 500;
    valuegiaThue: string = "0";
    trangthaichiakhoa: boolean;
    chkCumToaNhaId: boolean;
    chkToaNhaId: boolean;
    chktangLauId: boolean;
    chkTrangThaiId: boolean;
    bgcolorStautus: string = "#fff";
    chkloaiMatBangId: boolean;
    chkloaiTien: boolean;
    loaitien: LoaiTien[] = [];
    chkcaNhan: boolean;
    chkgiaoChiaKhoa: boolean;
    chkchuSoHuu: boolean;
    private isNew = false;
    private isEdit = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private MatBangEdit: MatBang = new MatBang();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    //public cums: CumToaNha[];
    //public toas: ToaNha[];
    public tangs: TangLau[];
    public trangthais: TrangThai[];
    public loaimatbangs: LoaiMatBang[];
    public trangthaiByID: TrangThai;
    khachhangs: KhachHang[] = [];
    khachhang: KhachHang = new KhachHang();
    cudans: CuDan[] = [];
    cudan: CuDan = new CuDan();

    @Input()
    isViewOnly: boolean;
    loadingIndicator: boolean
    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;
    @ViewChild('editorModal')
    editorModal: ModalDirective;
    constructor(private el: ElementRef, private alertService: AlertService, private gvService: MatBangService, private toanhaService: ToaNhaService, private cumtoanhaService: CumToaNhaService, private tanglauService: TangLauService, private trangthaiService: TrangThaiService, private khService: KhachHangService, private cudanService: CuDanService) {
    }


    ngOnInit() {
        //if (!this.isGeneralEditor) {
        //    this.loadData();
        //}

        this.loadData();
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.khachhangs = [];
        this.cudans = [];
        this.cudanService.getAllCuDan().subscribe(result => { this.cudans = result, this.cudansFilter = result }, error => this.onCurrentUserDataLoadFailed(error));
    }

    //private onDataLoadSuccessful(obj: MatBang) {
    //    this.alertService.stopLoadingMessage();
    //}

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
        if (this.isViewDetails == false) {
            this.MatBangEdit = new MatBang();
            this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        }
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    private save() {
        if (this.chkcaNhan == false || this.chkchuSoHuu == false || this.chkgiaoChiaKhoa == false || this.chkloaiMatBangId == false || this.chkloaiTien == false || this.chktangLauId == false || this.chkTrangThaiId == false) { return false; }
        else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            this.MatBangEdit.ngaybanGiao = this.value;
            this.MatBangEdit.khacHangId = this.khachhang.khachHangId;            
            try {
                this.MatBangEdit.khachThue = this.cudan.cuDanId;
            } catch (e) {
                this.MatBangEdit.khachThue = null;
            }
            
            if (this.isNew) {
                this.gvService.addnewMatBang(this.MatBangEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateMatBang(this.MatBangEdit.matBangId, this.MatBangEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }


    onShowTab(event) {
        //this.setActiveTab(event.target.hash);

        //switch (this.activeTab) {
        //    case this.profileTab:
        //        this.isProfileActived = true;
        //        break;
        //    case this.preferencesTab:
        //        this.isPreferencesActived = true;
        //        break;
        //    case this.usersTab:
        //        this.isUsersActived = true;
        //        break;
        //    case this.rolesTab:
        //        this.isRolesActived = true;
        //        break;
        //    default:
        //        throw new Error("Đã không chọn tab bắt đầu. Tab đã chọn: " + this.activeTab);
        //}
    }


    newMatBang(toaNhaId: number, cumToaNhaId: number) {
        this.bgcolorStautus = "#fff";
        this.chktangLauId = false;
        this.chkTrangThaiId = false;
        this.chkloaiMatBangId = false;
        this.chkloaiTien = false;
        this.chkcaNhan = false;
        this.chkgiaoChiaKhoa = false;
        this.chkchuSoHuu = false;

        this.isGeneralEditor = true;
        this.isNew = true;
        this.isEdit = false;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.MatBangEdit = new MatBang();
        this.MatBangEdit.cumToaNhaId = cumToaNhaId;
        this.MatBangEdit.toaNhaId = toaNhaId;
        this.MatBangEdit.tangLauId = 0;
        this.MatBangEdit.trangThaiId = 0;
        this.MatBangEdit.loaiMatBangId = 0;
        this.MatBangEdit.loaiTien = "0";
        this.MatBangEdit.caNhan = 0;
        this.MatBangEdit.giaoChiaKhoa = 0;
        this.MatBangEdit.khacHangId = 0;
        this.MatBangEdit.khachThue = 0;
        this.edit();
        return this.MatBangEdit;
    }


    private saveSuccessHelper(obj?: MatBang) {
        if (obj)
            Object.assign(this.MatBangEdit, obj);

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
        this.MatBangEdit = new MatBang();
        this.resetForm();
        this.isEditMode = false;
        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    ondienTichChange(dt: number) {
        this.valuedienTich = Utilities.formatNumber(dt);
    }
    ongiaThueChange(gt: number) {
        this.valuegiaThue = Utilities.formatNumber(gt);
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

    editMatBang(obj: MatBang) {
        //this.loadToaNhaByCumToaNha(obj.cumToaNhaId);
        this.loadTangLauByToaNha(obj.toaNhaId, obj.cumToaNhaId);
        this.LoadTrangthaiById(obj.trangThaiId);
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.isEdit = true;
            this.editingRowName = obj.tenMatBang;
            this.MatBangEdit = new MatBang();
            Object.assign(this.MatBangEdit, obj);
            this.valuedienTich = Utilities.formatNumber(obj.dienTich);
            this.valuegiaThue = Utilities.formatNumber(obj.giaThue);
            this.getKhachHang(this.MatBangEdit.caNhan, this.MatBangEdit.khacHangId);
            if (this.MatBangEdit.khachThue != null) this.cudan = this.cudans.find(o => o.cuDanId == this.MatBangEdit.khachThue);
            this.edit();

            return this.MatBangEdit;
        }
        else {
            //return this.newMatBang();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.MatBangEdit) {
            this.MatBangEdit = new MatBang();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.MatBangEdit = new MatBang();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    //loadToaNhaByCumToaNha(s: number) {
    //    this.toanhaService.getToaNhaByCum(s).subscribe(results => this.onDataLoadToaNhaSuccessful(results), error => this.onDataLoadFailed(error));
    //}

    loadTangLauByToaNha(toanha: number, cumtoanha) {
        this.tanglauService.getTangLauByToaNha(toanha, cumtoanha).subscribe(results => this.onDataLoadTangLauSuccessful(results), error => this.onDataLoadFailed(error));
    }
    //onDataLoadToaNhaSuccessful(obj: ToaNha[]) {
    //    this.toas = obj;
    //}
    onDataLoadTangLauSuccessful(obj: TangLau[]) {
        this.tangs = obj;
    }
    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    //cumToaNhaIdChange(cumId: number) {
    //    if (cumId > 0) {
    //        this.chkCumToaNhaId = true;
    //    } else {
    //        this.chkCumToaNhaId = false;
    //    }
    //    this.MatBangEdit.toaNhaId = 0;
    //    this.loadToaNhaByCumToaNha(cumId);
    //    this.loadTangLauByToaNha(0, cumId);
    //}

    //ToaNhaIdChange(toanhaId: number, cumtoanhaId: number) {
    //    if (toanhaId > 0) {
    //        this.chkToaNhaId = true;
    //    } else {
    //        this.chkToaNhaId = false;
    //    }
    //    this.MatBangEdit.tangLauId = 0;
    //    this.loadTangLauByToaNha(toanhaId, cumtoanhaId);
    //}

    TangLauIdChange(tanglauId: number) {
        if (tanglauId > 0) {
            this.chktangLauId = true;
        } else {
            this.chktangLauId = false;
        }
    }
    loaiMatBangChange(loaimatbang: number) {
        if (loaimatbang > 0) {
            this.chkloaiMatBangId = true;
        } else {
            this.chkloaiMatBangId = false;
        }
    }
    loaiTienChange(loaiTien: string) {
        if (loaiTien != '0') {
            this.chkloaiTien = true;
        } else {
            this.chkloaiTien = false;
        }
    }
    getKhachHang(canhanh: number, khachhangId: number) {
        if (canhanh == 1) {
            this.chkcaNhan = true;
            this.khService.getAllKhachHang().subscribe(result => {
                this.khachhangs = result;
                this.khachhangsFilter = result;
                this.khachhang = this.khachhangs.find(o => o.khachHangId == khachhangId);
            }, error => this.onCurrentUserDataLoadFailed(error));
        } else if (canhanh == 2) {
            this.khService.getAllKhachHangDoanhNghiep().subscribe(result => {
                this.khachhangs = result;
                this.khachhangsFilter = result;
                this.khachhang = this.khachhangs.find(o => o.khachHangId == khachhangId);
            }, error => this.onCurrentUserDataLoadFailed(error));
            this.chkcaNhan = true;
        } else {
            this.chkcaNhan = false;
        }
    }
    caNhanChange(canhanh: number) {
        if (canhanh == 1) {
            this.chkcaNhan = true;
            this.khService.getAllKhachHang().subscribe(result => { this.khachhangs = result, this.khachhangsFilter = result }, error => this.onCurrentUserDataLoadFailed(error));
        } else if (canhanh == 2) {
            this.khService.getAllKhachHangDoanhNghiep().subscribe(result => { this.khachhangs = result, this.khachhangsFilter = result }, error => this.onCurrentUserDataLoadFailed(error));
            this.chkcaNhan = true;
        } else {
            this.chkcaNhan = false;
        }
    }
    trangThaiIdChange(trangthaiId: number) {
        if (trangthaiId > 0) {
            this.LoadTrangthaiById(trangthaiId);
            this.chkTrangThaiId = true;
        } else {
            this.chkTrangThaiId = false;
            this.bgcolorStautus = "#fff";
        }
    }

    LoadTrangthaiById(idTrangThai: number) {
        this.trangthaiService.getTrangThaiByID(idTrangThai).subscribe(results => this.onDataLoadTrangThaiSingleSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadTrangThaiSingleSuccessful(tt: TrangThai) {
        this.trangthaiByID = tt;
        this.bgcolorStautus = tt.mauNen;
    }
    chuSoHuuChange(khachhang) {
        if (khachhang) {
            this.chkchuSoHuu = true;
        }
        else {
            this.chkchuSoHuu = false;
        }
    }
    //khachThueChange(cudan) {        
    //}

    khachThuefilterChange(value) {
        this.cudansFilter = this.cudans.filter((s) => s.hoTen.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    chuSoHuufilterChange(value) {
        this.khachhangsFilter = this.khachhangs.filter((s) => s.tenDayDu.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    giaoChiaKhoaChange(s: number) {
        if (s > 0) {
            this.chkgiaoChiaKhoa = true;
        }
        else {
            this.chkgiaoChiaKhoa = false;
        }
        if (s != 1) {
            this.trangthaichiakhoa = false;
        }
        else {
            this.trangthaichiakhoa = true;
        }
    }
    private moveToEditForm() {
        this.isViewDetails = false;
        this.isEdit = true;
        this.isFullScreenModal = false;
    }

    ResizeFullScreen() {
        this.isFullScreenModal = false;
    }
    FullScreen() {
        this.isFullScreenModal = true;
    }
}