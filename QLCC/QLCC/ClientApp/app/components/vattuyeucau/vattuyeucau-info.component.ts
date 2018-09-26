import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { VatTuYeuCau } from "../../models/vattuyeucau.model";
import { VatTuYeuCauService } from "./../../services/vattuyeucau.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { VatTuPhieuYeuCau } from '../../models/vattuphieuyeucau.model';
import { VatTu } from '../../models/vattu.model';
import { VatTuService } from '../../services/vattu.service';
import { PhongBan } from '../../models/phongban.model';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { VatTuPhieuYeuCauService } from '../../services/vattuphieuyeucau.service';

@Component({
    selector: "vattuyeucau-info",
    templateUrl: "./vattuyeucau-info.component.html",
    styleUrls: ["./vattuyeucau-info.component.css"]
})

export class VatTuYeuCauInfoComponent implements OnInit {
    private isNew = false;
    public isEdit = false;
    public isViewDetail = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    public VatTuYeuCauEdit: VatTuYeuCau = new VatTuYeuCau();
    public VatTuPhieuYeuCauEdit: VatTuPhieuYeuCau = new VatTuPhieuYeuCau();
    public list: VatTuYeuCau[] = [];
    public listRemoved: VatTuYeuCau[] = [];
    public vattusFilter: VatTu[] = [];
    vattuSelected: VatTu = new VatTu();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    vattuChk = false;
    phongbanChk = false;
    nycCHk = false;
    ntnCHk = false;

    phongbans: PhongBan[] = [];
    NDTN: NguoiDungToaNha[] = [];
    
    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    constructor(private alertService: AlertService, private gvService: VatTuYeuCauService, private vtpycService: VatTuPhieuYeuCauService, private vattuService: VatTuService) {
    }
    
