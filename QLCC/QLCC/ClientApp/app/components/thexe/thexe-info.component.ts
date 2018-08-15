import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { TheXe } from "../../models/thexe.model";
import { TheXeService } from "./../../services/thexe.service";
import { TangLau } from '../../models/tanglau.model';
import { MatBang } from '../../models/matbang.model';
import { LoaiXe } from '../../models/loaixe.model';
import { BangGiaXeService } from "./../../services/banggiaxe.service";
import { BangGiaXe } from '../../models/banggiaxe.model';

@Component({
    selector: "thexe-info",
    templateUrl: "./thexe-info.component.html",
    styleUrls: ["./thexe-info.component.css"]
})

export class TheXeInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private TheXeEdit: TheXe = new TheXe();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    tanglaus: TangLau[] = [];
    matbangs: MatBang[] = [];
    matbangsCache: MatBang[] = [];
    objMatBang: MatBang = new MatBang();
    loaixes: LoaiXe[] = [];
    loaiXeId: number = 0;
    tangLauId: number = 0;
    phiGuiXe: string = "0";
    toaNhaId: number;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    constructor(private alertService: AlertService, private gvService: TheXeService, private banggiaxeService: BangGiaXeService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getTheXeByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: TheXe) {
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
        this.TheXeEdit = new TheXe();
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
        if (this.objMatBang.matBangId == null) {
            this.showErrorAlert('Mặt bằng không được để trống', 'Vui lòng chọn mặt bằng!');
            return false;
        }
        else if (this.TheXeEdit.loaiXeId == 0) {
            this.showErrorAlert('Loại xe không được để trống', 'Vui lòng chọn loại xe!');
            return false;
        }
        else if (this.phiGuiXe == "0") {
            this.showErrorAlert("Phí gửi xe không được để trống", "Vui lòng nhập phí gửi xe có giá trị > 0!");
            return false;
        }
        else if (this.TheXeEdit.ngayThanhToan <= 0 || this.TheXeEdit.ngayThanhToan > 10)
        {
            this.showErrorAlert("Lỗi nhập liệu", "Vui lòng nhập hạn chót thanh toán hàng tháng trong khoảng 1 - 10!");
            return false;
        }
        else if (this.TheXeEdit.kyThanhToan <= 0 || this.TheXeEdit.kyThanhToan > 12)
        {
            this.showErrorAlert("Lỗi nhập liệu", "Vui lòng nhập kỳ thanh toán trong khoảng 1 - 12!");
            return false;
        }
        else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            this.TheXeEdit.matBangId = this.objMatBang.matBangId;
            this.TheXeEdit.khachHangId = this.objMatBang.khachHangId;            
            this.TheXeEdit.phiGuiXe = Number(this.phiGuiXe.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            if (this.isNew) {
                this.TheXeEdit.trangThai = 1;
                this.gvService.addnewTheXe(this.TheXeEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateTheXe(this.TheXeEdit.theXeId, this.TheXeEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }

    newTheXe() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.TheXeEdit = new TheXe();
        this.TheXeEdit.loaiXeId = 0;
        this.tangLauId = 0;
        this.objMatBang = new MatBang();
        this.phiGuiXe = "0";
        this.TheXeEdit.ngayThanhToan = 10;
        this.TheXeEdit.kyThanhToan = 1;
        this.edit();
        return this.TheXeEdit;
    }

    private saveSuccessHelper(obj?: TheXe) {
        if (obj)
            Object.assign(this.TheXeEdit, obj);

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
        this.TheXeEdit = new TheXe();
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

    editTheXe(obj: TheXe) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.maTheXe;
            this.TheXeEdit = new TheXe();
            Object.assign(this.TheXeEdit, obj);
            var mb = this.matbangsCache.find(o => o.matBangId == obj.matBangId);
            this.tangLauId = mb.tangLauId;
            this.matbangs = this.matbangsCache.filter(o => o.tangLauId == this.tangLauId);
            this.objMatBang = mb;
            this.phiGuiXe = Utilities.formatPrice(this.TheXeEdit.phiGuiXe.toString());
            this.edit();

            return this.TheXeEdit;
        }
        else {
            return this.newTheXe();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.TheXeEdit) {
            this.TheXeEdit = new TheXe();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.TheXeEdit = new TheXe();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    mbChange(value) {
        if (value != null) {
            this.objMatBang = value;
        }
    }

    SelectedTangLauValue(tanglau: number) {
        if (tanglau > 0) {
            this.matbangs = this.matbangsCache.filter(r => r.tangLauId == tanglau);
        } else this.matbangs = this.matbangsCache;
    }

    SelectedLoaiXe(loaixeId: number) {
        var banggia = new BangGiaXe();
        this.banggiaxeService.getItems(0, 1, "ToaNhaId = " + this.toaNhaId + " AND LoaiXeId = " + loaixeId, "x").subscribe(results => {
            if (results.length > 0) {
                banggia = results[0];
                this.phiGuiXe = Utilities.formatPrice(banggia.giaThang.toString());
            }            
        }, error => { });
    }

    phiGuiXeChange(price: string) {
        if (price) {
            var pS = price.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            var pN = Number(pS);
            this.phiGuiXe = Utilities.formatNumber(pN);
        }
    }
}