import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { CongThucNuocService } from "../../services/congthucnuoc.service";
import { CongThucNuoc } from "../../models/congthucnuoc.model";
import { CongThucNuocInfoComponent } from "./congthucnuoc-info.component";
import { DinhMucNuoc } from '../../models/dinhmucnuoc.model';
import { DinhMucNuocComponent } from './dinhmucnuoc.component';

@Component({
    selector: "congthucnuoc",
    templateUrl: "./congthucnuoc.component.html",
    styleUrls: ["./congthucnuoc.component.css"]
})

export class CongThucNuocComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: CongThucNuoc[] = [];
    rowsCache: CongThucNuoc[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    congthucnuocEdit: CongThucNuoc;
    sourcecongthucnuoc: CongThucNuoc;
    dinhmucnuocEdit: DinhMucNuoc;
    sourcedinhmucnuoc: DinhMucNuoc;
    editingRowName: { name: string };

    @ViewChild('f')
    private form;

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('nameTemplate')
    nameTemplate: TemplateRef<any>;

    @ViewChild('descriptionTemplate')
    descriptionTemplate: TemplateRef<any>;

    @ViewChild('statusTemplate')
    statusTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('congthucnuocEditor')
    CongThucNuocEditor: CongThucNuocInfoComponent;

    @ViewChild('dinhmucnuocEditor')
    DinhMucNuocEditor: DinhMucNuocComponent;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private congthucnuocService: CongThucNuocService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
            { prop: 'tenCongThucNuoc', name: gT('Tên công thức nước')},
            { prop: 'dienGiai', name: gT('Diễn giải') },
            { prop: 'status', name: gT('Trạng thái'), cellTemplate: this.statusTemplate },
            { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.CongThucNuocEditor.changesSavedCallback = () => {            
            this.addNewToList();
            this.CongThucNuocEditor.editorModal.hide();            
        };

        this.CongThucNuocEditor.changesCancelledCallback = () => {
            this.congthucnuocEdit = null;
            this.sourcecongthucnuoc = null;
            this.CongThucNuocEditor.editorModal.hide();            
        };

        this.DinhMucNuocEditor.changesSavedCallback = () => {
            this.DinhMucNuocEditor.dinhmucModal.hide();
        };

        this.DinhMucNuocEditor.changesCancelledCallback = () => {
            this.DinhMucNuocEditor.dinhmucModal.hide();
        }
    }
    
    addNewToList() {
        this.loadData();
        if (this.sourcecongthucnuoc) {
            Object.assign(this.sourcecongthucnuoc, this.congthucnuocEdit);
            this.congthucnuocEdit = null;
            this.sourcecongthucnuoc = null;
        }
        else {
            let objCongThucNuoc = new CongThucNuoc();
            Object.assign(objCongThucNuoc, this.congthucnuocEdit);
            this.congthucnuocEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objCongThucNuoc).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objCongThucNuoc);
            this.rows.splice(0, 0, objCongThucNuoc);
        }
    }
    
    loadData() {        
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.congthucnuocService.getAllCongThucNuoc().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: CongThucNuoc[]) {
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
        this.CongThucNuocEditor.resetForm(true);
    }

    newCongThucNuoc() {
        this.editingRowName = null;
        this.sourcecongthucnuoc = null;
        this.congthucnuocEdit = this.CongThucNuocEditor.newCongThucNuoc();
        this.CongThucNuocEditor.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.tenCongThucNuoc, r.dienGiai, r.status));
    }

    deleteCongThucNuoc(row: CongThucNuoc) {
        if (row.status == true) {
            this.alertService.showMessage("Lỗi thao tác",'Không thể xóa bản ghi hiện tại đang hoạt động!', MessageSeverity.error);
        } else {
            this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
        }
    }
    
    deleteHelper(row: CongThucNuoc) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.congthucnuocService.deleteCongThucNuoc(row.congThucNuocId)
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

    editCongThucNuoc(row: CongThucNuoc) {
        this.editingRowName = { name: row.tenCongThucNuoc };
        this.sourcecongthucnuoc = row;
        this.congthucnuocEdit = this.CongThucNuocEditor.editCongThucNuoc(row);
        this.CongThucNuocEditor.editorModal.show();
    }

    configDinhMucNuoc(row: CongThucNuoc) {
        this.dinhmucnuocEdit = this.DinhMucNuocEditor.loadCongthucNuoc(row);
        this.DinhMucNuocEditor.isNew = true;
        this.DinhMucNuocEditor.dinhmucModal.show();
    }  
}