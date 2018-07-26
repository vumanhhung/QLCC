import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { LoaiXeService } from "../../services/loaixe.service";
import { LoaiXe } from "../../models/loaixe.model";
import { LoaiXeInfoComponent } from "./loaixe-info.component";

@Component({
    selector: "loaixe",
    templateUrl: "./loaixe.component.html",
    styleUrls: ["./loaixe.component.css"]
})

export class LoaiXeComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: LoaiXe[] = [];
    rowsCache: LoaiXe[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    loaixeEdit: LoaiXe;
    sourceloaixe: LoaiXe;
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

    @ViewChild('loaixeEditor')
    LoaiXeEditor: LoaiXeInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private loaixeService: LoaiXeService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenLoaiXe', name: gT('TenLoaiXe')},
			{ prop: 'kyHieu', name: gT('KyHieu')},
			{ prop: 'nguoiNhap', name: gT('NguoiNhap')},
			{ prop: 'ngayNhap', name: gT('NgayNhap')},
			{ prop: 'nguoiSua', name: gT('NguoiSua')},
			{ prop: 'ngaySua', name: gT('NgaySua')},
            { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.LoaiXeEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.LoaiXeEditor.changesCancelledCallback = () => {
            this.loaixeEdit = null;
            this.sourceloaixe = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourceloaixe) {
            Object.assign(this.sourceloaixe, this.loaixeEdit);
            this.loaixeEdit = null;
            this.sourceloaixe = null;
        }
        else {
            let objLoaiXe = new LoaiXe();
            Object.assign(objLoaiXe, this.loaixeEdit);
            this.loaixeEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objLoaiXe).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objLoaiXe);
            this.rows.splice(0, 0, objLoaiXe);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.loaixeService.getAllLoaiXe().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: LoaiXe[]) {
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
        this.LoaiXeEditor.resetForm(true);
    }

    newLoaiXe() {
        this.editingRowName = null;
        this.sourceloaixe = null;
        this.loaixeEdit = this.LoaiXeEditor.newLoaiXe();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.loaiXeId,r.tenLoaiXe,r.kyHieu,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteLoaiXe(row: LoaiXe) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: LoaiXe) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.loaixeService.deleteLoaiXe(row.loaiXeId)
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

    editLoaiXe(row: LoaiXe) {
        this.editingRowName = { name: row.tenLoaiXe };
        this.sourceloaixe = row;
        this.loaixeEdit = this.LoaiXeEditor.editLoaiXe(row);
        this.editorModal.show();
    }    
}