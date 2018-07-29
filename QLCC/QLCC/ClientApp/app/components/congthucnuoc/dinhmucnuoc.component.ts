import { Component, OnInit, ViewChild, Input, TemplateRef } from '@angular/core';

import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DinhMucNuoc } from '../../models/dinhmucnuoc.model';
import { DinhMucNuocService } from '../../services/dinhmucnuoc.service';
import { CongThucNuoc } from '../../models/congthucnuoc.model';
import { AppTranslationService } from '../../services/app-translation.service';

@Component({
    selector: "dinhmucnuoc",
    templateUrl: "./dinhmucnuoc.component.html",
    styleUrls: ["./dinhmucnuoc.component.css"]
})

export class DinhMucNuocComponent implements OnInit {
    public isNew = false;
    private isSaving = false;
    private checkbox: boolean = false;
    columns: any[] = [];
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private DinhMucNuocEdit: DinhMucNuoc = new DinhMucNuoc();
    private loadingIndicator: boolean;
    rows: DinhMucNuoc[] = [];
    rowsCache: DinhMucNuoc[] = [];
    rowCongthucnuoc: CongThucNuoc = new CongThucNuoc();
    tenCongThucNuoc: string = "";
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    gia: string = "0";

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('nameTemplate')
    nameTemplate: TemplateRef<any>;

    @ViewChild('statusTemplate')
    statusTemplate: TemplateRef<any>;

    @ViewChild('giaTemplate')
    giaTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('f')
    private form;

    @ViewChild('dinhmucModal')
    dinhmucModal: ModalDirective;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private gvService: DinhMucNuocService) {
    }

    ngOnInit() {
        if (this.isGeneralEditor) {
            let gT = (key: string) => this.translationService.getTranslation(key);
            this.columns = [
                { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
                { prop: 'tenDinhMucNuoc', name: gT('Tên định mức nước'), canAutoResize: true },
                { prop: 'soDau', name: gT('Số đầu') },
                { prop: 'soCuoi', name: gT('Số cuối') },
                { prop: 'gia', name: gT('Giá'), cellTemplate: this.giaTemplate },
                { prop: 'dienGiai', name: gT('Diễn giải') },
                { name: '', width: 70, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
            ];
        }
    }

    loadData() {
        this.gvService.getAllDinhMucNuoc(this.rowCongthucnuoc.congThucNuocId).subscribe(result => this.onDataLoadSuccessful(result), error => this.onDataLoadFailed(error));
    }

    loadCongthucNuoc(row: CongThucNuoc) {
        this.rowCongthucnuoc = row;
        this.tenCongThucNuoc = row.tenCongThucNuoc;
        this.DinhMucNuocEdit.congThucNuocId = row.congThucNuocId;
        this.loadData();
        this.newDinhMucNuoc();
        return this.DinhMucNuocEdit;
    }

    onDataLoadSuccessful(obj: DinhMucNuoc[]) {
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

    resetForm(replace = false) {

        if (!replace) {
            this.form.reset();
        }
        else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }

    private cancel() {
        this.DinhMucNuocEdit = new DinhMucNuoc();
        this.showValidationErrors = false;
        //this.resetForm();
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    newDinhMucNuoc() {

        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        //console.log(this.DinhMucNuocEdit.congThucNuocId);
        this.formatPrice(this.gia);
        this.gvService.getMax(this.rowCongthucnuoc.congThucNuocId).subscribe(result => {
            if (result == 0) {
                this.DinhMucNuocEdit.soDau = 0;
            } else {
                this.DinhMucNuocEdit.soDau = result;
            }
        })
        this.edit();
        //this.DinhMucNuocEdit.congThucNuocId = 

        return this.DinhMucNuocEdit;
    }

    editDinhMucNuoc(obj: DinhMucNuoc) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            //this.isEdit = true;
            this.editingRowName = obj.tenDinhMucNuoc;            
            this.DinhMucNuocEdit = new DinhMucNuoc();
            Object.assign(this.DinhMucNuocEdit, obj);
            this.gia = this.formatPrice(this.DinhMucNuocEdit.gia.toString());
            this.edit();
            return this.DinhMucNuocEdit;
        } else {
            return this.newDinhMucNuoc();
        }
    }

    private edit() {
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private save() {
        if (this.gia == "0") {
            this.showErrorAlert("Lỗi nhập liệu", "Vui lòng nhập giá > 0!");
            return false;
        } else {
            this.isSaving = true;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            this.DinhMucNuocEdit.gia = Number(this.gia.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""));
            if (this.isNew == true) {
                this.DinhMucNuocEdit.congThucNuocId = this.rowCongthucnuoc.congThucNuocId;
                this.gvService.addnewDinhMucNuoc(this.DinhMucNuocEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
            }
            else {
                this.gvService.updateDinhMucNuoc(this.DinhMucNuocEdit.congThucNuocId, this.DinhMucNuocEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            }
        }
    }

    private saveSuccessHelper(obj?: DinhMucNuoc) {
        if (obj)
            Object.assign(this.DinhMucNuocEdit, obj);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;
        if (this.isGeneralEditor) {
            if (this.isNew) {
                this.alertService.showMessage("Thành công", `Thực hiện thêm mới thành công`, MessageSeverity.success);
            }
            else
                this.alertService.showMessage("Thành công", `Thực hiện thay đổi thông tin thành công`, MessageSeverity.success);
        }
        this.DinhMucNuocEdit = new DinhMucNuoc();
        this.isEditMode = true;
        this.loadData();
        this.resetForm();
        //if (this.changesSavedCallback)
        //    this.changesSavedCallback();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    giaChange(price: string) {
        if (price) {
            var pS = price.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            var pN = Number(pS);
            this.gia = Utilities.formatNumber(pN);
        }
    }

    formatPrice(price: string): string {
        if (price) {
            var pS = price.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            var pN = Number(pS);
            var fm = Utilities.formatNumber(pN);
            return fm;

        }
    }

    deleteDinhMucNuoc(row: DinhMucNuoc) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: DinhMucNuoc) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.gvService.deleteDinhMucNuoc(row.dinhMucNuocId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
                this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
                this.newDinhMucNuoc();
            },
                error => {
                    this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;
                    this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                });
    }
}