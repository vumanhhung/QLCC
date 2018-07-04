import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { TangLauService } from "../../services/tanglau.service";
import { TangLau } from "../../models/tanglau.model";
import { TangLauInfoComponent } from "./tanglau-info.component";

import { CumToaNhaService } from "../../services/cumtoanha.service";
import { CumToaNha } from "../../models/cumtoanha.model";
import { ToaNhaService } from "../../services/toanha.service";
import { ToaNha } from "../../models/toanha.model";

@Component({
    selector: "tanglau",
    templateUrl: "./tanglau.component.html",
    styleUrls: ["./tanglau.component.css"]
})

export class TangLauComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    toanhas: ToaNha[];
    cums: CumToaNha[] = [];
    columns: any[] = [];
    rows: TangLau[] = [];
    rowsCache: TangLau[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    tanglauEdit: TangLau;
    sourcetanglau: TangLau;
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


    @ViewChild('tanglauEditor')
    TangLauEditor: TangLauInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private tanglauService: TangLauService
        , private cumToaNhaService: CumToaNhaService, private toaNhaService: ToaNhaService, private cumtoanhaService: CumToaNhaService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              			
            { prop: 'tenTangLau', name: gT('Tên tầng lầu'), width: 140},
            { prop: 'dienGiai', name: gT('Mô tả'),width: 150},
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];

        this.cumtoanhaService.getAllCumToaNha().subscribe(results => this.onDataCumLoadSuccessful(results), error => this.onDataLoadFailed(error));
        this.toaNhaService.getToaNhaByCum(0).subscribe(results => this.onDataToaNhaLoadSuccessful(results), error => this.onDataLoadFailed(error));
        this.loadData(0,0);
    }

    onDataToaNhaLoadSuccessful(obj: ToaNha[]) {
        this.toanhas = obj;
    }
    
    ngAfterViewInit() {
        this.TangLauEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.TangLauEditor.editorModal.hide();
        };

        this.TangLauEditor.changesCancelledCallback = () => {
            this.tanglauEdit = null;
            this.sourcetanglau = null;
            this.TangLauEditor.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcetanglau) {
            Object.assign(this.sourcetanglau, this.tanglauEdit);
            this.tanglauEdit = null;
            this.sourcetanglau = null;
        }
        else {
            let objTangLau = new TangLau();
            Object.assign(objTangLau, this.tanglauEdit);
            this.tanglauEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objTangLau).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objTangLau);
            this.rows.splice(0, 0, objTangLau);
        }
    }

    onDataCumLoadSuccessful(obj: CumToaNha[]) {
        this.cums = obj;
    }

    SelectedGroupValue(value: number) {
        this.loadData(value,0);
    }

    SelectedCumValue(toanha: number, cumtoanha: number) {
        this.loadData(toanha, cumtoanha);
        this.toaNhaService.getToaNhaByCum(cumtoanha).subscribe(results => this.onDataToaNhaLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    loadData(toanha: number,cumtoanha:number) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.tanglauService.getTangLauByToaNha(toanha, cumtoanha).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: TangLau[]) {
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
        this.TangLauEditor.resetForm(true);
    }

    newTangLau() {
        this.TangLauEditor.tenanglau = "";
        this.editingRowName = null;
        this.sourcetanglau = null;
        this.tanglauEdit = this.TangLauEditor.newTangLau();
        this.TangLauEditor.toanhas = this.toanhas;
        this.TangLauEditor.cums = this.cums;
        this.TangLauEditor.isViewDetails = false;
        this.TangLauEditor.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.tangLauId,r.toaNhaId,r.tenTangLau,r.dienGiai));
    }

    deleteTangLau(row: TangLau) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: TangLau) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.tanglauService.deleteTangLau(row.tangLauId)
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

    editTangLau(row: TangLau) {
        this.TangLauEditor.tenanglau = "- " + row.tenTangLau;
        this.editingRowName = { name: row.tenTangLau };
        this.sourcetanglau = row;
        this.tanglauEdit = this.TangLauEditor.editTangLau(row);
        this.TangLauEditor.toanhas = this.toanhas;
        this.TangLauEditor.cums = this.cums;
        this.TangLauEditor.isViewDetails = false;
        this.TangLauEditor.editorModal.show();
    }    
    ViewTangLau(row: TangLau) {
        this.TangLauEditor.tenanglau = "- " + row.tenTangLau;
        this.editingRowName = { name: row.tenTangLau };
        this.sourcetanglau = row;
        this.tanglauEdit = this.TangLauEditor.editTangLau(row);
        this.TangLauEditor.toanhas = this.toanhas;
        this.TangLauEditor.cums = this.cums;
        this.TangLauEditor.isViewDetails = true;
        this.TangLauEditor.editorModal.show();
    } 
}