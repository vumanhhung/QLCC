import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { NguonTiepNhanService } from "../../services/nguontiepnhan.service";
import { NguonTiepNhan } from "../../models/nguontiepnhan.model";
import { NguonTiepNhanInfoComponent } from "./nguontiepnhan-info.component";

@Component({
    selector: "nguontiepnhan",
    templateUrl: "./nguontiepnhan.component.html",
    styleUrls: ["./nguontiepnhan.component.css"]
})

export class NguonTiepNhanComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: NguonTiepNhan[] = [];
    rowsCache: NguonTiepNhan[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    nguontiepnhanEdit: NguonTiepNhan;
    sourcenguontiepnhan: NguonTiepNhan;
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

    @ViewChild('nguontiepnhanEditor')
    NguonTiepNhanEditor: NguonTiepNhanInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private nguontiepnhanService: NguonTiepNhanService) {
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'tenNguonTiepNhan', name: 'Tên nguồn tiếp nhận' },
            { name: 'Chức năng', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }

    ngAfterViewInit() {
        this.NguonTiepNhanEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.NguonTiepNhanEditor.changesCancelledCallback = () => {
            this.nguontiepnhanEdit = null;
            this.sourcenguontiepnhan = null;
            this.editorModal.hide();
        };
    }

    addNewToList() {
        if (this.sourcenguontiepnhan) {
            Object.assign(this.sourcenguontiepnhan, this.nguontiepnhanEdit);
            this.nguontiepnhanEdit = null;
            this.sourcenguontiepnhan = null;
        }
        else {
            let objNguonTiepNhan = new NguonTiepNhan();
            Object.assign(objNguonTiepNhan, this.nguontiepnhanEdit);
            this.nguontiepnhanEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objNguonTiepNhan).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objNguonTiepNhan);
            this.rows.splice(0, 0, objNguonTiepNhan);
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.nguontiepnhanService.getAllNguonTiepNhan().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: NguonTiepNhan[]) {
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
        this.NguonTiepNhanEditor.resetForm(true);
    }

    newNguonTiepNhan() {
        this.editingRowName = null;
        this.sourcenguontiepnhan = null;
        this.nguontiepnhanEdit = this.NguonTiepNhanEditor.newNguonTiepNhan();
        this.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.nguonTiepNhanId, r.tenNguonTiepNhan, r.nguoiNhap, r.ngayNhap, r.nguoiSua, r.ngaySua));
    }

    deleteNguonTiepNhan(row: NguonTiepNhan) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: NguonTiepNhan) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.nguontiepnhanService.deleteNguonTiepNhan(row.nguonTiepNhanId)
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

    editNguonTiepNhan(row: NguonTiepNhan) {
        this.editingRowName = { name: row.tenNguonTiepNhan };
        this.sourcenguontiepnhan = row;
        this.nguontiepnhanEdit = this.NguonTiepNhanEditor.editNguonTiepNhan(row);
        this.editorModal.show();
    }
}