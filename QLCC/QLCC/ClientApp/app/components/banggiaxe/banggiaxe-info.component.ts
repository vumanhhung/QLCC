import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { BangGiaXe } from "../../models/banggiaxe.model";
import { BangGiaXeService } from "./../../services/banggiaxe.service";
import { LoaiXe } from '../../models/loaixe.model';

@Component({
    selector: "banggiaxe-info",
    templateUrl: "./banggiaxe-info.component.html",
    styleUrls: ["./banggiaxe-info.component.css"]
})

export class BangGiaXeInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private BangGiaXeEdit: BangGiaXe = new BangGiaXe();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    giaThang: string = "0";
    giaNgay: string = "0";
    toaNhaId: number = 0;
    loaixes: LoaiXe[] = [];
    chkLoaiXe: boolean;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    constructor(private alertService: AlertService, private gvService: BangGiaXeService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getBangGiaXeByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: BangGiaXe) {
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
        this.BangGiaXeEdit = new BangGiaXe();
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
        if (this.giaNgay == "0" || this.giaThang == "0") {
            this.showErrorAlert("Lỗi nhập liệu", "Vui lòng nhập giá ngày và giá tháng > 0!");
            return false;
        } else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");

            this.BangGiaXeEdit.giaThang = Number(this.giaThang.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            this.BangGiaXeEdit.giaNgay = Number(this.giaNgay.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));

            if (this.isNew) {
                this.BangGiaXeEdit.toaNhaId = this.toaNhaId;
                this.gvService.addnewBangGiaXe(this.BangGiaXeEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateBangGiaXe(this.BangGiaXeEdit.bangGiaXeId, this.BangGiaXeEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }

    newBangGiaXe() {
        this.chkLoaiXe = false;
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.BangGiaXeEdit = new BangGiaXe();
        this.BangGiaXeEdit.loaiXeId = 0;
        this.giaThang = this.formatPrice("100000");
        this.giaNgay = this.formatPrice("10000");
        this.edit();
        return this.BangGiaXeEdit;
    }

    private saveSuccessHelper(obj?: BangGiaXe) {
        if (obj)
            Object.assign(this.BangGiaXeEdit, obj);

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
        this.BangGiaXeEdit = new BangGiaXe();
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

    editBangGiaXe(obj: BangGiaXe) {
        if (obj) {
            this.chkLoaiXe = true;
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.dienGiai;
            this.BangGiaXeEdit = new BangGiaXe();
            Object.assign(this.BangGiaXeEdit, obj);
            this.giaThang = this.formatPrice(this.BangGiaXeEdit.giaThang.toString());
            this.giaNgay = this.formatPrice(this.BangGiaXeEdit.giaNgay.toString());
            this.edit();

            return this.BangGiaXeEdit;
        }
        else {
            return this.newBangGiaXe();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.BangGiaXeEdit) {
            this.BangGiaXeEdit = new BangGiaXe();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.BangGiaXeEdit = new BangGiaXe();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    giaThangChange(price: string) {
        if (price) {
            var pS = price.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            var pN = Number(pS);
            this.giaThang = Utilities.formatNumber(pN);
        }
    }

    giaNgayChange(price: string) {
        if (price) {
            var pS = price.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            var pN = Number(pS);
            this.giaNgay = Utilities.formatNumber(pN);
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

    loaiXeIdChange(loaiXeId: number) {
        if (loaiXeId > 0) {
            this.chkLoaiXe = true;
        } else {
            this.chkLoaiXe = false;
        }
    }
}