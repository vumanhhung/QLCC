
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
import { LoaiTienService } from '../../services/loaitien.service';
import { VatTuHinhAnhComponent } from '../vattuhinhanh/vattuhinhanh.component';
import { VatTuHinhAnhInfoComponent } from '../vattuhinhanh/vattuhinhanh-info.component';
import { UploadEvent, SelectEvent, FileInfo, ClearEvent, RemoveEvent, FileRestrictions } from '@progress/kendo-angular-upload';
import { VatTuHinhAnh } from '../../models/vattuhinhanh.model';
import { VatTuHinhAnhService } from '../../services/vattuhinhanh.service';
import { VatTuTaiLieuService } from '../../services/vattutailieu.service';
import { VatTuTaiLieu } from '../../models/vattutailieu.model';
import { serializePath } from '@angular/router/src/url_tree';
import { window } from 'rxjs/operators';
import { FileUploadService } from '../../services/fileupload.service';

@Component({
    selector: "vattu-info",
    templateUrl: "./vattu-info.component.html",
    styleUrls: ["./vattu-info.component.css"]
})

export class VatTuInfoComponent implements OnInit {
    private isNew = false;
    isEdit = false;
    isViewDetails = false;

    public uploadSaveUrl = 'api/FileUploads/UploadFile'; // should represent an actual API endpoint
    public uploadRemoveUrl = 'api/FileUploads/RemoveFileByPath'; // should represent an actual API endpoint

    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private VatTuEdit: VatTu = new VatTu();
    private VatTuHinhAnhEdit: VatTuHinhAnh = new VatTuHinhAnh();
    private VatTuTaiLieuEdit: VatTuTaiLieu = new VatTuTaiLieu();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    public uploadImageRestrictions: FileRestrictions = {
        allowedExtensions: ['.jpg', '.png']
    };

    public uploadFileRestrictions: FileRestrictions = {
        allowedExtensions: ['.xlsx', '.docx', '.doc']
    };

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

    VTHAs: VatTuHinhAnh[] = [];
    quoctichs: QuocTich[] = [];
    loaihangs: LoaiHang[] = [];
    hangSX: HangSanXuat[] = [];
    nhaCC: NhaCungCap[] = [];
    donvitinhs: DonViTinh[] = [];
    phongbans: PhongBan[] = [];
    loaitiens: LoaiTien[] = [];
    NDTN: NguoiDungToaNha[] = [];
    vattuCha: VatTu[] = [];
    public imagePreviews: FileInfo[] = [];
    public filePreviews: FileInfo[] = [];

    valueNgayLap: Date = new Date();
    valueBaoHanh: Date = new Date();

    giaVattu: string = "0";
    last: string = "";
    public stringRandom: string;
    public urlSever: string = "";
    public urlFile: string = "";
    public urlFileList: string[] = [];

    step1: boolean = false;
    step2: boolean = false;
    step3: boolean = false;

