import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { QuocTichService } from "../../services/quoctich.service";
import { QuocTich } from "../../models/quoctich.model";
import { QuocTichInfoComponent } from "./quoctich-info.component";

@Component({
    selector: "quoctich",
    templateUrl: "./quoctich.component.html",
    styleUrls: ["./quoctich.component.css"]
})

export class QuocTichComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: QuocTich[] = [];
    rowsCache: QuocTich[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    quoctichEdit: QuocTich;
    sourcequoctich: QuocTich;
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

    @ViewChild('quoctichEditor')
    QuocTichEditor: QuocTichInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private quoctichService: QuocTichService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenNuoc', name: gT('Tên quốc gia')},
			{ prop: 'kyHieu', name: gT('Ký hiệu')},
            { name: gT('matbang.qlmb_chucnang'), width: 150, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.QuocTichEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.QuocTichEditor.changesCancelledCallback = () => {
            this.quoctichEdit = null;
            this.sourcequoctich = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcequoctich) {
            Object.assign(this.sourcequoctich, this.quoctichEdit);
            this.quoctichEdit = null;
            this.sourcequoctich = null;
        }
        else {
            let objQuocTich = new QuocTich();
            Object.assign(objQuocTich, this.quoctichEdit);
            this.quoctichEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objQuocTich).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objQuocTich);
            this.rows.splice(0, 0, objQuocTich);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.quoctichService.getAllQuocTich().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: QuocTich[]) {
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
        this.QuocTichEditor.resetForm(true);
    }

    newQuocTich() {
        this.editingRowName = null;
        this.sourcequoctich = null;
        this.quoctichEdit = this.QuocTichEditor.newQuocTich();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.quocTichId,r.tenNuoc,r.kyHieu,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteQuocTich(row: QuocTich) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: QuocTich) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.quoctichService.deleteQuocTich(row.quocTichId)
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

    editQuocTich(row: QuocTich) {
        this.editingRowName = { name: row.tenNuoc };
        this.sourcequoctich = row;
        this.quoctichEdit = this.QuocTichEditor.editQuocTich(row);
        this.editorModal.show();
    }    
}