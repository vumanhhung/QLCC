import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { ToaNhaService } from "../../services/toanha.service";
import { ToaNha } from "../../models/toanha.model";
import { ToaNhaInfoComponent } from "./toanha-info.component";
import { CumToaNhaService } from "../../services/cumtoanha.service";
import { CumToaNha } from "../../models/cumtoanha.model";

@Component({
    selector: "toanha",
    templateUrl: "./toanha.component.html",
    styleUrls: ["./toanha.component.css"]
})

export class ToaNhaComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    cums: CumToaNha[] = [];
    columns: any[] = [];
    rows: ToaNha[] = [];
    rowsCache: ToaNha[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    toanhaEdit: ToaNha;
    sourcetoanha: ToaNha;
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


    @ViewChild('toanhaEditor')
    ToaNhaEditor: ToaNhaInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private toanhaService: ToaNhaService, private cumtoanhaService: CumToaNhaService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              			
			{ prop: 'tenKhoiNha', name: gT('Tên tòa nhà')},
			{ prop: 'tenVietTat', name: gT('Tên viết tắt')},
			{ prop: 'maKhoiNha', name: gT('Mã tòa nhà')},
			{ prop: 'dienGiai', name: gT('Mô tả')},
            { name: gT('matbang.qlmb_chucnang'), width: 110, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];
        this.cumtoanhaService.getAllCumToaNha().subscribe(results => this.onDataCumLoadSuccessful(results), error => this.onDataLoadFailed(error));
        this.loadData(0);
    }
    
    ngAfterViewInit() {
        this.ToaNhaEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.ToaNhaEditor.editorModal.hide();
        };

        this.ToaNhaEditor.changesCancelledCallback = () => {
            this.toanhaEdit = null;
            this.sourcetoanha = null;
            this.ToaNhaEditor.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcetoanha) {
            Object.assign(this.sourcetoanha, this.toanhaEdit);
            this.toanhaEdit = null;
            this.sourcetoanha = null;
        }
        else {
            let objToaNha = new ToaNha();
            Object.assign(objToaNha, this.toanhaEdit);
            this.toanhaEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objToaNha).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objToaNha);
            this.rows.splice(0, 0, objToaNha);
        }
    }

    SelectedGroupValue(value: number) {
        this.loadData(value);
    }

    loadData(cum: number) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;        
        this.toanhaService.getToaNhaByCum(cum).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataCumLoadSuccessful(obj: CumToaNha[]) {
        this.cums = obj; 
    }

    onDataLoadSuccessful(obj: ToaNha[]) {
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
        this.ToaNhaEditor.resetForm(true);
    }

    newToaNha() {
        this.ToaNhaEditor.tentoanha = "";
        this.editingRowName = null;
        this.sourcetoanha = null;
        this.toanhaEdit = this.ToaNhaEditor.newToaNha();
        this.ToaNhaEditor.cums = this.cums;   
        this.ToaNhaEditor.isViewDetails = false;
        this.ToaNhaEditor.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.toaNhaId,r.cumToaNhaId,r.tenKhoiNha,r.tenVietTat,r.maKhoiNha,r.dienGiai));
    }

    deleteToaNha(row: ToaNha) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: ToaNha) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.toanhaService.deleteToaNha(row.toaNhaId)
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

    editToaNha(row: ToaNha) {
        this.ToaNhaEditor.tentoanha = "- " + row.tenKhoiNha;
        this.editingRowName = { name: row.tenKhoiNha };
        this.sourcetoanha = row;
        this.toanhaEdit = this.ToaNhaEditor.editToaNha(row);
        this.ToaNhaEditor.cums = this.cums;
        this.ToaNhaEditor.isViewDetails = false;
        this.ToaNhaEditor.editorModal.show();
    }    
    ViewToaNha(row: ToaNha) {
        this.ToaNhaEditor.tentoanha = "- " + row.tenKhoiNha
        this.editingRowName = { name: row.tenKhoiNha };
        this.sourcetoanha = row;
        this.toanhaEdit = this.ToaNhaEditor.editToaNha(row);
        this.ToaNhaEditor.cums = this.cums;
        this.ToaNhaEditor.isViewDetails = true;
        this.ToaNhaEditor.editorModal.show();
    }  
}