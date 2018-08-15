import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { NhaCungCapService } from "../../services/nhacungcap.service";
import { NhaCungCap } from "../../models/nhacungcap.model";
import { NhaCungCapInfoComponent } from "./nhacungcap-info.component";

@Component({
    selector: "nhacungcap",
    templateUrl: "./nhacungcap.component.html",
    styleUrls: ["./nhacungcap.component.css"]
})

export class NhaCungCapComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: NhaCungCap[] = [];
    rowsCache: NhaCungCap[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    nhacungcapEdit: NhaCungCap;
    sourcenhacungcap: NhaCungCap;
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

    @ViewChild('nhacungcapEditor')
    NhaCungCapEditor: NhaCungCapInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private nhacungcapService: NhaCungCapService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 50, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenNhaCungCap', name: gT('Tên nhà cung cấp'),width:200},
			{ prop: 'dienGiai', name: gT('Giới thiệu'),width:400},
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass : "overflow" }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.NhaCungCapEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.NhaCungCapEditor.changesCancelledCallback = () => {
            this.nhacungcapEdit = null;
            this.sourcenhacungcap = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcenhacungcap) {
            Object.assign(this.sourcenhacungcap, this.nhacungcapEdit);
            this.nhacungcapEdit = null;
            this.sourcenhacungcap = null;
        }
        else {
            let objNhaCungCap = new NhaCungCap();
            Object.assign(objNhaCungCap, this.nhacungcapEdit);
            this.nhacungcapEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objNhaCungCap).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objNhaCungCap);
            this.rows.splice(0, 0, objNhaCungCap);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.nhacungcapService.getAllNhaCungCap().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: NhaCungCap[]) {
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
        this.NhaCungCapEditor.resetForm(true);
    }

    newNhaCungCap() {
        this.editingRowName = null;
        this.sourcenhacungcap = null;
        this.nhacungcapEdit = this.NhaCungCapEditor.newNhaCungCap();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.nhaCungCapId,r.tenNhaCungCap,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteNhaCungCap(row: NhaCungCap) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: NhaCungCap) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.nhacungcapService.deleteNhaCungCap(row.nhaCungCapId)
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

    editNhaCungCap(row: NhaCungCap) {
        this.editingRowName = { name: row.tenNhaCungCap };
        this.sourcenhacungcap = row;
        this.nhacungcapEdit = this.NhaCungCapEditor.editNhaCungCap(row);
        this.editorModal.show();
    }    
}