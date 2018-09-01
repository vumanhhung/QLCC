﻿import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { VatTu } from "../../models/vattu.model";
import { VatTuService } from "./../../services/vattu.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoaiTien } from '../../models/loaitien.model';
import { QuocTich } from '../../models/quoctich.model';
import { LoaiHang } from '../../models/loaihang.model';
import { HangSanXuat } from '../../models/hangsanxuat.model';
import { NhaCungCap } from '../../models/nhacungcap.model';
import { DonViTinh } from '../../models/donvitinh.model';
import { PhongBan } from '../../models/phongban.model';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { LoaiTienService } from '../../services/loaitien.service';
import { VatTuHinhAnhComponent } from '../vattuhinhanh/vattuhinhanh.component';
import { VatTuHinhAnhInfoComponent } from '../vattuhinhanh/vattuhinhanh-info.component';
import { UploadEvent, SelectEvent, FileInfo } from '@progress/kendo-angular-upload';
import { VatTuHinhAnh } from '../../models/vattuhinhanh.model';
import { VatTuHinhAnhService } from '../../services/vattuhinhanh.service';
import { VatTuTaiLieuService } from '../../services/vattutailieu.service';

@Component({
    selector: "vattu-info",
    templateUrl: "./vattu-info.component.html",
    styleUrls: ["./vattu-info.component.css"]
})

export class VatTuInfoComponent implements OnInit {
    private isNew = false;
    isEdit = false;
    isViewDetails = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private VatTuEdit: VatTu = new VatTu();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    public ChkquocTich: boolean;
    public ChkloaiHang: boolean;
    public ChkhangSX: boolean;
    public ChknhaCC: boolean;
    public ChkdonViTinh: boolean;
    public ChkloaiTien: boolean;
    public ChkphongBan: boolean;
    public ChkNDTN: boolean;
    public ChkDVKH: boolean;
    public checkTen: boolean;

    quoctichs: QuocTich[] = [];
    loaihangs: LoaiHang[] = [];
    hangSX: HangSanXuat[] = [];
    nhaCC: NhaCungCap[] = [];
    donvitinhs: DonViTinh[] = [];
    phongbans: PhongBan[] = [];
    loaitiens: LoaiTien[] = [];
    NDTN: NguoiDungToaNha[] = [];
    vattuCha: VatTu[] = [];
    vattuhinhanhEdit: VatTuHinhAnh;
    sourcevattuhinhanh: VatTuHinhAnh;

    valueNgayLap: Date = new Date();
    valueBaoHanh: Date = new Date();

    giaVattu: string = "0";
    last: string = "";

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('vattuhinhanhEditor')
    VatTuHinhAnhEditor: VatTuHinhAnhInfoComponent;

