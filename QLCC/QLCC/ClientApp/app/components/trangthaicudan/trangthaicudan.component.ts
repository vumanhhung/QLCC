import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { TrangThaiCuDanService } from "../../services/trangthaicudan.service";
import { TrangThaiCuDan } from "../../models/trangthaicudan.model";
import { TrangThaiCuDanInfoComponent } from "./trangthaicudan-info.component";

@Component({
    selector: "trangthaicudan",
    templateUrl: "./trangthaicudan.component.html",
    styleUrls: ["./trangthaicudan.component.css"]
})

export class TrangThaiCuDanComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: TrangThaiCuDan[] = [];
    rowsCache: TrangThaiCuDan[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    trangthaicudanEdit: TrangThaiCuDan;
    sourcetrangthaicudan: TrangThaiCuDan;
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

    @ViewChild('BackGroundTemplate')
    BackGroundTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('trangthaicudanEditor')
    TrangThaiCuDanEditor: TrangThaiCuDanInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private trangthaicudanService: TrangThaiCuDanService) {
    }

    SetBackground(row: TrangThaiCuDan) {
        let styles = {
            'background': row.mauNen,
            'width': '130px',
            'height': '30px',
            'text-align': 'center'
        };
        return styles;
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenTrangThaiCuDan', name: 'Tên trạng thái'},
            { name: 'Màu nền', cellTemplate: this.BackGroundTemplate, canAutoResize: false },	
            { name: 'Chức năng', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.TrangThaiCuDanEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.TrangThaiCuDanEditor.changesCancelledCallback = () => {
            this.trangthaicudanEdit = null;
            this.sourcetrangthaicudan = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcetrangthaicudan) {
            Object.assign(this.sourcetrangthaicudan, this.trangthaicudanEdit);
            this.trangthaicudanEdit = null;
            this.sourcetrangthaicudan = null;
        }
        else {
            let objTrangThaiCuDan = new TrangThaiCuDan();
            Object.assign(objTrangThaiCuDan, this.trangthaicudanEdit);
            this.trangthaicudanEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objTrangThaiCuDan).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objTrangThaiCuDan);
            this.rows.splice(0, 0, objTrangThaiCuDan);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.trangthaicudanService.getAllTrangThaiCuDan().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: TrangThaiCuDan[]) {
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
        this.TrangThaiCuDanEditor.resetForm(true);
    }

    newTrangThaiCuDan() {
        this.editingRowName = null;
        this.sourcetrangthaicudan = null;
        this.trangthaicudanEdit = this.TrangThaiCuDanEditor.newTrangThaiCuDan();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.trangThaiCuDanId,r.tenTrangThaiCuDan,r.mauNen,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteTrangThaiCuDan(row: TrangThaiCuDan) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: TrangThaiCuDan) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.trangthaicudanService.deleteTrangThaiCuDan(row.trangThaiCuDanId)
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

    editTrangThaiCuDan(row: TrangThaiCuDan) {
        this.editingRowName = { name: row.tenTrangThaiCuDan };
        this.sourcetrangthaicudan = row;
        this.trangthaicudanEdit = this.TrangThaiCuDanEditor.editTrangThaiCuDan(row);
        this.editorModal.show();
    }    
}