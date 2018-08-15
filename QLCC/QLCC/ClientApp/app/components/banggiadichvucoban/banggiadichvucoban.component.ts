import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { BangGiaDichVuCoBanService } from "../../services/banggiadichvucoban.service";
import { BangGiaDichVuCoBan } from "../../models/banggiadichvucoban.model";
import { BangGiaDichVuCoBanInfoComponent } from "./banggiadichvucoban-info.component";
import { AuthService } from '../../services/auth.service';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { LoaiDichVu } from '../../models/loaidichvu.model';
import { LoaiTien } from '../../models/loaitien.model';
import { DonViTinh } from '../../models/donvitinh.model';
import { LoaiDichVuService } from '../../services/loaidichvu.service';
import { LoaiTienService } from '../../services/loaitien.service';
import { DonViTinhService } from '../../services/donvitinh.service';

@Component({
    selector: "banggiadichvucoban",
    templateUrl: "./banggiadichvucoban.component.html",
    styleUrls: ["./banggiadichvucoban.component.css"]
})

export class BangGiaDichVuCoBanComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: BangGiaDichVuCoBan[] = [];
    rowsCache: BangGiaDichVuCoBan[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    banggiadichvucobanEdit: BangGiaDichVuCoBan;
    sourcebanggiadichvucoban: BangGiaDichVuCoBan;
    editingRowName: { name: string };
    objNDTN: NguoiDungToaNha = new NguoiDungToaNha();
    loaidichvus: LoaiDichVu[] = [];
    loaitiens: LoaiTien[] = [];
    donvitinhs: DonViTinh[] = [];

    @ViewChild('f')
    private form;

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('nameTemplate')
    nameTemplate: TemplateRef<any>;

    @ViewChild('descriptionTemplate')
    descriptionTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('banggiadichvucobanEditor')
    BangGiaDichVuCoBanEditor: BangGiaDichVuCoBanInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private banggiadichvucobanService: BangGiaDichVuCoBanService, private authService: AuthService, private nguoidungtoanhaService: NguoiDungToaNhaService
        , private loaidichvuService: LoaiDichVuService, private loaitienService: LoaiTienService, private donvitinhService: DonViTinhService) {
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'loaiDichVu.tenLoaiDichVu', name: gT('Loại dịch vụ') },
            { prop: 'loaiTien.tenLoaiTien', name: gT('Loaị tiền') },
            { prop: 'donViTinh.tenDonViTinh', name: gT('Đơn vị tính') },
            { prop: 'donGia', name: gT('Dơn giá') },
            { prop: 'dienGiai', name: gT('Mô tả') },
            { name: 'Chức năng', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        if (this.authService.currentUser) {
            var userId = this.authService.currentUser.id;
            var where = "NguoiDungId = '" + userId + "'";
            this.nguoidungtoanhaService.getItems(0, 1, where, "x").subscribe(result => this.getNguoiDungToaNha(result), error => {
                this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng tòa nhà từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
        }
    }

    getNguoiDungToaNha(list: NguoiDungToaNha[]) {
        if (list.length > 0) {
            this.objNDTN = list[0];
            this.loadData();
            this.loaidichvuService.getItems(0, 0,"TrangThai = 1","x").subscribe(results => { this.loaidichvus = results }, error => this.onDataLoadFailed(error));
            this.loaitienService.getAllLoaiTien().subscribe(results => { this.loaitiens = results }, error => this.onDataLoadFailed(error));
            this.donvitinhService.getAllDonViTinh().subscribe(results => { this.donvitinhs = results }, error => this.onDataLoadFailed(error));
        }
    }

    ngAfterViewInit() {
        this.BangGiaDichVuCoBanEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.BangGiaDichVuCoBanEditor.changesCancelledCallback = () => {
            this.banggiadichvucobanEdit = null;
            this.sourcebanggiadichvucoban = null;
            this.editorModal.hide();
        };
    }

    addNewToList() {
        this.loadData();
        if (this.sourcebanggiadichvucoban) {
            Object.assign(this.sourcebanggiadichvucoban, this.banggiadichvucobanEdit);
            this.banggiadichvucobanEdit = null;
            this.sourcebanggiadichvucoban = null;            
        }
        else {
            //this.loadData();
            //let objBangGiaDichVuCoBan = new BangGiaDichVuCoBan();
            //Object.assign(objBangGiaDichVuCoBan, this.banggiadichvucobanEdit);
            //this.banggiadichvucobanEdit = null;

            //let maxIndex = 0;
            //for (let u of this.rowsCache) {
            //    if ((<any>u).index > maxIndex)
            //        maxIndex = (<any>u).index;
            //}

            //(<any>objBangGiaDichVuCoBan).index = maxIndex + 1;

            //this.rowsCache.splice(0, 0, objBangGiaDichVuCoBan);
            //this.rows.splice(0, 0, objBangGiaDichVuCoBan);
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.banggiadichvucobanService.getItems(0, 0, "ToaNhaId = " + this.objNDTN.toaNhaId, "x").subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: BangGiaDichVuCoBan[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        obj.forEach((item, index, obj) => {
            (<any>item).index = index + 1;
        });

        this.rowsCache = [...obj];
        this.rows = obj;
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.BangGiaDichVuCoBanEditor.resetForm(true);
    }

    newBangGiaDichVuCoBan() {
        this.editingRowName = null;
        this.sourcebanggiadichvucoban = null;
        this.BangGiaDichVuCoBanEditor.loaidichvus = this.loaidichvus;
        this.BangGiaDichVuCoBanEditor.loaitiens = this.loaitiens;
        this.BangGiaDichVuCoBanEditor.donvitinhs = this.donvitinhs;
        this.BangGiaDichVuCoBanEditor.toaNhaId = this.objNDTN.toaNhaId;
        this.banggiadichvucobanEdit = this.BangGiaDichVuCoBanEditor.newBangGiaDichVuCoBan();        
        this.editorModal.show();
    }

    editBangGiaDichVuCoBan(row: BangGiaDichVuCoBan) {
        this.editingRowName = { name: row.dienGiai };        
        this.BangGiaDichVuCoBanEditor.loaidichvus = this.loaidichvus;
        this.BangGiaDichVuCoBanEditor.loaitiens = this.loaitiens;
        this.BangGiaDichVuCoBanEditor.donvitinhs = this.donvitinhs;
        this.sourcebanggiadichvucoban = row;        
        this.banggiadichvucobanEdit = this.BangGiaDichVuCoBanEditor.editBangGiaDichVuCoBan(row);
        this.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.bangGiaDichVuCoBanId, r.loaiDichVuId, r.loaiTienId, r.donViTinhId, r.toaNhaId, r.donGia, r.dienGiai, r.nguoiNhap, r.ngayNhap, r.nguoiSua, r.ngaySua));
    }

    deleteBangGiaDichVuCoBan(row: BangGiaDichVuCoBan) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: BangGiaDichVuCoBan) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.banggiadichvucobanService.deleteBangGiaDichVuCoBan(row.bangGiaDichVuCoBanId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
                this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
            },
                error => {
                    this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;
                    this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                });
    }    
}