import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { DichVuNuoc } from "../../models/dichvunuoc.model";
import { DichVuNuocService } from "./../../services/dichvunuoc.service";
import { MatBang } from '../../models/matbang.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DinhMucNuoc } from '../../models/dinhmucnuoc.model';
import { TienNuoc } from '../../models/tiennuoc.model';

@Component({
    selector: "dichvunuoc-info",
    templateUrl: "./dichvunuoc-info.component.html",
    styleUrls: ["./dichvunuoc-info.component.css"]
})

export class DichVuNuocInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private DichVuNuocEdit: DichVuNuoc = new DichVuNuoc();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };

    public matbangs: MatBang[] = [];
    public matbangsFilter: MatBang[] = [];
    public matbangSelected: MatBang = new MatBang();
    public dinhMucNuocs: DinhMucNuoc[] = [];
    tiennuocs: TienNuoc[] = [];
    tongtien: number;
    vat: number;
    bvmt: number;
    thanhtoan: number;

    tuNgay: Date;
    denNgay: Date;
    sthang: number = 0;
    mbChk: boolean = false;
    tuNgayChk: boolean = false;
    denNgayChk: boolean = false;
    ssNgayChk: boolean = false;
    chisomoiChk: boolean = false;


    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    constructor(private alertService: AlertService, private gvService: DichVuNuocService) {
    }

    ngOnInit() {
        //if (!this.isGeneralEditor) {
        //    this.loadData();
        //}
    }

    setDateControl(thang: number) {        
        if (thang == 0) {
            thang = new Date().getMonth() + 1;
            this.sthang = thang;
        }        
        this.tuNgay = new Date();
        this.tuNgay.setMonth(thang - 1);
        this.tuNgay.setDate(1);
        this.denNgay = new Date();
        this.denNgay.setMonth(thang);
        this.denNgay.setDate(0);
        this.tuNgayChk = true;
        this.denNgayChk = true;
        this.ssNgayChk = true;
    }

    //loadData() {
    //    this.alertService.startLoadingMessage();
    //    this.gvService.getDichVuNuocByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    //}

    //private onDataLoadSuccessful(obj: DichVuNuoc) {
    //    this.alertService.stopLoadingMessage();
    //}

    private onCurrentUserDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    onEditorModalHidden() {
        this.resetForm(true);
    }

    resetForm(replace = false) {

        if (!replace) {
            this.matbangSelected = new MatBang();
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
        this.DichVuNuocEdit = new DichVuNuoc();
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
        if (!this.mbChk || !this.tuNgayChk || !this.denNgayChk || !this.ssNgayChk || !this.chisomoiChk || !this.DichVuNuocEdit.chiSoMoi) {
            this.showErrorAlert('Mặt bằng không được để trống', 'Vui lòng chọn mặt bằng!');
            return false;
        } else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");

            this.DichVuNuocEdit.matBangId = this.matbangSelected.matBangId;
            this.DichVuNuocEdit.khachHangId = this.matbangSelected.khachHangId;
            this.DichVuNuocEdit.tuNgay = this.tuNgay;
            this.DichVuNuocEdit.denNgay = this.denNgay;
            this.DichVuNuocEdit.thanhTien = this.tongtien;
            this.DichVuNuocEdit.tyLeVAT = 5;
            this.DichVuNuocEdit.tienVAT = this.vat;
            this.DichVuNuocEdit.tyLeBVMT = 10;
            this.DichVuNuocEdit.tienBVMT = this.bvmt;
            this.DichVuNuocEdit.tienThanhToan = this.thanhtoan;
            this.DichVuNuocEdit.thang = this.sthang;
            this.DichVuNuocEdit.nam = new Date().getFullYear();
            if (this.isNew) {
                this.gvService.addnewDichVuNuoc(this.DichVuNuocEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateDichVuNuoc(this.DichVuNuocEdit.dichVuNuocId, this.DichVuNuocEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }

    newDichVuNuoc() {
        this.setDateControl(0);
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.DichVuNuocEdit = new DichVuNuoc();
        this.mbChk = false;
        this.chisomoiChk = true;
        this.edit();
        return this.DichVuNuocEdit;
    }

    private saveSuccessHelper(obj?: DichVuNuoc) {
        if (obj)
            Object.assign(this.DichVuNuocEdit, obj);

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
        this.DichVuNuocEdit = new DichVuNuoc();
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

    editDichVuNuoc(obj: DichVuNuoc) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.thang.toString();
            this.DichVuNuocEdit = new DichVuNuoc();
            Object.assign(this.DichVuNuocEdit, obj);
            this.tinhgianuoc(this.DichVuNuocEdit.soTieuThu);
            this.matbangSelected = this.matbangs.find(o => o.matBangId == this.DichVuNuocEdit.matBangId);
            this.sthang = this.DichVuNuocEdit.thang;
            this.setDateControl(this.DichVuNuocEdit.thang);
            this.mbChk = true;
            this.edit();

            return this.DichVuNuocEdit;
        }
        else {
            return this.newDichVuNuoc();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.DichVuNuocEdit) {
            this.DichVuNuocEdit = new DichVuNuoc();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.DichVuNuocEdit = new DichVuNuoc();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    matbangChange(matbang: MatBang) {
        if (matbang != null) {
            this.mbChk = true;
            if (matbang.dichVuNuoc != null) {
                this.DichVuNuocEdit.chiSoCu = matbang.dichVuNuoc.chiSoMoi;
            }
            else this.DichVuNuocEdit.chiSoCu = 0;
        }
        else this.mbChk = false;
    }

    matbangfilterChange(value) {
        this.matbangsFilter = this.matbangs.filter((s) => s.tenMatBang.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    tungayChange(tungay: Date) {
        if (tungay != null) this.tuNgayChk = true;
        else this.tuNgayChk = false;
        this.ssNgayFun();
    }

    denngayChange(denngay: Date) {
        if (denngay != null) this.denNgayChk = true;
        else this.denNgayChk = false;
        this.ssNgayFun();
    }

    ssNgayFun() {
        if (this.tuNgay != null && this.denNgay != null) {
            console.log("Từ ngày: " + this.tuNgay.getFullYear() + "," + this.tuNgay.getMonth() + "," + this.tuNgay.getDate());
            console.log("Đến ngày: " + this.denNgay.getFullYear() + "," + this.denNgay.getMonth() + "," + this.denNgay.getDate());
            console.log(this.ssNgayChk);
            if (this.tuNgay.getFullYear() > this.denNgay.getFullYear() ||
                (this.tuNgay.getFullYear() == this.denNgay.getFullYear() && this.tuNgay.getMonth() > this.denNgay.getMonth()) ||
                (this.tuNgay.getFullYear() == this.denNgay.getFullYear() && this.tuNgay.getMonth() == this.denNgay.getMonth() && this.tuNgay.getDate() >= this.denNgay.getDate())
            ) {
                this.ssNgayChk = false;
            }
            else this.ssNgayChk = true;

            console.log(this.ssNgayChk);
        }
    }

    chisomoiChange(price: string) {
        if (this.DichVuNuocEdit.chiSoMoi < this.DichVuNuocEdit.chiSoCu || this.DichVuNuocEdit.chiSoMoi < 0) {
            this.chisomoiChk = false;
        } else {
            this.chisomoiChk = true;
            this.DichVuNuocEdit.soTieuThu = this.DichVuNuocEdit.chiSoMoi - this.DichVuNuocEdit.chiSoCu;
            var sotieuthu = this.DichVuNuocEdit.chiSoMoi - this.DichVuNuocEdit.chiSoCu;
            this.tinhgianuoc(sotieuthu);
        }

        if (!this.DichVuNuocEdit.chiSoMoi) {
            this.DichVuNuocEdit.soTieuThu = null;
            this.chisomoiChk = true;
        }
    }

    tinhgianuoc(sotieuthu: number) {
        this.tiennuocs = [];
        if (this.dinhMucNuocs.length > 0) {
            var temp = 0;
            var tt = 0;
            for (var i = 0; i < this.dinhMucNuocs.length; i++) {
                var tn = new TienNuoc();
                tn.bac = this.dinhMucNuocs[i].tenDinhMucNuoc;
                tn.gia = this.dinhMucNuocs[i].gia;
                if (this.dinhMucNuocs[i].soCuoi != null)
                    tn.dinhMuc = this.dinhMucNuocs[i].soDau.toString() + " - " + this.dinhMucNuocs[i].soCuoi.toString();
                else tn.dinhMuc = this.dinhMucNuocs[i].soDau.toString() + " - Trở lên";

                if (this.dinhMucNuocs[i].soCuoi == null) {
                    temp = sotieuthu - this.dinhMucNuocs[i].soDau;
                    if (temp > 0) {
                        tn.soTinhPhi = temp;
                    }
                    else if (temp == 0) {
                        tn.soTinhPhi = temp;
                    }
                    else {
                        tn.soTinhPhi = 0;
                    }
                }
                else {
                    temp = sotieuthu - this.dinhMucNuocs[i].soCuoi;
                    if (temp > 0) {
                        tn.soTinhPhi = this.dinhMucNuocs[i].soCuoi - this.dinhMucNuocs[i].soDau;
                    }
                    else if (temp == 0) {
                        tn.soTinhPhi = this.dinhMucNuocs[i].soCuoi - this.dinhMucNuocs[i].soDau;
                    }
                    else if (i == 0 && temp < 0) {
                        tn.soTinhPhi = sotieuthu;
                    } else if (i > 0 && temp < 0) {
                        var temp2 = sotieuthu - this.dinhMucNuocs[i].soDau;
                        if (temp2 > 0) tn.soTinhPhi = temp2; else tn.soTinhPhi = 0;
                    }
                }
                tn.thanhTien = tn.gia * tn.soTinhPhi;
                tt += tn.thanhTien;
                this.tiennuocs.push(tn);
            }
            this.tongtien = tt;
            this.vat = Math.round(this.tongtien * 0.05);
            this.bvmt = Math.round(this.tongtien * 0.1);
            this.thanhtoan = this.tongtien + this.vat + this.bvmt;
        }
    }

    formatNumberToString(value: number): string {
        return Utilities.formatNumber(value);
    }

    sthangChange() {                
        this.setDateControl(this.sthang);
    }
}