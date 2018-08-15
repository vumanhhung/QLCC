import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { NganHangService } from "../../services/nganhang.service";
import { NganHang } from "../../models/nganhang.model";
import { NganHangInfoComponent } from "./nganhang-info.component";

@Component({
    selector: "nganhang",
    templateUrl: "./nganhang.component.html",
    styleUrls: ["./nganhang.component.css"]
})

export class NganHangComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: NganHang[] = [];
    rowsCache: NganHang[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    nganhangEdit: NganHang;
    sourcenganhang: NganHang;
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

    @ViewChild('nganhangEditor')
    NganHangEditor: NganHangInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private nganhangService: NganHangService) {
    }

    
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenNganHang', name: gT('Tên ngân hàng')},
			{ prop: 'diaChi', name: gT('Địa chỉ')},
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.NganHangEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.NganHangEditor.changesCancelledCallback = () => {
            this.nganhangEdit = null;
            this.sourcenganhang = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcenganhang) {
            Object.assign(this.sourcenganhang, this.nganhangEdit);
            this.nganhangEdit = null;
            this.sourcenganhang = null;
        }
        else {
            let objNganHang = new NganHang();
            Object.assign(objNganHang, this.nganhangEdit);
            this.nganhangEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objNganHang).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objNganHang);
            this.rows.splice(0, 0, objNganHang);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.nganhangService.getAllNganHang().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: NganHang[]) {
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
        this.NganHangEditor.resetForm(true);
    }

    newNganHang() {
        this.editingRowName = null;
        this.sourcenganhang = null;
        this.nganhangEdit = this.NganHangEditor.newNganHang();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.nganHangId,r.tenNganHang,r.diaChi,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteNganHang(row: NganHang) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: NganHang) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.nganhangService.deleteNganHang(row.nganHangId)
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

    editNganHang(row: NganHang) {
        this.editingRowName = { name: row.tenNganHang };
        this.sourcenganhang = row;
        this.nganhangEdit = this.NganHangEditor.editNganHang(row);
        this.editorModal.show();
    }    
}