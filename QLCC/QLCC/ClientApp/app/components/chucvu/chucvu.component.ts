import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { ChucVuService } from "../../services/chucvu.service";
import { ChucVu } from "../../models/chucvu.model";
import { ChucVuInfoComponent } from "./chucvu-info.component";
import { DatePipe } from '@angular/common';

@Component({
    selector: "chucvu",
    templateUrl: "./chucvu.component.html",
    styleUrls: ["./chucvu.component.css"]
})

export class ChucVuComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: ChucVu[] = [];
    rowsCache: ChucVu[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    chucvuEdit: ChucVu;
    sourcechucvu: ChucVu;
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

    @ViewChild('dateTemplate')
    dateTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('chucvuEditor')
    ChucVuEditor: ChucVuInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private chucvuService: ChucVuService) {
    }

    ngOnInit() {
        var datePipe = new DatePipe("en-US");


        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'tenChucVu', name: gT('Tên chức vụ') },
            { prop: 'kyHieu', name: gT('Ký hiệu') },
            { name: 'Ngày nhập', cellTemplate: this.dateTemplate },
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow"}
        ];

        this.loadData();
    }

    ngAfterViewInit() {
        this.ChucVuEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.ChucVuEditor.changesCancelledCallback = () => {
            this.chucvuEdit = null;
            this.sourcechucvu = null;
            this.editorModal.hide();
        };
    }

    addNewToList() {
        if (this.sourcechucvu) {
            this.loadData();
        }
        else {
            let objChucVu = new ChucVu();
            Object.assign(objChucVu, this.chucvuEdit);
            this.chucvuEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objChucVu).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objChucVu);
            this.rows.splice(0, 0, objChucVu);
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.chucvuService.getAllChucVu().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: ChucVu[]) {
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
        this.ChucVuEditor.resetForm(true);
    }

    newChucVu() {
        this.editingRowName = null;
        this.sourcechucvu = null;
        this.chucvuEdit = this.ChucVuEditor.newChucVu();
        this.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.chucVuId, r.tenChucVu, r.kyHieu, r.dienGiai, r.nguoiNhap, r.ngayNhap, r.nguoiSua, r.ngaySua));
    }

    deleteChucVu(row: ChucVu) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: ChucVu) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.chucvuService.deleteChucVu(row.chucVuId)
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

    editChucVu(row: ChucVu) {
        this.editingRowName = { name: row.tenChucVu };
        this.sourcechucvu = row;
        this.chucvuEdit = this.ChucVuEditor.editChucVu(row);
        this.editorModal.show();
    }
}