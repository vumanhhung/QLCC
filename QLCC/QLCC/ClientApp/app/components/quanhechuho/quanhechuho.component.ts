import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { QuanHeChuHoService } from "../../services/quanhechuho.service";
import { QuanHeChuHo } from "../../models/quanhechuho.model";
import { QuanHeChuHoInfoComponent } from "./quanhechuho-info.component";

@Component({
    selector: "quanhechuho",
    templateUrl: "./quanhechuho.component.html",
    styleUrls: ["./quanhechuho.component.css"]
})

export class QuanHeChuHoComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: QuanHeChuHo[] = [];
    rowsCache: QuanHeChuHo[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    quanhechuhoEdit: QuanHeChuHo;
    sourcequanhechuho: QuanHeChuHo;
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

    @ViewChild('quanhechuhoEditor')
    QuanHeChuHoEditor: QuanHeChuHoInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private quanhechuhoService: QuanHeChuHoService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenQuanHeChuHo', name: 'Quan hệ chủ hộ'},			
            { name: 'Chức năng', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.QuanHeChuHoEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.QuanHeChuHoEditor.changesCancelledCallback = () => {
            this.quanhechuhoEdit = null;
            this.sourcequanhechuho = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcequanhechuho) {
            Object.assign(this.sourcequanhechuho, this.quanhechuhoEdit);
            this.quanhechuhoEdit = null;
            this.sourcequanhechuho = null;
        }
        else {
            let objQuanHeChuHo = new QuanHeChuHo();
            Object.assign(objQuanHeChuHo, this.quanhechuhoEdit);
            this.quanhechuhoEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objQuanHeChuHo).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objQuanHeChuHo);
            this.rows.splice(0, 0, objQuanHeChuHo);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.quanhechuhoService.getAllQuanHeChuHo().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: QuanHeChuHo[]) {
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
        this.QuanHeChuHoEditor.resetForm(true);
    }

    newQuanHeChuHo() {
        this.editingRowName = null;
        this.sourcequanhechuho = null;
        this.quanhechuhoEdit = this.QuanHeChuHoEditor.newQuanHeChuHo();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.quanHeChuHoId,r.tenQuanHeChuHo,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteQuanHeChuHo(row: QuanHeChuHo) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: QuanHeChuHo) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.quanhechuhoService.deleteQuanHeChuHo(row.quanHeChuHoId)
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

    editQuanHeChuHo(row: QuanHeChuHo) {
        this.editingRowName = { name: row.tenQuanHeChuHo };
        this.sourcequanhechuho = row;
        this.quanhechuhoEdit = this.QuanHeChuHoEditor.editQuanHeChuHo(row);
        this.editorModal.show();
    }    
}