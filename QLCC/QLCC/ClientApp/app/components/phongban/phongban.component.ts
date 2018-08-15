import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { PhongBanService } from "../../services/phongban.service";
import { PhongBan } from "../../models/phongban.model";
import { PhongBanInfoComponent } from "./phongban-info.component";
import { CumToaNha } from '../../models/cumtoanha.model';
import { ToaNha } from '../../models/toanha.model';
import { CumToaNhaService } from '../../services/cumtoanha.service';
import { ToaNhaService } from '../../services/toanha.service';

@Component({
    selector: "phongban",
    templateUrl: "./phongban.component.html",
    styleUrls: ["./phongban.component.css"]
})

export class PhongBanComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: PhongBan[] = [];
    rowsCache: PhongBan[] = [];
    cums: CumToaNha[] = [];
    toanhas: ToaNha[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    phongbanEdit: PhongBan;
    sourcephongban: PhongBan;
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

    @ViewChild('phongbanEditor')
    PhongBanEditor: PhongBanInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private phongbanService: PhongBanService, private toanhaService: ToaNhaService, private cumtoanhaService: CumToaNhaService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenPhongBan', name: gT('Tên phòng ban')},
			{ prop: 'toanha.tenKhoiNha', name: gT('Tòa nhà')},
			{ prop: 'dienGiai', name: gT('Mô tả')},
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];
        this.loadCumToaNha();
        this.loadToaNha(0);
        this.loadData(0,0);
    }
    
    ngAfterViewInit() {
        this.PhongBanEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.PhongBanEditor.changesCancelledCallback = () => {
            this.phongbanEdit = null;
            this.sourcephongban = null;
            this.editorModal.hide();
        };
    }

    loadCumToaNha() {
        this.cumtoanhaService.getAllCumToaNha().subscribe(results => this.onDataCumLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataCumLoadSuccessful(obj: CumToaNha[]) {
        this.cums = obj;
    }
    loadToaNha(s: number) {
        this.toanhaService.getToaNhaByCum(s).subscribe(results => this.onDataLoadToaNhaSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadToaNhaSuccessful(obj: ToaNha[]) {
        this.toanhas = obj;
    }

    SelectedCumValue(toanhaId: number, cumtoanhaId: number) {
        this.loadToaNha(cumtoanhaId);
        this.loadData(toanhaId, cumtoanhaId);
    }
    SelectedToaNhaValue(toanhaId: number, cumtoanhaId: number) {
        this.loadData(toanhaId, cumtoanhaId);
    }

    loadData(toanhaId: number, cumtoanhaId: number) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.phongbanService.getPhongBanByToaNha(toanhaId, cumtoanhaId).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }


    addNewToList() {
        if (this.sourcephongban) {
            Object.assign(this.sourcephongban, this.phongbanEdit);
            this.phongbanEdit = null;
            this.sourcephongban = null;
        }
        else {
            let objPhongBan = new PhongBan();
            Object.assign(objPhongBan, this.phongbanEdit);
            this.phongbanEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objPhongBan).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objPhongBan);
            this.rows.splice(0, 0, objPhongBan);
        }
    }
    
    
    onDataLoadSuccessful(obj: PhongBan[]) {
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
        this.PhongBanEditor.resetForm(true);
    }

    newPhongBan() {
        this.editingRowName = null;
        this.sourcephongban = null;
        this.phongbanEdit = this.PhongBanEditor.newPhongBan();
        this.PhongBanEditor.cums = this.cums;
        this.PhongBanEditor.toanhas = this.toanhas;
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.phongBanId,r.tenPhongBan,r.toaNhaId,r.dienGiai,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deletePhongBan(row: PhongBan) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: PhongBan) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.phongbanService.deletePhongBan(row.phongBanId)
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

    editPhongBan(row: PhongBan) {
        this.editingRowName = { name: row.tenPhongBan };
        this.sourcephongban = row;
        this.PhongBanEditor.cums = this.cums;
        this.PhongBanEditor.toanhas = this.toanhas;
        this.phongbanEdit = this.PhongBanEditor.editPhongBan(row);
        this.editorModal.show();
    }    
}