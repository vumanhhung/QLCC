import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { TrangThaiService } from "../../services/trangthai.service";
import { TrangThai } from "../../models/trangthai.model";
import { TrangThaiInfoComponent } from "./trangthai-info.component";

@Component({
    selector: "trangthai",
    templateUrl: "./trangthai.component.html",
    styleUrls: ["./trangthai.component.css"]
})

export class TrangThaiComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: TrangThai[] = [];
    rowsCache: TrangThai[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    trangthaiEdit: TrangThai;
    sourcetrangthai: TrangThai;
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

    @ViewChild('trangthaiEditor')
    TrangThaiEditor: TrangThaiInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private trangthaiService: TrangThaiService) {
    }
    SetBackground(row: TrangThai) {
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
            { prop: 'tenTrangThai', name: gT('Tên trạng thái') },
            { name: 'Màu nền', cellTemplate: this.BackGroundTemplate, canAutoResize: false },
            { prop: 'dienGiai', name: gT('Mô tả') },
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];

        this.loadData();
    }

    ngAfterViewInit() {
        this.TrangThaiEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.TrangThaiEditor.changesCancelledCallback = () => {
            this.trangthaiEdit = null;
            this.sourcetrangthai = null;
            this.editorModal.hide();
        };
    }

    addNewToList() {
        if (this.sourcetrangthai) {
            Object.assign(this.sourcetrangthai, this.trangthaiEdit);
            this.trangthaiEdit = null;
            this.sourcetrangthai = null;
        }
        else {
            let objTrangThai = new TrangThai();
            Object.assign(objTrangThai, this.trangthaiEdit);
            this.trangthaiEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objTrangThai).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objTrangThai);
            this.rows.splice(0, 0, objTrangThai);
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.trangthaiService.getAllTrangThai().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: TrangThai[]) {
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
        this.TrangThaiEditor.resetForm(true);
    }

    newTrangThai() {
        this.editingRowName = null;
        this.sourcetrangthai = null;
        this.trangthaiEdit = this.TrangThaiEditor.newTrangThai();
        this.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.trangThaiId, r.tenTrangThai, r.mauNen, r.choThue, r.dienGiai));
    }

    deleteTrangThai(row: TrangThai) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: TrangThai) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.trangthaiService.deleteTrangThai(row.trangThaiId)
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

    editTrangThai(row: TrangThai) {
        this.editingRowName = { name: row.tenTrangThai };
        this.sourcetrangthai = row;
        this.trangthaiEdit = this.TrangThaiEditor.editTrangThai(row);
        this.editorModal.show();
    }
}