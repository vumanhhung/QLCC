import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { CumToaNhaService } from "../../services/cumtoanha.service";
import { ToaNhaService } from "../../services/toanha.service";
import { CumToaNha } from "../../models/cumtoanha.model";
import { ToaNha } from "../../models/toanha.model";
import { CumToaNhaInfoComponent } from "./cumtoanha-info.component";

@Component({
    selector: "cumtoanha",
    templateUrl: "./cumtoanha.component.html",
    styleUrls: ["./cumtoanha.component.css"]
})

export class CumToaNhaComponent implements OnInit, AfterViewInit {
    public limit: number = 10;    
    items: ToaNha[] = [];
    groups: CumToaNha[] = [];
    columns: any[] = [];
    rows: CumToaNha[] = [];
    rowsCache: CumToaNha[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    cumtoanhaEdit: CumToaNha;
    sourcecumtoanha: CumToaNha;
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


    @ViewChild('cumtoanhaEditor')
    CumToaNhaEditor: CumToaNhaInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private cumtoanhaService: CumToaNhaService, private toanhaService: ToaNhaService) {
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'tenCumToaNha', name: gT('Tên cụm') },
            { prop: 'tenVietTat', name: gT('Tên viết tắt') },            
            { prop: 'diaChi', name: gT('Địa chỉ') },
            { prop: 'nguoiQuanLy', name: gT('Người quản lý') },                        
            { name: gT('matbang.qlmb_chucnang'), width: 110, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow"}
        ];

        this.loadData();
        this.loadItem(0);
    }

    ngAfterViewInit() {
        this.CumToaNhaEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.CumToaNhaEditor.editorModal.hide();
        };

        this.CumToaNhaEditor.changesCancelledCallback = () => {
            this.cumtoanhaEdit = null;
            this.sourcecumtoanha = null;
            this.CumToaNhaEditor.editorModal.hide();
        };
    }

    addNewToList() {
        if (this.sourcecumtoanha) {
            Object.assign(this.sourcecumtoanha, this.cumtoanhaEdit);
            this.cumtoanhaEdit = null;
            this.sourcecumtoanha = null;
        }
        else {
            let objCumToaNha = new CumToaNha();
            Object.assign(objCumToaNha, this.cumtoanhaEdit);
            this.cumtoanhaEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objCumToaNha).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objCumToaNha);
            this.rows.splice(0, 0, objCumToaNha);
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.cumtoanhaService.getAllCumToaNha().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    loadItem(s: number) {
        this.toanhaService.getToaNhaByCum(s).subscribe(results => this.onDataLoadItemSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadItemSuccessful(obj: ToaNha[]) {        
        this.items = obj;
    }

    SelectedGroupValue(value: number) {
        this.loadItem(value);
    }

    onDataLoadSuccessful(obj: CumToaNha[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        obj.forEach((item, index, obj) => {
            (<any>item).index = index + 1;
        });

        this.rowsCache = [...obj];
        this.rows = obj;
        this.groups = obj;
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }


    newCumToaNha() {
        this.CumToaNhaEditor.tencumtoanha = "";
        this.editingRowName = null;
        this.sourcecumtoanha = null;
        this.cumtoanhaEdit = this.CumToaNhaEditor.newCumToaNha();
        this.CumToaNhaEditor.isViewDetails = false;
        this.CumToaNhaEditor.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.cumToaNhaId, r.tenCumToaNha, r.tenVietTat, r.mST, r.sDT, r.fax, r.email, r.diaChi, r.nguoiQuanLy, r.sTK, r.nganHang, r.logo, r.tenNguoiNhan));
    }

    deleteCumToaNha(row: CumToaNha) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: CumToaNha) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.cumtoanhaService.deleteCumToaNha(row.cumToaNhaId)
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

    editCumToaNha(row: CumToaNha) {
        this.CumToaNhaEditor.tencumtoanha = "- " + row.tenCumToaNha;
        this.editingRowName = { name: row.tenCumToaNha };
        this.sourcecumtoanha = row;
        this.cumtoanhaEdit = this.CumToaNhaEditor.editCumToaNha(row);
        this.CumToaNhaEditor.isViewDetails = false;
        this.CumToaNhaEditor.editorModal.show();
    }
    viewCumToaNha(row: CumToaNha) {
        this.CumToaNhaEditor.tencumtoanha = "- " + row.tenCumToaNha;
        if (row.logo.length > 0) {
            this.CumToaNhaEditor.isdisplayImage = true;
        }
        this.editingRowName = { name: row.tenCumToaNha };
        this.sourcecumtoanha = row;
        this.cumtoanhaEdit = this.CumToaNhaEditor.editCumToaNha(row);
        this.CumToaNhaEditor.isViewDetails = true;
        this.CumToaNhaEditor.editorModal.show();
    }
}