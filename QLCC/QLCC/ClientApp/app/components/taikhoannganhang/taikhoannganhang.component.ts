import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { TaiKhoanNganHangService } from "../../services/taikhoannganhang.service";
import { TaiKhoanNganHang } from "../../models/taikhoannganhang.model";
import { TaiKhoanNganHangInfoComponent } from "./taikhoannganhang-info.component";
import { NganHang } from '../../models/nganhang.model';
import { NganHangService } from '../../services/nganhang.service';

@Component({
    selector: "taikhoannganhang",
    templateUrl: "./taikhoannganhang.component.html",
    styleUrls: ["./taikhoannganhang.component.css"]
})

export class TaiKhoanNganHangComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    nganhang: NganHang[] = [];
    rows: TaiKhoanNganHang[] = [];
    rowsCache: TaiKhoanNganHang[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    taikhoannganhangEdit: TaiKhoanNganHang;
    sourcetaikhoannganhang: TaiKhoanNganHang;
    editingRowName: { name: string };

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

    @ViewChild('taikhoannganhangEditor')
    TaiKhoanNganHangEditor: TaiKhoanNganHangInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private taikhoannganhangService: TaiKhoanNganHangService, private nganhangService: NganHangService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'chuTaiKhoan', name: gT('Chủ tài khoản')},
			{ prop: 'soTaiKhoan', name: gT('Số tài khoản')},
			{ prop: 'nganhang.tenNganHang', name: gT('Ngân hàng')},
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];
        this.nganhangService.getAllNganHang().subscribe(results => this.onDataNganHangLoadSuccessful(results), error => this.onDataLoadFailed(error));
        this.loadData(0);
    }
    onDataNganHangLoadSuccessful(obj: NganHang[]) {
        this.nganhang = obj;
    }
    ngAfterViewInit() {
        this.TaiKhoanNganHangEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.TaiKhoanNganHangEditor.changesCancelledCallback = () => {
            this.taikhoannganhangEdit = null;
            this.sourcetaikhoannganhang = null;
            this.editorModal.hide();
        };
    }

    SelectedNganHangValue(value: number) {
        this.loadData(value);
    }

    addNewToList() {
        if (this.sourcetaikhoannganhang) {
            Object.assign(this.sourcetaikhoannganhang, this.taikhoannganhangEdit);
            this.taikhoannganhangEdit = null;
            this.sourcetaikhoannganhang = null;
        }
        else {
            let objTaiKhoanNganHang = new TaiKhoanNganHang();
            Object.assign(objTaiKhoanNganHang, this.taikhoannganhangEdit);
            this.taikhoannganhangEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objTaiKhoanNganHang).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objTaiKhoanNganHang);
            this.rows.splice(0, 0, objTaiKhoanNganHang);
        }
    }
    
    loadData(nganhang:number) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.taikhoannganhangService.getTaiKhoanNganHangByNganHang(nganhang).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: TaiKhoanNganHang[]) {
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
        this.TaiKhoanNganHangEditor.resetForm(true);
    }

    newTaiKhoanNganHang() {
        this.editingRowName = null;
        this.sourcetaikhoannganhang = null;
        this.TaiKhoanNganHangEditor.nganhang = this.nganhang;    
        this.taikhoannganhangEdit = this.TaiKhoanNganHangEditor.newTaiKhoanNganHang();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.taiKhoanNganHangId,r.chuTaiKhoan,r.soTaiKhoan,r.nganHangId,r.dienGiai,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteTaiKhoanNganHang(row: TaiKhoanNganHang) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: TaiKhoanNganHang) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.taikhoannganhangService.deleteTaiKhoanNganHang(row.taiKhoanNganHangId)
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

    editTaiKhoanNganHang(row: TaiKhoanNganHang) {
        this.editingRowName = { name: row.soTaiKhoan };
        this.sourcetaikhoannganhang = row;
        this.taikhoannganhangEdit = this.TaiKhoanNganHangEditor.editTaiKhoanNganHang(row);
        this.TaiKhoanNganHangEditor.nganhang = this.nganhang;
        this.editorModal.show();
    }    
}