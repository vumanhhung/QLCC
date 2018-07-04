import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from "../../../services/app-translation.service";
import { Utilities } from "../../../services/utilities";
import { KhachHangService } from "../../../services/khachhang.service";
import { KhachHang } from "../../../models/khachhang.model";
import { KhachHangDoanhNghiepInfoComponent } from "./khachhang-doanhnghiep-info.component";
import { QuocTich } from '../../../models/quoctich.model';
import { NganHang } from '../../../models/nganhang.model';
import { QuocTichService } from '../../../services/quoctich.service';
import { NganHangService } from '../../../services/nganhang.service';
import { NhomKhachHang } from '../../../models/nhomkhachhang.model';
import { NhomKhachHangService } from '../../../services/nhomkhachhang.service';

@Component({
    selector: "khachhangdoanhnghiep",
    templateUrl: "./khachhang-doanhnghiep.component.html",
    styleUrls: ["./khachhang-doanhnghiep.component.css"]
})

export class KhachHangDoanhNghiepComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: KhachHang[] = [];
    rowsCache: KhachHang[] = [];
    quoctich: QuocTich[] = [];
    nganhang: NganHang[] = [];
    nhomKhachHang: NhomKhachHang[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    khachhangEdit: KhachHang;
    sourcekhachhang: KhachHang;
    editingRowName: { name: string };
    public selectedGropup: number = 0;

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

    @ViewChild('khachhangEditor')
    KhachHangEditor: KhachHangDoanhNghiepInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private khachhangService: KhachHangService, private quoctichService: QuocTichService, private nganhangService: NganHangService, private nhomKhachHangService: NhomKhachHangService) {
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'tenCongTy', name: gT('Tên doanh nghiệp') },
            { prop: 'tenVietTat', name: gT('Tên viết tắt') },
            { prop: 'diaChiCongTy', name: gT('Địa chỉ') },
            { prop: 'dienThoaiCongTy', name: gT('Điện thoại') },
            { prop: 'nguoiDaiDien', name: gT('Người đại diện') },
            { prop: 'chucVu', name: gT('Chức vụ') },
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];

        this.loadData(0);
        this.loadAllQuocTich();
        this.loadAllNganHang();
        this.loadAllNhomKhachHang();
    }
    loadAllQuocTich() {
        this.quoctichService.getAllQuocTich().subscribe(results => this.onDataLoadQuocTichSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadQuocTichSuccessful(obj: QuocTich[]) {
        this.quoctich = obj;
    }
    loadAllNganHang() {
        this.nganhangService.getAllNganHang().subscribe(results => this.onDataLoadNganHangSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadNganHangSuccessful(obj: NganHang[]) {
        this.nganhang = obj;
    }
    loadAllNhomKhachHang() {
        this.nhomKhachHangService.getAllNhomKhachHang().subscribe(results => this.onDataLoadNhomKhachHangSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadNhomKhachHangSuccessful(obj: NhomKhachHang[]) {
        this.nhomKhachHang = obj;
    }

    SelectedGroupValue(value: number) {
        this.loadData(value);
    }
    ngAfterViewInit() {
        this.KhachHangEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.KhachHangEditor.editorModal.hide();
        };

        this.KhachHangEditor.changesCancelledCallback = () => {
            this.khachhangEdit = null;
            this.sourcekhachhang = null;
            this.KhachHangEditor.editorModal.hide();
        };
    }

    addNewToList() {
        if (this.sourcekhachhang) {
            Object.assign(this.sourcekhachhang, this.khachhangEdit);
            this.khachhangEdit = null;
            this.sourcekhachhang = null;
        }
        else {
            let objKhachHang = new KhachHang();
            Object.assign(objKhachHang, this.khachhangEdit);
            this.khachhangEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objKhachHang).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objKhachHang);
            this.rows.splice(0, 0, objKhachHang);
        }
    }

    loadData(groupId: number) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        if (groupId > 0) {
            this.khachhangService.getItems(0, 0, "KhDoanhNghiep = 1 AND NhomKhachHangId = " + groupId, "x").subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
        } else {
            this.khachhangService.getAllKhachHangDoanhNghiep().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
        }
        
    }

    onDataLoadSuccessful(obj: KhachHang[]) {
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

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.KhachHangEditor.resetForm(true);
    }

    newKhachHang() {        
        this.KhachHangEditor.tenkhachhangdoanhnghiep = "";
        this.editingRowName = null;
        this.sourcekhachhang = null;
        this.KhachHangEditor.quoctich = this.quoctich
        this.KhachHangEditor.nganhang = this.nganhang;
        this.KhachHangEditor.nhomKhachHang = this.nhomKhachHang;
        this.khachhangEdit = this.KhachHangEditor.newKhachHang();
        this.KhachHangEditor.isViewDetails = false;
        this.KhachHangEditor.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.tenVietTat, r.tenCongTy, r.diaChiCongTy, r.dienThoaiCongTy, r.fax, r.nguoiDaiDien, r.chucVu, r.mstCongTy, r.soDkKinhDoanh, r.ngayDkKinhDoanh, r.noiDkKinhDoanh, r.tkNganHangCongTy, r.nganHang));
    }

    deleteKhachHang(row: KhachHang) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: KhachHang) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.khachhangService.deleteKhachHang(row.khachHangId)
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

    editKhachHang(row: KhachHang) {
        this.KhachHangEditor.tenkhachhangdoanhnghiep = "- " + row.tenCongTy;
        this.editingRowName = { name: row.tenCongTy };
        this.sourcekhachhang = row;
        this.KhachHangEditor.quoctich = this.quoctich
        this.KhachHangEditor.nganhang = this.nganhang;
        this.KhachHangEditor.nhomKhachHang = this.nhomKhachHang;
        this.khachhangEdit = this.KhachHangEditor.editKhachHang(row);
        this.KhachHangEditor.isViewDetails = false;
        try {
            this.KhachHangEditor.valueNgayDKKD = new Date(row.ngayDkKinhDoanh.toString());
        }
        catch{ this.KhachHangEditor.valueNgayDKKD = new Date(); }
        this.KhachHangEditor.editorModal.show();
    }
    viewKhachHang(row: KhachHang) {
        this.KhachHangEditor.tenkhachhangdoanhnghiep = "- " + row.tenCongTy;
        this.editingRowName = { name: row.tenCongTy };
        this.sourcekhachhang = row;
        this.KhachHangEditor.quoctich = this.quoctich
        this.KhachHangEditor.nganhang = this.nganhang;
        this.khachhangEdit = this.KhachHangEditor.editKhachHang(row);
        this.KhachHangEditor.isViewDetails = true;
        try {
            this.KhachHangEditor.valueNgayDKKD = new Date(row.ngayDkKinhDoanh.toString());
        }
        catch{ this.KhachHangEditor.valueNgayDKKD = new Date(); }
        this.KhachHangEditor.editorModal.show();
    }
}