    ngOnInit() {
        this.loadVatTu();
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getVatTuYeuCauByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    
    private onDataLoadSuccessful(obj: VatTuYeuCau) {
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
    loadVatTu() {
        this.alertService.startLoadingMessage();
        this.vattuService.getAllVatTu().subscribe(result => this.onDataLoadVatTuSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadVatTuSuccessful(obj: VatTu[]) {
        this.alertService.stopLoadingMessage();
        this.vattusFilter = obj;
    }

    phongbanChange(id: number) {
        if (id > 0) {
            this.phongbanChk = true;
        } else {
            this.phongbanChk = false;
        }
    }

    vattuChange(vattu: VatTu) {
        if (vattu != null) {
            this.vattuChk = true;
        } else {
            this.vattuChk = false;
        }
    }

    soluongChange(value: number) {
        if (value < 1) {
            this.alertService.showStickyMessage("Lỗi nhập liệu", "Vui lòng nhập số lượng > 0", MessageSeverity.error);
        }
    }

    nycChange(value: string) {
        if (value != "") {
            this.nycCHk = true;
        } else {
            this.nycCHk = false;
        }
    }

    ntnChange(value: string) {
        if (value != "") {
            this.ntnCHk = true;
        } else {
            this.ntnCHk = false;
        }
    }

    addListVatTu(id: number, soluong: number, ghichu: string) {
        if (id > 0) {
            var value = new VatTuYeuCau();
            value.vatTuId = id;
            value.soLuong = soluong;
            value.ghiChu = ghichu;
            value.vattus = this.vattusFilter.find(o => o.vatTuId == id);
            var checkExist = this.list.find(c => c.vattus.tenVatTu == value.vattus.tenVatTu);
            if(checkExist == null){
                this.list.push(value);
            } else {
                this.alertService.showStickyMessage("Cảnh báo", "Vật tư " + checkExist.vattus.tenVatTu + " đã tồn tại trong danh sách được đề xuất. Vui lòng chọn vật tư khác", MessageSeverity.warn);
            }            
        } else {
            this.alertService.showStickyMessage("Cảnh báo", "Vui lòng nhập vật tư cần đề xuất", MessageSeverity.warn);
            this.vattuChk = false;
        }        
    }

    deleteFromList(value: VatTuYeuCau) {
        if (this.isNew) {
            this.list.splice(this.list.indexOf(value), 1);
        } else {
            var removed = this.list.splice(this.list.indexOf(value), 1);
            console.log(removed[0]);
            this.listRemoved.unshift(removed[0]);
        }        
    }
    
    private cancel() {
        this.VatTuYeuCauEdit = new VatTuYeuCau();
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
        if (this.list.length > 0) {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            this.VatTuPhieuYeuCauEdit.trangThai = 1;
            if (this.isNew) {
                this.vtpycService.addnewVatTuPhieuYeuCau(this.VatTuPhieuYeuCauEdit).subscribe(results => {
                    for (var item of this.list) {
                        this.VatTuYeuCauEdit.phieuYeuCauVTId = results.phieuYeuCauVTId;
                        this.VatTuYeuCauEdit.donViTinhId = item.vattus.donViTinhId;
                        this.VatTuYeuCauEdit.quocTichId = item.vattus.quocTichId;
                        this.VatTuYeuCauEdit.vatTuId = item.vatTuId;
                        this.gvService.addnewVatTuYeuCau(this.VatTuYeuCauEdit).subscribe(results => this.saveVTYCSuccessHelper(results), error => this.saveFailedHelper(error));
                    }                    
                    this.saveVTPYCSuccessHelper(results);
                }, error => this.saveFailedHelper(error));                
            }
            else {
                this.vtpycService.updateVatTuPhieuYeuCau(this.VatTuPhieuYeuCauEdit.phieuYeuCauVTId, this.VatTuPhieuYeuCauEdit).subscribe(response => {
                    this.gvService.getByPhieuYeuCau(this.VatTuPhieuYeuCauEdit.phieuYeuCauVTId).subscribe(results => {
                        if (this.list <= results) {
                            for (var item of this.list) {
                                this.gvService.updateVatTuYeuCau(item.yeuCauvatTuId, item).subscribe(response => this.saveVTYCSuccessHelper(), error => this.saveFailedHelper(error));
                            }
                        } else {
                            for (var i = 0; i < this.list.length; i++) {
                                if (i - results.length >= 0) {
                                    this.gvService.addnewVatTuYeuCau(this.list[i]).subscribe(result => this.saveVTYCSuccessHelper(result), error => this.saveFailedHelper(error));
                                } else {
                                    this.gvService.updateVatTuYeuCau(this.list[i].yeuCauvatTuId, this.list[i]).subscribe(response => this.saveVTYCSuccessHelper(), error => this.saveFailedHelper(error));
                                }
                            }
                        }
                    }, error => this.saveFailedHelper(error));
                }, error => this.saveFailedHelper(error));
                
            }
        } else {
            this.alertService.showStickyMessage("Lỗi nhập liệu", "Vui lòng nhập vật tư cần đề xuất", MessageSeverity.error);
            this.isSaving = false;
        }
        
    }
    
    newDeXuat() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.VatTuYeuCauEdit = new VatTuYeuCau();
        this.VatTuPhieuYeuCauEdit = new VatTuPhieuYeuCau();
        this.VatTuPhieuYeuCauEdit.phongBanId = 0;
        this.VatTuYeuCauEdit.donViTinhId = 0;
        this.VatTuYeuCauEdit.quocTichId = 0;
        this.VatTuYeuCauEdit.soLuong = 1;
        this.VatTuPhieuYeuCauEdit.nguoiYeuCau = "0";
        this.VatTuPhieuYeuCauEdit.nguoiTiepNhan = "0";
        this.list = [];
        this.edit();
        return this.VatTuYeuCauEdit;
    }

    private saveVTYCSuccessHelper(obj?: VatTuYeuCau) {
        if (obj)
            Object.assign(this.VatTuYeuCauEdit, obj);

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
        this.VatTuYeuCauEdit = new VatTuYeuCau();
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    private saveVTPYCSuccessHelper(obj?: VatTuPhieuYeuCau) {
        if (obj)
            Object.assign(this.VatTuPhieuYeuCauEdit, obj);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;
        this.VatTuYeuCauEdit = new VatTuYeuCau();
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

    editDeXuat(obj: VatTuPhieuYeuCau) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.isEdit = true;
            //this.editingRowName = obj.tenVatTuYeuCau;
            this.VatTuYeuCauEdit.soLuong = 1;
            this.gvService.getByPhieuYeuCau(obj.phieuYeuCauVTId).subscribe(results => this.list = results, error => { alert(error) });
            this.VatTuPhieuYeuCauEdit = new VatTuPhieuYeuCau();
            Object.assign(this.VatTuPhieuYeuCauEdit, obj);
            Object.assign(this.VatTuPhieuYeuCauEdit, obj);
            this.edit();

            return this.VatTuYeuCauEdit;
        }
        else {
            return this.newDeXuat();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.VatTuYeuCauEdit) {
            this.VatTuYeuCauEdit = new VatTuYeuCau();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.VatTuYeuCauEdit = new VatTuYeuCau();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm();
    }

    closeModal() {
        this.editorModal.hide();
    }

    private movetoEditForm() {
        this.isViewDetail = false;
        this.isEdit = true;
    }
}