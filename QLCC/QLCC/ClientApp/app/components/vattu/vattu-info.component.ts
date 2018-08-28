import { Component, OnInit, ViewChild, Input } from '@angular/core';

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

@Component({
    selector: "vattu-info",
    templateUrl: "./vattu-info.component.html",
    styleUrls: ["./vattu-info.component.css"]
})

export class VatTuInfoComponent implements OnInit {
    private isNew = false;
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

    quoctichs: QuocTich[] = [];
    loaihangs: LoaiHang[] = [];
    hangSX: HangSanXuat[] = [];
    nhaCC: NhaCungCap[] = [];
    donvitinhs: DonViTinh[] = [];
    phongbans: PhongBan[] = [];
    loaitiens: LoaiTien[] = [];
    NDTN: NguoiDungToaNha[] = [];

    ChkquocTich: boolean;
    ChkloaiHang: boolean;
    ChkhangSX: boolean;
    ChknhaCC: boolean;
    ChkdonViTinh: boolean;
    ChkloaiTien: boolean;
    ChkphongBan: boolean;
    ChkNDTN: boolean;
    ChkDVKH: boolean;
    ChkVTCha: boolean;
    checkTen: boolean;

    valueNgayLap: Date = new Date();
    valueBaoHanh: Date = new Date();

    kyHieu: string = "VND";
    
    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    @ViewChild('editorModal')
    editorModal: ModalDirective;
    
    constructor(private alertService: AlertService, private gvService: VatTuService) {
    }
    
    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
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
        this.isSaving = true;
        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");        
        if (this.isNew) {
            this.gvService.addnewVatTu(this.VatTuEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateVatTu(this.VatTuEdit.vatTuId, this.VatTuEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }
    
    newVatTu() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
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
        this.VatTuEdit.namSD = 0;
        this.VatTuEdit.khauHao = 0;
        this.VatTuEdit.giaVatTu = 0;
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
            this.editingRowName = obj.tenVatTu;
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

    quoctichChk(id: number) {
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

    loaiTienChk(id: number) {
        if (id > 0) {
            this.ChkloaiTien = true;
        } else
            this.ChkloaiTien = false;
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

    VTChaChk(id: number) {
        if (id > 0) {
            this.ChkVTCha = true;
        } else
            this.ChkVTCha = false;
    }
}