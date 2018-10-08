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
import { VatTuHinhAnhInfoComponent } from '../vattuhinhanh/vattuhinhanh-info.component';
import { UploadEvent, SelectEvent, FileInfo, ClearEvent, RemoveEvent, FileRestrictions } from '@progress/kendo-angular-upload';
import { VatTuHinhAnh } from '../../models/vattuhinhanh.model';
import { VatTuHinhAnhService } from '../../services/vattuhinhanh.service';
import { VatTuTaiLieuService } from '../../services/vattutailieu.service';
import { VatTuTaiLieu } from '../../models/vattutailieu.model';
import { FileUploadService } from '../../services/fileupload.service';
import { IntlService } from '@progress/kendo-angular-intl';
import { QuocTichService } from '../../services/quoctich.service';
import { LoaiHangService } from '../../services/loaihang.service';
import { HangSanXuatService } from '../../services/hangsanxuat.service';
import { NhaCungCapService } from '../../services/nhacungcap.service';
import { DonViTinhService } from '../../services/donvitinh.service';
import { PhongBanService } from '../../services/phongban.service';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { id } from '@swimlane/ngx-datatable/release/utils';


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

    private id: number = 0;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private VatTuEdit: VatTu = new VatTu();
    private VatTuConEdit: VatTu = new VatTu();
    private VatTuHinhAnhEdit: VatTuHinhAnh = new VatTuHinhAnh();
    private VatTuTaiLieuEdit: VatTuTaiLieu = new VatTuTaiLieu();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public isHoverChangeInputDate = true;
    public isFocusChangeInputDate = 1;

    public uploadImageRestrictions: FileRestrictions = {
        allowedExtensions: ['.jpg', '.png']
    };

    public uploadFileRestrictions: FileRestrictions = {
        allowedExtensions: ['.xlsx', '.docx', '.doc', '.ppt']
    };

    public ChkquocTich: boolean;
    public ChkloaiHang: boolean;
    public ChkhangSX: boolean;
    public ChkChangSX: boolean;
    public ChknhaCC: boolean;
    public ChkdonViTinh: boolean;
    public ChkloaiTien: boolean;
    public ChkphongBan: boolean;
    public ChkNDTN: boolean;
    public ChkDVKH: boolean;
    public checkTen: boolean;
    public checkTenCon: boolean;

    objNDTN: NguoiDungToaNha = new NguoiDungToaNha();
    listHA: VatTuHinhAnh[] = [];
    listTL: VatTuTaiLieu[] = [];
    quoctichs: QuocTich[] = [];
    loaihangs: LoaiHang[] = [];
    hangSX: HangSanXuat[] = [];
    nhaCC: NhaCungCap[] = [];
    donvitinhs: DonViTinh[] = [];
    phongbans: PhongBan[] = [];
    loaitiens: LoaiTien[] = [];
    NDTN: NguoiDungToaNha[] = [];
    vattuCha: VatTu[] = [];
    countVTC: VatTu[] = [];
    listVTC: VatTu[] = [];
    listRemoved: VatTu[] = [];
    public imagePreviews: FileInfo[] = [];
    public filePreviews: FileInfo[] = [];

    valueNgayLap: Date = new Date();
    valueBaoHanh: Date = new Date();

    giaVattu: string = "0";
    last: string = "";
    public stringRandom: string;
    public valueTien: string;

    public urlImg: string = "";
    public urlImgList: string[] = [];
    public urlFile: string = "";
    public urlFileList: string[] = [];

    step1: boolean = false;
    step2: boolean = false;
    step3: boolean = false;

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
        private quoctichService: QuocTichService,
        private loaihangService: LoaiHangService,
        private hangsxService: HangSanXuatService,
        private nhaccService: NhaCungCapService,
        private donvitinhService: DonViTinhService,
        private phongbanService: PhongBanService,
        private loaitienService: LoaiTienService,
        private NDTNService: NguoiDungToaNhaService,
        private vattuhinhanhService: VatTuHinhAnhService,
        private vattutailieuService: VatTuTaiLieuService,
        private fileuploadService: FileUploadService,
        private nguoidungtoanhaService: NguoiDungToaNhaService,
        private intl: IntlService,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService) {
    }

    ngOnInit() {
        if (this.authService.currentUser) {
            var userId = this.authService.currentUser.id;
            var where = "NguoiDungId = '" + userId + "'";
            this.nguoidungtoanhaService.getItems(0, 1, where, "x").subscribe(result => this.getNguoiDungToaNha(result), error => {
                this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng tòa nhà từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
        }
        this.loadAllQuocTich();
        this.loadAllLoaiHang();
        this.loadAllHangSanXuat();
        this.loadAllNhaCungCap();
        this.loadAllLoaiTien();
        this.loadAllDonViTinh();
        this.loadAllNDTN();
        this.loadAllVTC();
        this.step1 = true;
        this.step3 = false;
        this.step2 = false;

        this.id = Number(this.route.snapshot.paramMap.get('tid'));
        if (this.id != 0) {
            this.isNew = false;
            this.loadData(this.id);
        } else {
            this.isNew = true;
            this.newVatTu();
        }
    }

    getNguoiDungToaNha(list: NguoiDungToaNha[]) {
        if (list.length > 0) {
            this.objNDTN = list[0];
            this.loadAllPhongBan(this.objNDTN.toaNhaId, this.objNDTN.toaNha.cumToaNhaId);
        }
    }

    loadAllQuocTich() {
        this.quoctichService.getAllQuocTich().subscribe(results => this.onDataLoadQuocTichSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadQuocTichSuccessful(obj: QuocTich[]) {
        this.quoctichs = obj;
    }

    loadAllLoaiHang() {
        this.loaihangService.getAllLoaiHang().subscribe(results => this.onDataLoadLoaiHangSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadLoaiHangSuccessful(obj: LoaiHang[]) {
        this.loaihangs = obj;
    }

    loadAllHangSanXuat() {
        this.hangsxService.getAllHangSanXuat().subscribe(results => this.onDataLoadHangSanXuatSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadHangSanXuatSuccessful(obj: HangSanXuat[]) {
        this.hangSX = obj;
    }

    loadAllNhaCungCap() {
        this.nhaccService.getAllNhaCungCap().subscribe(results => this.onDataLoadNhaCungCapSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadNhaCungCapSuccessful(obj: NhaCungCap[]) {
        this.nhaCC = obj;
    }

    loadAllPhongBan(toanha: number, cumtoanha: number) {
        this.phongbanService.getPhongBanByToaNha(toanha, cumtoanha).subscribe(results => this.onDataLoadPhongBanSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadPhongBanSuccessful(obj: PhongBan[]) {
        this.phongbans = obj;
    }

    loadAllDonViTinh() {
        this.donvitinhService.getAllDonViTinh().subscribe(results => this.onDataLoadDonViTinhSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadDonViTinhSuccessful(obj: DonViTinh[]) {
        this.donvitinhs = obj;
    }

    loadAllLoaiTien() {
        this.loaitienService.getAllLoaiTien().subscribe(results => this.onDataLoadLoaiTienSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadLoaiTienSuccessful(obj: LoaiTien[]) {
        this.loaitiens = obj;
    }

    loadAllNDTN() {
        this.NDTNService.getAllNguoiDungToaNha().subscribe(results => this.onDataLoadNDTNSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadNDTNSuccessful(obj: NguoiDungToaNha[]) {
        this.NDTN = obj;
    }

    loadAllVTC() {
        this.gvService.getAllVatTu().subscribe(results => this.onDataLoadVTCSuccessful(results), error => this.onDataLoadFailed(error))
    }

    onDataLoadVTCSuccessful(obj: VatTu[]) {
        this.vattuCha = obj;
    }

    loadData(id: number) {
        this.alertService.startLoadingMessage();
        this.gvService.getVatTuByID(id).subscribe(results => {
            this.alertService.stopLoadingMessage();
            this.editVatTu(results);
        }, error => this.onDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: VatTu) {
        this.alertService.stopLoadingMessage();
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
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
        this.checkTen = true;
    }

    backStep2() {
        this.step1 = false;
        this.step2 = true;
        this.step3 = false;
        this.listHA = [];
        this.vattuhinhanhService.getVatTuHinhAnhByID(this.VatTuEdit.vatTuId).subscribe(results => {
            this.listHA = results;
        });
    }

    nextStep3() {
        if (this.listHA.length > 0) {
            this.alertService.showStickyMessage("Thành công", "Hoàn thành bước 2, qua bước 3 thành công", MessageSeverity.success);
            this.step1 = false;
            this.step2 = false;
            this.step3 = true;
            this.vattutailieuService.getVatTuTaiLieuByID(this.VatTuEdit.vatTuId).subscribe(results => {
                this.listTL = results;
            });
        } else {
            this.alertService.showStickyMessage("Lỗi nhập liệu", "Vui lòng nhập hình ảnh vật tư để qua bước tiếp theo", MessageSeverity.error);
        }
    }

    finish() {
        if (this.listHA.length > 0) {
            if (this.id == 0) {
                this.alertService.showStickyMessage("Thành công", "Hoàn thành thêm mới thông tin vật tư", MessageSeverity.success);
            } else {
                this.alertService.showStickyMessage("Thành công", "Hoàn thành chỉnh sửa thông tin vật tư", MessageSeverity.success);
            }
            this.router.navigate(['./taisan']);
        } else {
            this.alertService.showStickyMessage("Lỗi nhập liệu", "Vui lòng nhập tài liệu vật tư để hoàn thành", MessageSeverity.error);
        }
    }

    selectVTC(row: VatTu) {
        if (this.checkTenCon == true && this.ChkChangSX == true) {
            row.hangSanXuats = this.hangSX.find(r => r.hangSanXuatId == row.hangSanXuatId);
            this.listVTC.push(row);
            this.newVatTuCon(this.VatTuEdit.maVatTu);
        } else {
            this.alertService.showStickyMessage("Lỗi nhập liệu", "Vui lòng nhập đầy đủ các trường yêu cầu để lưu vật tư con !", MessageSeverity.error);
        }
    }

    deleteHinhAnh(row: VatTuHinhAnh) {
        this.vattuhinhanhService.deleteVatTuHinhAnh(row.vatTuHinhAnhId).subscribe(resulst => {
            this.fileuploadService.deleteEachFileByPath(row.tenHinhAnh, row.urlHinhAnh.slice(1, 12)).subscribe(result => {
                this.alertService.showStickyMessage("Thành công", "Xóa hình ảnh thành công", MessageSeverity.success);
                this.listHA.splice(this.listHA.indexOf(row), 1);
            }, error => { });
        }, error => error);
    }

    deleteTaiLieu(row: VatTuTaiLieu) {
        this.vattutailieuService.deleteVatTuTaiLieu(row.vatTutaiLieuId).subscribe(resulst => {
            this.fileuploadService.deleteEachFileByPath(row.tenTaiLieu, row.urlTaiLieu.slice(1, 12)).subcribe(result => {
                this.alertService.showStickyMessage("Thành công", "Xóa tài liệu thành công", MessageSeverity.success);
                this.listTL.splice(this.listTL.indexOf(row), 1);
            }, error => { });
        }, error => { })
    }

    deleteVTC(row: VatTu) {
        if (this.id == 0) {
            this.listVTC.splice(this.listVTC.indexOf(row), 1);
            this.newVatTuCon(this.VatTuEdit.maVatTu);
        } else {
            var removed = this.listVTC.splice(this.listVTC.indexOf(row), 1);
            this.listRemoved.push(removed[0]);
        }
    }

    private cancel() {
        this.VatTuEdit = new VatTu();
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        this.alertService.resetStickyMessage();
        this.router.navigate(['taisan']);
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
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            if (this.id == 0) {
                this.gvService.addnewVatTu(this.VatTuEdit).subscribe(results => {
                    if (results.tenVatTu == "Exist") {
                        this.showErrorAlert("Lỗi nhập liệu", "Tên vật tư " + this.VatTuEdit.tenVatTu + " đã tồn tại trên hệ thống, vui lòng chọn tên khác");
                        this.alertService.stopLoadingMessage();
                        this.isSaving = false;
                        this.checkTen = false;
                    } else {
                        this.save1SuccessHelper(results);
                        this.saveVatTuCon(results.vatTuId);
                        this.VatTuHinhAnhEdit.vatTuId = results.vatTuId;
                        this.VatTuTaiLieuEdit.vatTuId = results.vatTuId;
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
                        this.save1SuccessHelper();
                        this.saveVatTuCon(this.VatTuEdit.vatTuId);
                        this.vattuhinhanhService.getVatTuHinhAnhByID(this.VatTuEdit.vatTuId).subscribe(results => {
                            this.listHA = results;
                        });
                        this.VatTuHinhAnhEdit.vatTuId = this.VatTuEdit.vatTuId;
                        this.VatTuTaiLieuEdit.vatTuId = this.VatTuEdit.vatTuId;
                    }
                }, error => this.saveFailedHelper(error));
            }
        }
    }

    saveVatTuCon(id: number) {
        if (this.id == 0) {
            for (var i = 0; i < this.listVTC.length; i++) {
                this.VatTuConEdit.maVatTuCha = id;
                this.VatTuConEdit.tenVatTu = this.listVTC[i].tenVatTu;
                this.VatTuConEdit.model = this.listVTC[i].model;
                this.VatTuConEdit.maVatTu = this.listVTC[i].maVatTu;
                this.VatTuConEdit.hangSanXuatId = this.listVTC[i].hangSanXuatId;
                this.VatTuConEdit.serialNumber = this.listVTC[i].serialNumber;
                this.gvService.addnewVatTu(this.VatTuConEdit).subscribe(results => console.log(results), error => { });
            }
        } else {
            this.countVTC = this.vattuCha.filter(o => o.maVatTuCha == this.VatTuEdit.vatTuId);
            if (this.countVTC.length == this.listVTC.length) {
                for (var i = 0; i < this.listVTC.length; i++) {
                    this.VatTuConEdit.maVatTuCha = id;
                    this.VatTuConEdit.vatTuId = this.listVTC[i].vatTuId;
                    this.VatTuConEdit.tenVatTu = this.listVTC[i].tenVatTu;
                    this.VatTuConEdit.model = this.listVTC[i].model;
                    this.VatTuConEdit.maVatTu = this.listVTC[i].maVatTu;
                    this.VatTuConEdit.hangSanXuatId = this.listVTC[i].hangSanXuatId;
                    this.VatTuConEdit.serialNumber = this.listVTC[i].serialNumber;
                    this.gvService.updateVatTu(this.VatTuConEdit.vatTuId, this.VatTuConEdit).subscribe();
                }
            } else if (this.countVTC.length < this.listVTC.length) {
                for (var i = 0; i < this.listVTC.length; i++) {
                    this.VatTuConEdit.maVatTuCha = id;
                    this.VatTuConEdit.vatTuId = this.listVTC[i].vatTuId;
                    this.VatTuConEdit.tenVatTu = this.listVTC[i].tenVatTu;
                    this.VatTuConEdit.model = this.listVTC[i].model;
                    this.VatTuConEdit.maVatTu = this.listVTC[i].maVatTu;
                    this.VatTuConEdit.hangSanXuatId = this.listVTC[i].hangSanXuatId;
                    this.VatTuConEdit.serialNumber = this.listVTC[i].serialNumber;
                    if (i - this.countVTC.length >= 0) {
                        this.gvService.addnewVatTu(this.VatTuConEdit).subscribe(results => console.log(results), error => { });
                    } else {
                        this.gvService.updateVatTu(this.VatTuConEdit.vatTuId, this.VatTuConEdit).subscribe(results => console.log(results), error => { });
                    }
                }
            } else {
                for (var itemRemove of this.listRemoved) {
                    this.gvService.deleteVatTu(itemRemove.vatTuId).subscribe(results => { alert("Success") }, error => { alert("Fail"); })
                }
                for (var item of this.listVTC) {
                    this.VatTuConEdit.maVatTuCha = id;
                    this.VatTuConEdit.vatTuId = item.vatTuId;
                    this.VatTuConEdit.tenVatTu = item.tenVatTu;
                    this.VatTuConEdit.model = item.model;
                    this.VatTuConEdit.maVatTu = item.maVatTu;
                    this.VatTuConEdit.hangSanXuatId = item.hangSanXuatId;
                    this.VatTuConEdit.serialNumber = item.serialNumber;
                    this.gvService.updateVatTu(this.VatTuConEdit.vatTuId, this.VatTuConEdit).subscribe(response => { }, error => { });
                }
            }
        }
    }

    private saveStep2() {
        let k_img_name: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("k-upload-selected") as HTMLCollectionOf<HTMLElement>;
        if (k_img_name.length > 0) {
            k_img_name[0].click();
        }
    }

    private saveStep3() {
        let k_file_name: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("k-upload-selected") as HTMLCollectionOf<HTMLElement>;
        if (k_file_name.length > 0) {
            k_file_name[0].click();
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
        this.checkTen = false
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
            this.newVatTuCon(this.VatTuEdit.maVatTu);
        }, error => {
            var numberLast = 1;
            var number = 10 - numberLast.toString().length;
            for (var i = 0; i < number; i++) {
                this.last += "0";
            }
            this.VatTuEdit.maVatTu = "VT-" + this.last + numberLast;
            this.newVatTuCon(this.VatTuEdit.maVatTu);
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
        this.valueTien = "";
        this.valueBaoHanh = new Date(this.valueNgayLap.getFullYear() + this.VatTuEdit.namSD, this.valueBaoHanh.getMonth(), this.valueBaoHanh.getDate());
        this.VatTuEdit.khauHao = 0;
        this.VatTuEdit.trangThai = 1;
        this.edit();
        return this.VatTuEdit;
    }

    newVatTuCon(ma: string) {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.VatTuConEdit = new VatTu();
        this.VatTuConEdit.hangSanXuatId = 0;
        this.VatTuConEdit.trangThai = 1;
        this.VatTuConEdit.maVatTu = ma + "-0" + Number(this.listVTC.length + 1);
        return this.VatTuConEdit;
    }

    private save1SuccessHelper(obj?: VatTu) {
        this.alertService.stopLoadingMessage();
        if (this.isNew && this.VatTuEdit.vatTuId == null) {
            this.alertService.showMessage("Bước 1 thành công", `Thực hiện thêm mới vật tư thành công`, MessageSeverity.success);
        }
        else
            this.alertService.showMessage("Bước 1 thành công", `Thực hiện thay đổi thông tin vật tư thành công`, MessageSeverity.success);
        this.step1 = false;
        this.step2 = true;
        this.step3 = false;
    }

    private save2SuccessHelper(obj?: VatTuHinhAnh) {
        this.alertService.stopLoadingMessage();
        if (this.id == 0) {
            this.alertService.showMessage("Bước 2 thành công", `Thực hiện thêm mới hình ảnh vật tư thành công`, MessageSeverity.success);
        } else {
            this.alertService.showMessage("Bước 2 thành công", `Thực hiện chỉnh sửa hình ảnh vật tư thành công`, MessageSeverity.success);
        }
    }

    private save3SuccessHelper(obj?: VatTuTaiLieu) {
        this.alertService.stopLoadingMessage();
        if (this.id == 0) {
            this.alertService.showMessage("Bước 3 thành công", `Thực hiện thêm mới tài liệu vật tư thành công`, MessageSeverity.success);
        } else {
            this.alertService.showMessage("Bước 3 thành công", `Thực hiện chỉnh sửa tài liệu vật tư thành công`, MessageSeverity.success);
        }
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
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
            this.checkTen = true;
            this.ChkhangSX = true;
            this.ChkloaiHang = true;
            this.ChkloaiTien = true;
            this.ChkNDTN = true;
            this.ChknhaCC = true;
            this.ChkquocTich = true;
            this.editingRowName = obj.tenVatTu;
            var check = this.vattuCha.filter(o => o.maVatTuCha == obj.vatTuId);
            if (check.length > 0) {
                this.listVTC = check;
                this.VatTuConEdit.maVatTu = obj.maVatTu + "-0" + Number(this.listVTC.length + 1);
                this.VatTuConEdit.hangSanXuatId = 0;
            } else {
                this.newVatTuCon(obj.maVatTu);
            }
            this.giaVattu = this.formatPrice(obj.giaVatTu.toString());
            this.VatTuHinhAnhEdit.vatTuId = obj.vatTuId;
            this.valueBaoHanh = new Date(this.intl.formatDate(obj.ngayHHBaoHanh));
            this.valueNgayLap = new Date(this.intl.formatDate(obj.ngayLap));
            this.valueTien = obj.loaiTiens.kyHieu;
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

    ngayLapChange(value: Date) {
        this.valueBaoHanh = value;
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

    tenConChk(value: string) {
        if (value != "") {
            this.checkTenCon = true;
        } else
            this.checkTenCon = false;
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
            this.loaitienService.getLoaiTienByID(id).subscribe(results => {
                this.valueTien = results.kyHieu;
            }, error => { });
            this.ChkloaiTien = true;
        } else {
            this.valueTien = "";
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

    hangSanXuatConChk(id: number) {
        if (id > 0) {
            this.ChkChangSX = true;
        } else
            this.ChkChangSX = false;
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

    baoHanhChange(value: Date) {
        if (value.getFullYear() > this.valueNgayLap.getFullYear()) {
            this.VatTuEdit.namSD = value.getFullYear() - this.valueNgayLap.getFullYear();
        } else {
            this.alertService.showStickyMessage("Lỗi nhập liệu", "Vui lòng nhập năm bảo hành > ngày lập", MessageSeverity.error);
        }
    }

    formatPrice(price: string) {
        if (price) {
            var pN = Number(price);
            var fm = Utilities.formatNumber(pN);
            return fm;
        }
    }

    public clear2EventHandler(e: ClearEvent): void {
        console.log('Clearing the file upload');
        this.imagePreviews = [];
    }

    public complete2EventHandler(event) {
        this.isSaving = true;
        for (var i = 0; i < this.urlImgList.length; i++) {
            this.VatTuHinhAnhEdit.vatTuHinhAnhId = undefined;
            this.VatTuHinhAnhEdit.tenHinhAnh = this.urlImgList[i].slice(13);
            this.VatTuHinhAnhEdit.urlHinhAnh = this.urlImgList[i];
            this.vattuhinhanhService.addnewVatTuHinhAnh(this.VatTuHinhAnhEdit).subscribe(results => {
                this.save2SuccessHelper(results);
                this.listHA.push(results);
            }, error => {
                this.saveFailedHelper(error);
                this.fileuploadService.deleteEachFileByPath(this.urlImgList[i].slice(13), this.urlImgList[i].slice(1, 12))
                    .subscribe(results => { }, error => { });
            });
        }
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
            this.urlImg = "\\" + value + "\\" + name;
            this.urlImgList.unshift(this.urlImg);
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

    clear2ImageData(id: number, path: string) {
        var pathImg = path.slice(1, 12);
        var nameImg = path.slice(13);
        this.vattuhinhanhService.deleteVatTuHinhAnh(id).subscribe(results => {
            this.fileuploadService.deleteEachFileByPath(nameImg, pathImg).subscribe(results => {
                this.alertService.showMessage("Thành công", `thực hiện xóa thành công`, MessageSeverity.success);
                this.vattuhinhanhService.getVatTuHinhAnhByID(this.VatTuHinhAnhEdit.vatTuId).subscribe(results => {
                    this.listHA = results;
                })
            }, error => {
                this.alertService.showMessage("lỗi xóa", `xóa không thành công`, MessageSeverity.error);
            })
        }, error => {
            this.alertService.showMessage("Lỗi xóa", `Thực hiện xóa ảnh không thành công`, MessageSeverity.error);
        });
    }

    public clear3EventHandler(e: ClearEvent): void {
        console.log('Clearing the file upload');
        this.filePreviews = [];
    }

    public complete3EventHandler(event) {
        this.isSaving = true;
        for (var i = 0; i < this.urlFileList.length; i++) {
            this.VatTuTaiLieuEdit.vatTutaiLieuId = undefined;
            this.VatTuTaiLieuEdit.tenTaiLieu = this.urlFileList[i].slice(13);
            this.VatTuTaiLieuEdit.urlTaiLieu = this.urlFileList[i];
            this.vattutailieuService.addnewVatTuTaiLieu(this.VatTuTaiLieuEdit).subscribe(results => {
                this.save3SuccessHelper(results);
                this.listTL.push(results);
            }, error => {
                this.saveFailedHelper(error);
                this.fileuploadService.deleteEachFileByPath(this.urlFileList[i].slice(13), this.urlFileList[i].slice(1, 12))
                    .subscribe(results => { }, error => { });
            });
        }
    }

    public remove3EventHandler(e: RemoveEvent, value: string): void {
        console.log(`Removing ${e.files[0].name}`);

        e.data = {
            path: value
        };

        const index = this.filePreviews.findIndex(item => item.uid === e.files[0].uid);

        if (index >= 0) {
            this.filePreviews.splice(index, 1);
        }
    }

    upload3EventHandler(e: UploadEvent, value: string) {
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

    public select3EventHandler(e: SelectEvent): void {
        const that = this;
        e.files.forEach((file) => {
            if (!file.validationErrors) {
                const reader = new FileReader();

                reader.onload = function (ev: any) {
                    const image: any = {
                        src: ev.target.result,
                        uid: file.uid
                    };
                    that.filePreviews.unshift(image);
                };
                reader.readAsDataURL(file.rawFile);
            }
        });
    }

    clear3ImageData(id: number, path: string) {
        var pathFile = path.slice(1, 12);
        var nameFile = path.slice(13);
        this.vattutailieuService.deleteVatTuTaiLieu(id).subscribe(results => {
            this.fileuploadService.deleteEachFileByPath(nameFile, pathFile).subscribe(results => {
                if (results == "Success") {
                    this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
                    this.vattuhinhanhService.getVatTuHinhAnhByID(this.VatTuHinhAnhEdit.vatTuId).subscribe(results => {
                        this.listHA = results;
                    })
                }
            }, error => {

            });
        }, error => {
            this.alertService.showMessage("Lỗi xóa", `Thực hiện xóa tài liệu không thành công`, MessageSeverity.error);
        });
    }

    public onHovering(event) {
        event.target.parentElement.children[0].setAttribute('class', "isHoverChangeInputDate");
    }

    public onUnovering(event) {
        if (this.isFocusChangeInputDate == 1) {
            event.target.parentElement.children[0].setAttribute('class', "text-display");
        } else {
            event.target.parentElement.children[0].setAttribute('class', "isHoverChangeInputDate");
        }
    }

    public focusFunction(event) {
        event.target.parentElement.children[0].setAttribute('class', "isHoverChangeInputDate");
        this.isFocusChangeInputDate = 2;
    }

    public focusOutFunction(event) {
        event.target.parentElement.children[0].setAttribute('class', "text-display");
        this.isFocusChangeInputDate = 1;
    }
}