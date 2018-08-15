import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { BangGiaDichVuCoBan } from "../../models/banggiadichvucoban.model";
import { BangGiaDichVuCoBanService } from "./../../services/banggiadichvucoban.service";
import { LoaiDichVu } from '../../models/loaidichvu.model';
import { LoaiTien } from '../../models/loaitien.model';
import { DonViTinh } from '../../models/donvitinh.model';

@Component({
    selector: "banggiadichvucoban-info",
    templateUrl: "./banggiadichvucoban-info.component.html",
    styleUrls: ["./banggiadichvucoban-info.component.css"]
})

export class BangGiaDichVuCoBanInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private BangGiaDichVuCoBanEdit: BangGiaDichVuCoBan = new BangGiaDichVuCoBan();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    toaNhaId: number;
    loaidichvus: LoaiDichVu[] = [];
    loaitiens: LoaiTien[] = [];
    donvitinhs: DonViTinh[] = [];
    donGia: string = "0";

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    constructor(private alertService: AlertService, private gvService: BangGiaDichVuCoBanService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getBangGiaDichVuCoBanByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: BangGiaDichVuCoBan) {
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
        this.BangGiaDichVuCoBanEdit = new BangGiaDichVuCoBan();
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
        if (this.donGia == "0" || this.donGia == "") {
            this.showErrorAlert("Lỗi nhập liệu", "Vui lòng nhập đơn giá > 0!");
            return false;
        } else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            if (this.isNew) {
                this.BangGiaDichVuCoBanEdit.toaNhaId = this.toaNhaId;
                this.BangGiaDichVuCoBanEdit.donGia = Number(this.donGia.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
                this.gvService.addnewBangGiaDichVuCoBan(this.BangGiaDichVuCoBanEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateBangGiaDichVuCoBan(this.BangGiaDichVuCoBanEdit.bangGiaDichVuCoBanId, this.BangGiaDichVuCoBanEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }

    newBangGiaDichVuCoBan() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.BangGiaDichVuCoBanEdit = new BangGiaDichVuCoBan();
        this.BangGiaDichVuCoBanEdit.loaiDichVuId = this.loaidichvus.length > 0 ? this.loaidichvus[0].loaiDichVuId : null;
        this.BangGiaDichVuCoBanEdit.loaiTienId = this.loaitiens.length > 0 ? this.loaitiens[0].loaiTienId : null;
        this.BangGiaDichVuCoBanEdit.donViTinhId = this.donvitinhs.length > 0 ? this.donvitinhs[0].donViTinhId : null;
        this.donGia == "1000";
        this.edit();
        return this.BangGiaDichVuCoBanEdit;
    }

    private saveSuccessHelper(obj?: BangGiaDichVuCoBan) {
        if (obj)
            Object.assign(this.BangGiaDichVuCoBanEdit, obj);

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
        this.BangGiaDichVuCoBanEdit = new BangGiaDichVuCoBan();
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

    editBangGiaDichVuCoBan(obj: BangGiaDichVuCoBan) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.dienGiai;
            this.BangGiaDichVuCoBanEdit = new BangGiaDichVuCoBan();
            Object.assign(this.BangGiaDichVuCoBanEdit, obj);
            this.donGia = this.formatPrice(this.BangGiaDichVuCoBanEdit.donGia.toString());
            this.edit();

            return this.BangGiaDichVuCoBanEdit;
        }
        else {
            return this.newBangGiaDichVuCoBan();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.BangGiaDichVuCoBanEdit) {
            this.BangGiaDichVuCoBanEdit = new BangGiaDichVuCoBan();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.BangGiaDichVuCoBanEdit = new BangGiaDichVuCoBan();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    donGiaChange(price: string) {
        if (price) {
            var pS = price.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            var pN = Number(pS);
            this.donGia = Utilities.formatNumber(pN);
        }
    }

    formatPrice(price: string): string {
        if (price) {
            var pS = price.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            var pN = Number(pS);
            var fm = Utilities.formatNumber(pN);
            return fm;
        } else return "";
    }
}