    isUpload = false;
    isUploadFile = false;
    isdisplayImage = false;
    public imageData: string;
    static srcDataImg: any;
    public altImageItem: string;

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
        private vattutailieuService: VatTuTaiLieuService,
        private fileuploadService: FileUploadService
    ) {
    }

    ngOnInit() {
        this.step1 = true;
        this.step3 = false;
        this.step2 = false;
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getVatTuByID().subscribe(result => {
            this.vattuhinhanhService.getVatTuHinhAnhByID(result.vatTuId).subscribe(results => { console.log(results) }, error => { });
            this.onDataLoadSuccessful(result);
        }, error => this.onCurrentUserDataLoadFailed(error));
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

    backStep1() {
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
    }

    backStep2() {
        this.step1 = false;
        this.step2 = true;
        this.step3 = false;
    }

    private cancel1() {
        this.VatTuEdit = new VatTu();
        this.showValidationErrors = false;
        this.resetForm();
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    private cancel() {
        this.VatTuEdit = new VatTu();
        this.VatTuHinhAnhEdit = new VatTuHinhAnh();
        this.VatTuTaiLieuEdit = new VatTuTaiLieu();
        this.showValidationErrors = false;
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    private saveStep1() {
        if (this.ChkdonViTinh == false || this.ChkDVKH == false || this.ChkhangSX == false || this.ChkloaiHang == false || this.ChkloaiTien == false || this.ChkNDTN == false || this.ChknhaCC == false || this.ChkphongBan == false || this.ChkquocTich == false) {
            this.showErrorAlert("Lỗi nhập liệu", "Vui lòng nhập đầy đủ các trường được yêu cầu !");
            this.alertService.stopLoadingMessage();
            this.isSaving = false;
        } else {
            this.valueBaoHanh = new Date(this.valueNgayLap.getFullYear() + this.VatTuEdit.namSD, this.valueBaoHanh.getMonth(), this.valueBaoHanh.getDate());
            this.VatTuEdit.ngayLap = this.valueNgayLap;
            this.VatTuEdit.ngayHHBaoHanh = this.valueBaoHanh;
            this.VatTuEdit.giaVatTu = Number(this.giaVattu.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            //this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            if (this.isNew) {
                this.gvService.addnewVatTu(this.VatTuEdit).subscribe(results => {
                    if (results.tenVatTu == "Exist") {
                        this.showErrorAlert("Lỗi nhập liệu", "Tên vật tư " + this.VatTuEdit.tenVatTu + " đã tồn tại trên hệ thống, vui lòng chọn tên khác");
                        this.alertService.stopLoadingMessage();
                        //this.isSaving = false;
                        this.checkTen = false;
                    } else {
                        this.save1SuccessHelper(results);
                    }
                }, error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateVatTu(this.VatTuEdit.vatTuId, this.VatTuEdit).subscribe(response => {
                    if (response == "Exist") {
                        this.showErrorAlert("Lỗi nhập liệu", "Tên vật tư " + this.VatTuEdit.tenVatTu + " đã tồn tại trên hệ thống, vui lòng chọn tên khác");
                        this.alertService.stopLoadingMessage();
                        //this.isSaving = false;
                        this.checkTen = false;
                    } else {
                        this.save1SuccessHelper();
                    }
                }, error => this.saveFailedHelper(error));
            }
        }
    }

    private saveStep2() {
        if (this.imagePreviews.length == 0) {
            this.alertService.showStickyMessage("Lỗi nhập liệu", "Ảnh không được để trống - Vui lòng chọn ảnh để upload", MessageSeverity.error);
            this.isUpload = false;
            this.isSaving = false;
        } else {
            let k_img_name: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("k-upload-selected") as HTMLCollectionOf<HTMLElement>;
            if (k_img_name.length > 0) {
                k_img_name[0].click();
                this.isUpload = true;
            }
        }
    }

    private saveStep3() {
        if (this.imagePreviews.length == 0) {
            this.alertService.showStickyMessage("Lỗi nhập liệu", "Tài liệu không được để trống - Vui lòng chọn tài liệu để upload", MessageSeverity.error);
            this.isUploadFile = false;
            this.isSaving = false;
        } else {
            let k_file_name: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("k-upload-selected") as HTMLCollectionOf<HTMLElement>;
            if (k_file_name.length > 0) {
                k_file_name[0].click();
                this.isUploadFile = true;
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
        this.giaVattu = this.formatPrice("0");
        this.valueBaoHanh = new Date(this.valueNgayLap.getFullYear() + this.VatTuEdit.namSD, this.valueBaoHanh.getMonth(), this.valueBaoHanh.getDate());
        this.VatTuEdit.khauHao = 0;
        this.VatTuEdit.trangThai = 1;
        this.edit();
        return this.VatTuEdit;
    }

    newVatTuHinhAnh() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.isdisplayImage = false;
        this.VatTuHinhAnhEdit = new VatTuHinhAnh();
        this.edit();
        return this.VatTuHinhAnhEdit;
    }

    private save1SuccessHelper(obj?: VatTu) {
        this.alertService.stopLoadingMessage();
        if (this.isNew && this.VatTuEdit.vatTuId == null) {
            this.alertService.showMessage("Bước 1 thành công", `Thực hiện thêm mới vật tư thành công`, MessageSeverity.success);
            if (obj) {
                this.VatTuHinhAnhEdit.vatTuId = obj.vatTuId;
                this.VatTuTaiLieuEdit.vatTuId = obj.vatTuId;
            }
        }
        else
            this.alertService.showMessage("Bước 1 thành công", `Thực hiện thay đổi thông tin vật tư thành công`, MessageSeverity.success);
        this.step1 = false;
        this.step2 = true;
        this.step3 = false;
    }

    private save2SuccessHelper(obj?: VatTuHinhAnh) {
        this.alertService.stopLoadingMessage();
        this.step1 = false;
        this.step2 = false;
        this.step3 = true;
    }

    private save3SuccessHelper(obj?: VatTuTaiLieu) {
        this.alertService.stopLoadingMessage();
        if (this.isNew && this.VatTuTaiLieuEdit.vatTutaiLieuId == null) {
            this.alertService.showMessage("Bước 3 thành công", `Thực hiện thêm mới hình ảnh vật tư thành công`, MessageSeverity.success);
        }
        else
            this.alertService.showMessage("Bước 3 thành công", `Thực hiện thay đổi hình ảnh vật tư thành công`, MessageSeverity.success);

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
            this.VatTuHinhAnhEdit.vatTuId = obj.vatTuId;
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

    editVatTuHinhAnh(obj: VatTuHinhAnh[]) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;            
            this.isdisplayImage = true;
            this.VatTuHinhAnhEdit = new VatTuHinhAnh();
            for (var i = 0; i < obj.length; i++) {
                this.editingRowName = obj[i].tenHinhAnh;
                Object.assign(this.VatTuHinhAnhEdit, obj[i]);
                Object.assign(this.VatTuHinhAnhEdit, obj[i]);               
                this.altImageItem = obj[i].tenHinhAnh;
                this.imageData = location.origin + obj[i].urlHinhAnh;
            }
            this.edit();
            return this.VatTuHinhAnhEdit;
        }
        else {
            return this.newVatTuHinhAnh();
        }
    }

    private edit() {
        if (!this.VatTuEdit) {
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

    public clear2EventHandler(e: ClearEvent): void {
        console.log('Clearing the file upload');
        this.imagePreviews = [];
    }

    public complete2EventHandler(event) {
        this.isSaving = true;
            for (var i = 1; i <= this.urlFileList.length; i++) {
                this.VatTuHinhAnhEdit.tenHinhAnh = this.urlFileList[i].slice(13);
                this.VatTuHinhAnhEdit.urlHinhAnh = this.urlFileList[i];
                this.vattuhinhanhService.addnewVatTuHinhAnh(this.VatTuHinhAnhEdit).subscribe(results => {
                    this.save2SuccessHelper(results);
                    if (i == this.urlFileList.length) {
                        this.alertService.showMessage("Bước 2 thành công", `Thực hiện thêm mới hình ảnh vật tư thành công`, MessageSeverity.success);
                    }
                }, error => { this.saveFailedHelper(error) });
            }
        //} else {
        //    this.vattuhinhanhService.getCount(this.VatTuHinhAnhEdit.vatTuId).subscribe(results => {
        //        for (var i = 1; i <= this.urlFileList.length; i++) {
        //            if (i <= results.length) {
        //                this.fileuploadService.deleteEachFileByPath(results[i].tenHinhAnh, results[i].urlHinhAnh.slice(1, 12)).subscribe(r => { }, error => { });
        //                results[i].tenHinhAnh = this.urlFileList[i].slice(13);
        //                results[i].urlHinhAnh = this.urlFileList[i];
        //                this.vattuhinhanhService.updateVatTuHinhAnh(results[i].vatTuHinhAnhId, results[i]).subscribe(response => {
        //                    this.save2SuccessHelper();
        //                    if (i == this.urlFileList.length) {
        //                        this.alertService.showMessage("Bước 2 thành công", `Thực hiện thay đổi hình ảnh vật tư thành công`, MessageSeverity.success);
        //                    }
        //                }, error => this.saveFailedHelper(error));
        //            } else {
        //                this.VatTuHinhAnhEdit.tenHinhAnh = this.urlFileList[i].slice(13);
        //                this.VatTuHinhAnhEdit.urlHinhAnh = this.urlFileList[i];
        //                this.vattuhinhanhService.addnewVatTuHinhAnh(this.VatTuHinhAnhEdit).subscribe(results => {
        //                    this.save2SuccessHelper(results);
        //                    if (i == this.urlFileList.length) {
        //                        this.alertService.showMessage("Bước 2 thành công", `Thực hiện thay đổi hình ảnh vật tư thành công`, MessageSeverity.success);
        //                    }
        //                }, error => { this.saveFailedHelper(error) });
        //            }
        //        }
        //    })
        //}
    }

    public remove2EventHandler(e: RemoveEvent, value: string): void {
        console.log(`Removing ${e.files[0].name}`);

        e.data = {
            path: value
        };

        const index = this.imagePreviews.findIndex(item => item.uid === e.files[0].uid);

        if (index >= 0) {
            this.imagePreviews.splice(index, 1);
        }
    }

    upload2EventHandler(e: UploadEvent, value: string) {
        this.stringRandom = Utilities.RandomText(5);
        e.data = {
            stringRandom: this.stringRandom,
            urlSever: value
        };
        e.files.forEach((file) => {

            var name = this.stringRandom + "_" + file.name;
            this.urlFile = "\\" + value + "\\" + name;
            this.urlFileList.unshift(this.urlFile);
        })
    }

    public select2EventHandler(e: SelectEvent): void {
        const that = this;
        e.files.forEach((file) => {
            if (!file.validationErrors) {
                const reader = new FileReader();

                reader.onload = function (ev: any) {
                    const image: any = {
                        src: ev.target.result,
                        uid: file.uid
                    };
                    VatTuHinhAnhInfoComponent.srcDataImg = image.src;
                    that.imagePreviews.unshift(image);
                };
                reader.readAsDataURL(file.rawFile);
            }
        });
    } 

    clearImageData(id: number) {
        console.log(id);
    }
}