import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { NhomKhachHangService } from "../../services/nhomkhachhang.service";
import { NhomKhachHang } from "../../models/nhomkhachhang.model";
import { NhomKhachHangInfoComponent } from "./nhomkhachhang-info.component";

@Component({
    selector: "nhomkhachhang",
    templateUrl: "./nhomkhachhang.component.html",
    styleUrls: ["./nhomkhachhang.component.css"]
})

export class NhomKhachHangComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: NhomKhachHang[] = [];
    rowsCache: NhomKhachHang[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    nhomkhachhangEdit: NhomKhachHang;
    sourcenhomkhachhang: NhomKhachHang;
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

    @ViewChild('nhomkhachhangEditor')
    NhomKhachHangEditor: NhomKhachHangInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private nhomkhachhangService: NhomKhachHangService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenNhomKhachHang', name: 'Tên nhóm khách hàng'},			
            { name: 'Chức năng', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.NhomKhachHangEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.NhomKhachHangEditor.changesCancelledCallback = () => {
            this.nhomkhachhangEdit = null;
            this.sourcenhomkhachhang = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcenhomkhachhang) {
            Object.assign(this.sourcenhomkhachhang, this.nhomkhachhangEdit);
            this.nhomkhachhangEdit = null;
            this.sourcenhomkhachhang = null;
        }
        else {
            let objNhomKhachHang = new NhomKhachHang();
            Object.assign(objNhomKhachHang, this.nhomkhachhangEdit);
            this.nhomkhachhangEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objNhomKhachHang).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objNhomKhachHang);
            this.rows.splice(0, 0, objNhomKhachHang);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.nhomkhachhangService.getAllNhomKhachHang().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: NhomKhachHang[]) {
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
        this.NhomKhachHangEditor.resetForm(true);
    }

    newNhomKhachHang() {
        this.editingRowName = null;
        this.sourcenhomkhachhang = null;
        this.nhomkhachhangEdit = this.NhomKhachHangEditor.newNhomKhachHang();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.nhomKhachHangId,r.tenNhomKhachHang,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteNhomKhachHang(row: NhomKhachHang) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: NhomKhachHang) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.nhomkhachhangService.deleteNhomKhachHang(row.nhomKhachHangId)
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

    editNhomKhachHang(row: NhomKhachHang) {
        this.editingRowName = { name: row.tenNhomKhachHang };
        this.sourcenhomkhachhang = row;
        this.nhomkhachhangEdit = this.NhomKhachHangEditor.editNhomKhachHang(row);
        this.editorModal.show();
    }    
}