    constructor(private alertService: AlertService, private gvService: VatTuService,
        private loaitienService: LoaiTienService,
        private vattuhinhanhService: VatTuHinhAnhService,
        private vattutailieuService: VatTuTaiLieuService
    ) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getAllVatTu().subscribe(results => this.vattuCha = results);
        this.gvService.getVatTuByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: VatTu) {
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
        this.VatTuEdit = new VatTu();
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
        if (this.ChkdonViTinh == false || this.ChkDVKH == false || this.ChkhangSX == false || this.ChkloaiHang == false || this.ChkloaiTien == false || this.ChkNDTN == false || this.ChknhaCC == false || this.ChkphongBan == false || this.ChkquocTich == false) {
            this.isSaving = false;
        } else {
            this.valueBaoHanh = new Date(this.valueNgayLap.getFullYear() + this.VatTuEdit.namSD, this.valueBaoHanh.getMonth(), this.valueBaoHanh.getDate());
            this.VatTuEdit.ngayLap = this.valueNgayLap;
            this.VatTuEdit.ngayHHBaoHanh = this.valueBaoHanh;
            this.VatTuEdit.giaVatTu = Number(this.giaVattu.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            if (this.isNew) {
                this.gvService.addnewVatTu(this.VatTuEdit).subscribe(results => {
                    if (results.tenVatTu == "Exist") {
                        this.showErrorAlert("Lỗi nhập liệu", "Tên vật tư " + this.VatTuEdit.tenVatTu + " đã tồn tại trên hệ thống, vui lòng chọn tên khác");
                        this.alertService.stopLoadingMessage();
                        this.isSaving = false;
                        this.checkTen = false;
                    } else {
                        this.saveSuccessHelper(results);
                    }
                }, error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateVatTu(this.VatTuEdit.vatTuId, this.VatTuEdit).subscribe(response => {
                    if (response == "Exist") {
                        this.showErrorAlert("Lỗi nhập liệu", "Tên vật tư " + this.VatTuEdit.tenVatTu + " đã tồn tại trên hệ thống, vui lòng chọn tên khác");
                        this.alertService.stopLoadingMessage();
                        this.isSaving = false;
                        this.checkTen = false;
                    } else {
                        this.saveSuccessHelper();
                    }
                }, error => this.saveFailedHelper(error));
            }
        }
    }

    newVatTu() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.ChkphongBan = false;
        this.ChkdonViTinh = false;
        this.ChkDVKH = false;
        this.ChkhangSX = false;
        this.ChkloaiHang = false;
        this.ChkloaiTien = false;
        this.ChkNDTN = false;
        this.ChknhaCC = false;
        this.ChkquocTich = false;
        this.VatTuEdit = new VatTu();
        this.VatTuEdit.quocTichId = 0;
        this.VatTuEdit.loaiHangId = 0;
        this.VatTuEdit.hangSanXuatId = 0;
        this.VatTuEdit.nhaCungCapId = 0;
        this.VatTuEdit.donViTinhId = 0;
        this.VatTuEdit.phongBanId = 0;
        this.VatTuEdit.loaiTienId = 0;
        this.VatTuEdit.maVatTuCha = 0;
        this.VatTuEdit.donViKhauHao = "0";
        this.VatTuEdit.nguoiQuanLy = "0";
        this.VatTuEdit.namSD = 1;
        this.VatTuEdit.maVatTuCha = 0;
        this.gvService.getLastRecord().subscribe(results => {
            if (results == null) {
                var numberLast = 1;
            } else {
                var numberLast = results.vatTuId + 1;
            }            
            var number = 10 - numberLast.toString().length;
            for (var i = 0; i < number; i++) {
                this.last += "0";
            }
            this.VatTuEdit.maVatTu = "VT-" + this.last + numberLast;
        });
        this.giaVattu = this.formatPrice("0");
        this.valueBaoHanh = new Date(this.valueNgayLap.getFullYear() + this.VatTuEdit.namSD, this.valueBaoHanh.getMonth(), this.valueBaoHanh.getDate());
        this.VatTuEdit.khauHao = 0;
        this.VatTuEdit.trangThai = 1;
        this.edit();
        return this.VatTuEdit;
    }

    private saveSuccessHelper(obj?: VatTu) {
        if (obj)
            Object.assign(this.VatTuEdit, obj);
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
        this.addVatTuHinhAnh(obj);
        this.VatTuEdit = new VatTu();
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

    editVatTu(obj: VatTu) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.isEdit = true;
            this.isViewDetails = false;
            this.ChkphongBan = true;
            this.ChkdonViTinh = true;
            this.ChkDVKH = true;
            this.ChkhangSX = true;
            this.ChkloaiHang = true;
            this.ChkloaiTien = true;
            this.ChkNDTN = true;
            this.ChknhaCC = true;
            this.ChkquocTich = true;
            this.editingRowName = obj.tenVatTu;
            this.giaVattu = this.formatPrice(obj.giaVatTu.toString());
            this.VatTuEdit = new VatTu();
            Object.assign(this.VatTuEdit, obj);
            Object.assign(this.VatTuEdit, obj);
            this.edit();
            return this.VatTuEdit;
        }
        else {
            return this.newVatTu();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.VatTuEdit) {
            this.VatTuEdit = new VatTu();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.VatTuEdit = new VatTu();
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

    closeModal() {
        this.editorModal.hide();
    }

    namChange(nam: number) {
        this.valueBaoHanh = new Date(this.valueNgayLap.getFullYear() + nam, this.valueBaoHanh.getMonth(), this.valueBaoHanh.getDate());
    }

    giaVatTuChange(price: string) {
        if (price) {
            var pS = price.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            var pN = Number(pS);
            this.giaVattu = Utilities.formatNumber(pN);
        }
    }

    tenChk(value: string) {
        if (value != "") {
            this.checkTen = true;
        } else
            this.checkTen = false;
    }

    phongbanChk(id: number) {
        if (id > 0) {
            this.ChkphongBan = true;
        } else
            this.ChkphongBan = false;
    }

    loaiHangChk(id: number) {
        if (id > 0) {
            this.ChkloaiHang = true;
        } else
            this.ChkloaiHang = false;
    }

    quocTichChk(id: number) {
        if (id > 0) {
            this.ChkquocTich = true;
        } else
            this.ChkquocTich = false;
    }

    donViTinhChk(id: number) {
        if (id > 0) {
            this.ChkdonViTinh = true;
        } else
            this.ChkdonViTinh = false;
    }

    loaitienChk(id: number) {
        if (id > 0) {
            this.ChkloaiTien = true;
        } else {
            this.ChkloaiTien = false;
        }            
    }

    nhaCungCapChk(id: number) {
        if (id > 0) {
            this.ChknhaCC = true;
        } else
            this.ChknhaCC = false;
    }

    hangSanXuatChk(id: number) {
        if (id > 0) {
            this.ChkhangSX = true;
        } else
            this.ChkhangSX = false;
    }

    NDTNChk(value: string) {
        if (value != "0") {
            this.ChkNDTN = true;
        } else
            this.ChkNDTN = false;
    }

    DVKHChk(value: string) {
        if (value != "0") {
            this.ChkDVKH = true;
        } else
            this.ChkDVKH = false;
    }

    formatPrice(price: string) {
        if (price) {
            var pN = Number(price);
            var fm = Utilities.formatNumber(pN);
            return fm;
        } 
    }

    private movetoEditForm() {
        this.isViewDetails = false;
        this.isEdit = true;
    }

    addVatTuHinhAnh(row: VatTu) {
        this.editingRowName = null;
        this.sourcevattuhinhanh = null;
        this.VatTuHinhAnhEditor.VatTuHinhAnhEdit.vatTuId = row.vatTuId;
        this.vattuhinhanhEdit = this.VatTuHinhAnhEditor.loadVatTu(row);
        this.VatTuHinhAnhEditor.editorModal.show();
    }
}