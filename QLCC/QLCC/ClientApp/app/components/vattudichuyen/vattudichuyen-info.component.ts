import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { VatTuDiChuyen } from "../../models/vattudichuyen.model";
import { VatTuDiChuyenService } from "./../../services/vattudichuyen.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { VatTuPhieuDiChuyen } from '../../models/vattuphieudichuyen.model';
import { VatTuPhieuDiChuyenService } from '../../services/vattuphieudichuyen.service';
import { VatTuPhieuYeuCau } from '../../models/vattuphieuyeucau.model';
import { VatTuPhieuYeuCauService } from '../../services/vattuphieuyeucau.service';
import { PhongBan } from '../../models/phongban.model';
import { VatTuYeuCauService } from '../../services/vattuyeucau.service';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { VatTuYeuCau } from '../../models/vattuyeucau.model';
import { VatTu } from '../../models/vattu.model';
import { VatTuService } from '../../services/vattu.service';
import { AuthService } from '../../services/auth.service';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';
import { PhongBanService } from '../../services/phongban.service';

@Component({
    selector: "vattudichuyen-info",
    templateUrl: "./vattudichuyen-info.component.html",
    styleUrls: ["./vattudichuyen-info.component.css"]
})

export class VatTuDiChuyenInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    isEdit = false;
    isViewDetails = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private VatTuDiChuyenEdit: VatTuDiChuyen = new VatTuDiChuyen();
    private VatTuPhieuDiChuyenEdit: VatTuPhieuDiChuyen = new VatTuPhieuDiChuyen();
    public valueNgayYeuCau: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    dexuats: VatTuPhieuYeuCau[] = [];
    phongbans: PhongBan[] = [];
    NDTN: NguoiDungToaNha[] = [];
    listVT: VatTuYeuCau[] = [];
    listDC: VatTuDiChuyen[] = [];
    public vattusFilter: VatTu[] = [];
    public vattusAll: VatTu[] = [];
    vattuSelected: VatTu = new VatTu();
    objNDTN: NguoiDungToaNha = new NguoiDungToaNha();
    public listRemoved: VatTuYeuCau[] = [];
    NDTNs: NguoiDungToaNha[] = [];
    vattuChk = false;
    valueDVYC: string = "";
    valueDVQLTS: string = "";
    valueDVTN: string = "";

    CHKdonViQLTS: boolean = false;
    CHKdonViYC: boolean = false;
    CHKdonViNhan: boolean = false;
    dexuatCHK: boolean = false;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('myTable') table: any;

    constructor(private alertService: AlertService, private gvService: VatTuPhieuDiChuyenService, private authService: AuthService,
        private vattuyeucauservice: VatTuYeuCauService, private vattuphieuyeucauservice: VatTuPhieuYeuCauService, private NDTNService: NguoiDungToaNhaService,
        private vattuservice: VatTuService, private vattudichuyenservice: VatTuDiChuyenService, private phongbanservice: PhongBanService) {
    }

    ngOnInit() {
        if (this.authService.currentUser) {
            var userId = this.authService.currentUser.id;
            var where = "NguoiDungId = '" + userId + "'";
            this.NDTNService.getItems(0, 1, where, "x").subscribe(result => this.getNguoiDungToaNha(result), error => {
                this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng tòa nhà từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
        }
        this.loadAllDeXuat();
        this.loadVatTu();
        this.loadData();
    }

    getNguoiDungToaNha(list: NguoiDungToaNha[]) {
        if (list.length > 0) {
            this.objNDTN = list[0];
            this.loadAllPhongBan(this.objNDTN.toaNhaId, this.objNDTN.cumToaNhaId);
        }
    }

    loadAllPhongBan(toanha: number, cumtoanha: number) {
        this.phongbanservice.getPhongBanByToaNha(toanha, cumtoanha).subscribe(results => this.onDataLoadPhongBanSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadPhongBanSuccessful(obj: PhongBan[]) {
        this.phongbans = obj;
    }

    loadAllDeXuat() {
        this.vattuphieuyeucauservice.getAllVatTuPhieuYeuCau().subscribe(results => this.onDataLoadDeXuatSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadDeXuatSuccessful(obj: VatTuPhieuYeuCau[]) {
        this.dexuats = obj.filter(o => o.trangThai == 2);
    }

    loadAllNDTN() {
        this.NDTNService.getAllNguoiDungToaNha().subscribe(results => this.onDataLoadNDTNSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadNDTNSuccessful(obj: NguoiDungToaNha[]) {
        this.NDTNs = obj;
    }

    loadVatTu() {
        this.alertService.startLoadingMessage();
        this.vattuservice.getAllVatTu().subscribe(result => this.onDataLoadVatTuSuccessful(result), error => this.onDataLoadFailed(error));
    }

    private onDataLoadVatTuSuccessful(obj: VatTu[]) {
        this.alertService.stopLoadingMessage();
        this.vattusAll = obj;
        this.vattusFilter = obj.filter(o => o.maVatTuCha == 0);
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getVatTuPhieuDiChuyenByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: VatTuPhieuDiChuyen) {
        this.alertService.stopLoadingMessage();
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        //this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    private onCurrentUserDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    resetForm(replace = false) {
        if (!replace) {
            this.form.reset();
            this.listVT = [];
            this.listDC = [];
        }
        else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }

    private cancel() {
        this.VatTuDiChuyenEdit = new VatTuDiChuyen();
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        this.editorModal.hide();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    resetVatTu() {
        this.VatTuDiChuyenEdit.soLuong = 1;
        this.VatTuDiChuyenEdit.ghiChu = "";
    }

    addListVatTu(id: number, soluong: number, ghichu: string) {
        if (id > 0) {
            if (this.listVT.length > 0) {
                var valueVT = new VatTuYeuCau();
                valueVT.vatTuId = id;
                valueVT.soLuong = soluong;
                valueVT.ghiChu = ghichu;
                valueVT.vattus = this.vattusFilter.find(o => o.vatTuId == id);
                var checkExistVT = this.listVT.find(c => c.vattus.tenVatTu == valueVT.vattus.tenVatTu);
                if (checkExistVT == null) {
                    this.listVT.push(valueVT);
                    this.resetVatTu();
                } else {
                    this.alertService.showStickyMessage("Cảnh báo", "Vật tư " + checkExistVT.vattus.tenVatTu + " đã tồn tại trong danh sách được đề xuất. Vui lòng chọn vật tư khác", MessageSeverity.warn);
                }
            }
            if (this.listDC.length > 0) {
                var valueDC = new VatTuDiChuyen();
                valueDC.vatTuId = id;
                valueDC.soLuong = soluong;
                valueDC.ghiChu = ghichu;
                valueDC.vattus = this.vattusFilter.find(o => o.vatTuId == id);
                var checkExistDC = this.listDC.find(c => c.vattus.tenVatTu == valueDC.vattus.tenVatTu);
                if (checkExistDC == null) {
                    this.listDC.push(valueDC);
                    this.resetVatTu();
                } else {
                    this.alertService.showStickyMessage("Cảnh báo", "Vật tư " + checkExistDC.vattus.tenVatTu + " đã tồn tại trong danh sách được đề xuất. Vui lòng chọn vật tư khác", MessageSeverity.warn);
                }
            }
            
        } else {
            this.alertService.showStickyMessage("Cảnh báo", "Vui lòng nhập vật tư cần đề xuất", MessageSeverity.warn);
            this.vattuChk = false;
        }
    }

    private save() {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
        if (this.listVT.length > 0 || this.listDC.length > 0) {
            if (this.isNew) {
                if (this.listVT.length > 0) {
                    this.VatTuPhieuDiChuyenEdit.trangThai = 1;
                    this.VatTuPhieuDiChuyenEdit.ngayYeuCau = this.valueNgayYeuCau;
                    this.gvService.addnewVatTuPhieuDiChuyen(this.VatTuPhieuDiChuyenEdit).subscribe(results => {
                        for (let item of this.listVT) {
                            this.VatTuDiChuyenEdit.phieuDiChuyenId = results.phieuDiChuyenId;
                            this.VatTuDiChuyenEdit.soLuong = item.soLuong;
                            this.VatTuDiChuyenEdit.donViTinhId = item.vattus.donViTinhId;
                            this.VatTuDiChuyenEdit.ghiChu = item.ghiChu;
                            this.VatTuDiChuyenEdit.quocTichId = item.vattus.quocTichId;
                            this.VatTuDiChuyenEdit.vatTuId = item.vatTuId;
                            this.vattudichuyenservice.addnewVatTuDiChuyen(this.VatTuDiChuyenEdit).subscribe(result => this.saveVTDCSuccessHelper(result), error => this.saveFailedHelper(error));
                        }
                        this.saveSuccessHelper(results)
                    }, error => this.saveFailedHelper(error));
                } else if (this.listDC.length > 0) {
                    this.VatTuPhieuDiChuyenEdit.trangThai = 1;
                    this.VatTuPhieuDiChuyenEdit.ngayYeuCau = this.valueNgayYeuCau;
                    this.gvService.addnewVatTuPhieuDiChuyen(this.VatTuPhieuDiChuyenEdit).subscribe(results => {
                        for (let item of this.listDC) {
                            this.VatTuDiChuyenEdit.phieuDiChuyenId = results.phieuDiChuyenId;
                            this.VatTuDiChuyenEdit.soLuong = item.soLuong;
                            this.VatTuDiChuyenEdit.donViTinhId = item.vattus.donViTinhId;
                            this.VatTuDiChuyenEdit.ghiChu = item.ghiChu;
                            this.VatTuDiChuyenEdit.quocTichId = item.vattus.quocTichId;
                            this.VatTuDiChuyenEdit.vatTuId = item.vatTuId;
                            this.vattudichuyenservice.addnewVatTuDiChuyen(this.VatTuDiChuyenEdit).subscribe(result => this.saveVTDCSuccessHelper(result), error => this.saveFailedHelper(error));
                        }
                        this.saveSuccessHelper(results)
                    }, error => this.saveFailedHelper(error));
                }
            } else {
                this.VatTuPhieuDiChuyenEdit.trangThai = 1;
                this.VatTuPhieuDiChuyenEdit.ngayYeuCau = this.valueNgayYeuCau;
                this.gvService.updateVatTuPhieuDiChuyen(this.VatTuPhieuDiChuyenEdit.phieuDiChuyenId, this.VatTuPhieuDiChuyenEdit).subscribe(response => {
                    this.vattudichuyenservice.getByPhieuDiChuyen(this.VatTuPhieuDiChuyenEdit.phieuDiChuyenId).subscribe(results => {
                        this.VatTuDiChuyenEdit.phieuDiChuyenId = this.VatTuPhieuDiChuyenEdit.phieuDiChuyenId;
                        if (this.listDC.length == results.length) {
                            for (let item of this.listDC) {
                                this.VatTuDiChuyenEdit.phieuDiChuyenId = this.VatTuPhieuDiChuyenEdit.phieuDiChuyenId;
                                this.VatTuDiChuyenEdit.soLuong = item.soLuong;
                                this.VatTuDiChuyenEdit.donViTinhId = item.vattus.donViTinhId;
                                this.VatTuDiChuyenEdit.ghiChu = item.ghiChu;
                                this.VatTuDiChuyenEdit.quocTichId = item.vattus.quocTichId;
                                this.VatTuDiChuyenEdit.vatTuId = item.vatTuId;
                                this.vattudichuyenservice.updateVatTuDiChuyen(this.VatTuDiChuyenEdit.phieuDiChuyenId, this.VatTuDiChuyenEdit).subscribe(response => this.saveVTDCSuccessHelper(), error => this.saveFailedHelper(error));
                            }
                        } else if (this.listDC.length > results.length) {
                            for (var i = 0; i < this.listDC.length; i++) {
                                if (i - results.length >= 0) {
                                    this.VatTuDiChuyenEdit.phieuDiChuyenId = this.VatTuPhieuDiChuyenEdit.phieuDiChuyenId;
                                    this.VatTuDiChuyenEdit.soLuong = this.listDC[i].soLuong;
                                    this.VatTuDiChuyenEdit.donViTinhId = this.listDC[i].vattus.donViTinhId;
                                    this.VatTuDiChuyenEdit.ghiChu = this.listDC[i].ghiChu;
                                    this.VatTuDiChuyenEdit.quocTichId = this.listDC[i].vattus.quocTichId;
                                    this.VatTuDiChuyenEdit.vatTuId = this.listDC[i].vatTuId;
                                    this.vattudichuyenservice.addnewVatTuDiChuyen(this.VatTuDiChuyenEdit).subscribe(result => this.saveVTDCSuccessHelper(result), error => this.saveFailedHelper(error));
                                } else {
                                    this.VatTuDiChuyenEdit.phieuDiChuyenId = this.VatTuPhieuDiChuyenEdit.phieuDiChuyenId;
                                    this.VatTuDiChuyenEdit.soLuong = this.listDC[i].soLuong;
                                    this.VatTuDiChuyenEdit.donViTinhId = this.listDC[i].vattus.donViTinhId;
                                    this.VatTuDiChuyenEdit.ghiChu = this.listDC[i].ghiChu;
                                    this.VatTuDiChuyenEdit.quocTichId = this.listDC[i].vattus.quocTichId;
                                    this.VatTuDiChuyenEdit.vatTuId = this.listDC[i].vatTuId;
                                    this.vattudichuyenservice.updateVatTuDiChuyen(this.VatTuDiChuyenEdit.phieuDiChuyenId, this.VatTuDiChuyenEdit).subscribe(response => this.saveVTDCSuccessHelper(), error => this.saveFailedHelper(error));
                                }
                            }
                        } else {
                            for (var itemRemove of this.listRemoved) {
                                this.VatTuDiChuyenEdit.phieuDiChuyenId = this.VatTuPhieuDiChuyenEdit.phieuDiChuyenId;
                                this.VatTuDiChuyenEdit.soLuong = itemRemove.soLuong;
                                this.VatTuDiChuyenEdit.donViTinhId = itemRemove.vattus.donViTinhId;
                                this.VatTuDiChuyenEdit.ghiChu = itemRemove.ghiChu;
                                this.VatTuDiChuyenEdit.quocTichId = itemRemove.vattus.quocTichId;
                                this.VatTuDiChuyenEdit.vatTuId = itemRemove.vatTuId;
                                this.vattudichuyenservice.deleteVatTuDiChuyen(this.VatTuDiChuyenEdit.vatTuDiChuyenId).subscribe(results => { alert("Success") }, error => { alert("Fail"); })
                            }
                            for (var item of this.listVT) {
                                this.VatTuDiChuyenEdit.phieuDiChuyenId = this.VatTuPhieuDiChuyenEdit.phieuDiChuyenId;
                                this.VatTuDiChuyenEdit.soLuong = item.soLuong;
                                this.VatTuDiChuyenEdit.donViTinhId = item.vattus.donViTinhId;
                                this.VatTuDiChuyenEdit.ghiChu = item.ghiChu;
                                this.VatTuDiChuyenEdit.quocTichId = item.vattus.quocTichId;
                                this.VatTuDiChuyenEdit.vatTuId = item.vatTuId;
                                this.vattudichuyenservice.updateVatTuDiChuyen(this.VatTuDiChuyenEdit.vatTuDiChuyenId, this.VatTuDiChuyenEdit).subscribe(response => this.saveVTDCSuccessHelper(), error => this.saveFailedHelper(error));
                            }
                        }
                    })
                    this.saveSuccessHelper()
                }, error => this.saveFailedHelper(error));
            }
        } else {
            this.alertService.showStickyMessage("Lỗi nhập liệu", "Vui lòng nhập phiếu xuất kho", MessageSeverity.error);
            this.isSaving = false;
        }
    }

    newVatTuDiChuyen(valueYeuCau: number, valueVatTu: number) {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.CHKdonViQLTS = false;
        this.CHKdonViYC = false;
        this.CHKdonViNhan = false;
        this.dexuatCHK = false;
        this.VatTuDiChuyenEdit = new VatTuDiChuyen();
        this.VatTuPhieuDiChuyenEdit = new VatTuPhieuDiChuyen();
        if (valueYeuCau > 0 && valueVatTu == 0) {
            this.listVT = [];
            this.VatTuPhieuDiChuyenEdit.phieuYeuCauVTId = valueYeuCau;
            this.dexuatCHK = true;
            this.vattuphieuyeucauservice.getVatTuPhieuYeuCauByID(valueYeuCau).subscribe(results => {
                this.VatTuPhieuDiChuyenEdit.nguoiYeuCau = results.nguoiYeuCau;
                this.VatTuPhieuDiChuyenEdit.noiDung = results.mucDichSuDung;
                this.vattuyeucauservice.getByPhieuYeuCau(results.phieuYeuCauVTId).subscribe(result => {
                    this.listVT = result;
                })
            })
            this.listDC = [];
        } else if (valueYeuCau == 0 && valueVatTu > 0) {
            this.listVT = [];
            this.VatTuDiChuyenEdit.vatTuId = valueVatTu;
            this.VatTuDiChuyenEdit.soLuong = 1;
            this.VatTuDiChuyenEdit.vattus = this.vattusAll.find(o => o.vatTuId == valueVatTu);
            this.listDC.push(this.VatTuDiChuyenEdit);
            this.VatTuPhieuDiChuyenEdit.phieuYeuCauVTId = 0;
        } else {
            this.VatTuPhieuDiChuyenEdit.phieuYeuCauVTId = 0;
        }        
        this.VatTuPhieuDiChuyenEdit.donViNhan = 0;
        this.VatTuPhieuDiChuyenEdit.donViQLTS = 0;
        this.VatTuPhieuDiChuyenEdit.donViYeuCau = 0;
        this.VatTuDiChuyenEdit.soLuong = 1;
        this.edit();
        return this.VatTuDiChuyenEdit;
    }

    private saveSuccessHelper(obj?: VatTuPhieuDiChuyen) {
        if (obj)
            Object.assign(this.VatTuDiChuyenEdit, obj);

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
        this.VatTuDiChuyenEdit = new VatTuDiChuyen();
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    private saveVTDCSuccessHelper(obj?: VatTuDiChuyen) {
        if (obj)
            Object.assign(this.VatTuDiChuyenEdit, obj);

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
        this.VatTuDiChuyenEdit = new VatTuDiChuyen();
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

    editVatTuDiChuyen(obj: VatTuPhieuDiChuyen) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.CHKdonViQLTS = true;
            this.CHKdonViYC = true;
            this.CHKdonViNhan = true;
            this.dexuatCHK = true;
            this.valueDVYC = this.phongbans.find(o => o.phongBanId == obj.donViYeuCau).tenPhongBan;
            this.valueDVTN = this.phongbans.find(o => o.phongBanId == obj.donViNhan).tenPhongBan;
            this.valueDVQLTS = this.phongbans.find(o => o.phongBanId == obj.donViQLTS).tenPhongBan;
            this.VatTuDiChuyenEdit.soLuong = 1;
            if (obj.phieuYeuCauVTId > 0) {
                this.vattuyeucauservice.getByPhieuYeuCau(obj.phieuYeuCauVTId).subscribe(results => {
                    this.listVT = results;
                })
            } else {
                this.vattudichuyenservice.getByPhieuDiChuyen(obj.phieuDiChuyenId).subscribe(result => {
                    this.listDC = result;
                })
            }
            this.VatTuPhieuDiChuyenEdit = new VatTuPhieuDiChuyen();
            Object.assign(this.VatTuPhieuDiChuyenEdit, obj);
            Object.assign(this.VatTuPhieuDiChuyenEdit, obj);
            this.edit();

            return this.VatTuDiChuyenEdit;
        }
        else {
            return this.newVatTuDiChuyen(0,0);
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.VatTuDiChuyenEdit) {
            this.VatTuDiChuyenEdit = new VatTuDiChuyen();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.VatTuDiChuyenEdit = new VatTuDiChuyen();
        this.showValidationErrors = false;
        this.editorModal.hide();
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }

    soluongChange(value: number) {
        if (value < 1) {
            this.alertService.showStickyMessage("Lỗi nhập liệu", "Vui lòng nhập số lượng > 0", MessageSeverity.error);
        }
    }

    dexuatChange(value: number) {
        if (value > 0) {
            this.dexuatCHK = true;
            this.vattuphieuyeucauservice.getVatTuPhieuYeuCauByID(value).subscribe(results => {
                this.VatTuPhieuDiChuyenEdit.nguoiYeuCau = results.nguoiYeuCau;
                this.VatTuPhieuDiChuyenEdit.noiDung = results.mucDichSuDung;
                this.vattuyeucauservice.getByPhieuYeuCau(results.phieuYeuCauVTId).subscribe(result => {
                    this.listVT = result;
                })
            })
        } else {
            this.dexuatCHK = false;
            this.VatTuPhieuDiChuyenEdit = new VatTuPhieuDiChuyen();
            this.listVT = [];
        }
    }

    donViQLTSChk(value: number) {
        if (value > 0) {
            this.CHKdonViQLTS = true;
        } else {
            this.CHKdonViQLTS = false;
        }
    }

    donViYeuCauChk(value: number) {
        if (value > 0) {
            this.CHKdonViYC = true;
        } else {
            this.CHKdonViYC = false;
        }
    }

    donViNhanChk(value: number) {
        if (value > 0) {
            this.CHKdonViNhan = true;
        } else {
            this.CHKdonViNhan = false;
        }
    }

    vattuChange(vattu: VatTu) {
        if (vattu != null) {
            this.vattuChk = true;
        } else {
            this.vattuChk = false;
        }
    }

    deleteFromList(value: VatTuYeuCau) {
        if (this.isNew) {
            this.listVT.splice(this.listVT.indexOf(value), 1);
        } else {
            var removed = this.listVT.splice(this.listVT.indexOf(value), 1);
            this.listRemoved.push(removed[0]);
        }
    }

    closeModal() {
        this.editorModal.hide();
    }

    confirmXuatKho(row: VatTuPhieuDiChuyen) {
        row.trangThai = 2;
        this.gvService.updateVatTuPhieuDiChuyen(row.phieuDiChuyenId, row).subscribe(results => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
    }

    private movetoEditForm() {
        this.isViewDetails = false;
        this.isEdit = true;
    }
}