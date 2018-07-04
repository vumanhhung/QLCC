import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoaiXeService } from '../../services/loaixe.service';
import { LoaiXeInfoComponent } from './loaixe-info.component';
import { LoaiXe } from '../../models/loaixe.model';

@Component({
    selector: "loaixe",
    templateUrl: "./loaixe.component.html",
    styleUrls: ["./loaixe.component.css"]
})

export class LoaiXeComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    column: any[] = [];
    rows: LoaiXe[] = [];
    rowsCache: LoaiXe[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    LoaiXeEdit: LoaiXe;
    sourceLoaiXe: LoaiXe;
    edittingRowName: { name: string };

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

    @ViewChild('datetimeTemplate')
    datetimeTemplate: TemplateRef<any>;

    constructor(private alertservice: AlertService, private translationservice: AppTranslationService, private loaixeservice: LoaiXeService) {

    }

    ngOnInit() {
        let gT = (key: string) => this.translationservice.getTranslation(key);
        this.column = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: "TenLoaiXe", name: gT('Tên Loại Xe') },
            { prop: "KyHieu", name: gT('Ký Hiệu') },
            { prop: "NguoiNhap", name: gT('Người Nhập') },
            { name: gT('Ngày Nhập'), cellTemplate: this.datetimeTemplate },
            { prop: "NguoiSua", name: gT('Người Sửa') },
            { name: gT('Ngày Sửa'), cellTemplate: this.datetimeTemplate },
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];
        this.loadData();
    }

    ngAfterViewInit() {
        this.LoaiXeEditor.changesSavedCallback = () => {
            this.addtoList();
            this.editorModal.hide();
        };
        this.LoaiXeEditor.changesCancelledCallback = () => {
            this.sourceLoaiXe = null;
            this.LoaiXeEdit = null;
            this.editorModal.hide();
        };
    }

    addtoList() {
        if (this.sourceLoaiXe) {
            Object.assign(this.sourceLoaiXe, this.LoaiXeEdit);
            this.LoaiXeEdit = null;
            this.sourceLoaiXe = null;
        } else {
            let objloaixe = new LoaiXe();
            Object.assign(objloaixe, this.LoaiXeEdit);
            this.LoaiXeEdit = null;

            let maxindex = 0;
            for (let u of this.rowsCache) {
                if (<any>u > maxindex) {
                    maxindex = (<any>u).index;
                } 
            }
            (<any>objloaixe).index = maxindex + 1;
            this.rowsCache.splice(0, 0, objloaixe);
            this.rows.splice(0, 0, objloaixe);
        }
    }

    loadData() {
        this.alertservice.stopLoadingMessage();
        this.loadingIndicator = false;
        this.loaixeservice.getAllLoaiXe().subscribe(result => this.onSuccessfully(result), error => this.onFailed(error));
    }

    onSuccessfully(obj: LoaiXe[]) {
        this.alertservice.stopLoadingMessage();
        this.loadingIndicator = false;
        obj.forEach((item, index, obj) => {
            (<any>item).index = index + 1;
        })
        this.rowsCache = [...obj];
        this.rows = obj;
    }

    onFailed(error: any) {
        this.alertservice.stopLoadingMessage();
        this.loadingIndicator = false;
        this.alertservice.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    onEditFormHidden() {
        this.edittingRowName = null;
        this.LoaiXeEditor.resetForm(true);
    }

    newLoaiXe() {
        this.edittingRowName = null;
        this.sourceLoaiXe = null;
        this.LoaiXeEdit = this.LoaiXeEditor.newLoaiXe();
        this.editorModal.show();
    }

    selectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.kyHieu, r.nguoiNhap, r.nguoiSua));
    }

    deleteLoaiXe(row: LoaiXe) {
        this.alertservice.showDialog("Bạn muốn xóa thông tin về loại xe này", DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: LoaiXe) {
        this.alertservice.startLoadingMessage("Đang thực hiện thao tác ...");
        this.loadingIndicator = true;
        this.loaixeservice.deleteLoaixe(row.loaiXeId)
            .subcribe(result => {
                this.alertservice.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item != row);
                this.rows = this.rows.filter(item => item != row);
                this.alertservice.showMessage("Thành công", "Xóa thành công !", MessageSeverity.success);
            }, error => {
                this.alertservice.stopLoadingMessage();
                this.loadingIndicator = false;
                this.alertservice.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }

    editLoaiXe(row: LoaiXe) {
        this.edittingRowName = { name: row.tenLoaiXe };
        this.sourceLoaiXe = row;
        this.LoaiXeEdit = this.LoaiXeEditor.editLoaiXe(row);
        this.editorModal.show();
    }
}