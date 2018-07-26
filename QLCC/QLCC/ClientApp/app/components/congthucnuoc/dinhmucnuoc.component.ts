import { Component, OnInit, ViewChild, Input, TemplateRef } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
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
    private isNew = false;
    private isSaving = false;
    private isEdit = false;
    private checkbox: boolean = false;
    columns: any[] = [];
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private DinhMucNuocEdit: DinhMucNuoc = new DinhMucNuoc();
    private loadingIndicator: boolean;
    rows: DinhMucNuoc[] = [];
    rowsCache: DinhMucNuoc[] = [];
    tenCongThucNuoc: string = "";
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

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
                { prop: 'tenDinhMucNuoc', name: gT('Tên định mức nước') },
                { prop: 'soDau', name: gT('Số đầu') },
                { prop: 'soCuoi', name: gT('Số cuối') },
                { prop: 'gia', name: gT('Giá') },
                { prop: 'dienGiai', name: gT('Diễn giải') },
                { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
            ];
            //this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
    }

    loadCongthucNuoc(row: CongThucNuoc) {
        this.tenCongThucNuoc = row.tenCongThucNuoc;
        this.DinhMucNuocEdit.congThucNuocId = row.congThucNuocId;
        this.gvService.getAllDinhMucNuoc(this.DinhMucNuocEdit.congThucNuocId).subscribe(result => this.onDataLoadSuccessful(result), error => this.onDataLoadFailed(error));
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

    //resetForm(replace = false) {

    //    if (!replace) {
    //        this.form.reset();
    //    }
    //    else {
    //        this.formResetToggle = false;

    //        setTimeout(() => {
    //            this.formResetToggle = true;
    //        });
    //    }
    //}

    onEditorModalHidden() {
        this.editingRowName = null;
        //this.resetForm(true);
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
        this.isEdit = false;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.DinhMucNuocEdit = new DinhMucNuoc();
        this.gvService.getMax().subscribe(result => {
            if (result == 0) {
                this.DinhMucNuocEdit.soDau = 0;
            } else {
                this.DinhMucNuocEdit.soDau = result;
            }
        })
        this.edit();
        return this.DinhMucNuocEdit;
    }

    editDinhMucNuoc(obj: DinhMucNuoc) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.isEdit = true;
            this.editingRowName = obj.tenDinhMucNuoc;
            this.DinhMucNuocEdit = new DinhMucNuoc();
            Object.assign(this.DinhMucNuocEdit, obj);
            Object.assign(this.DinhMucNuocEdit, obj);
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
        this.isSaving = true;
        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
        alert(1);
        if (this.isNew) {
            alert(2);
            this.gvService.addnewDinhMucNuoc(this.DinhMucNuocEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
            alert(3);
            this.gvService.updateDinhMucNuoc(this.DinhMucNuocEdit.congThucNuocId, this.DinhMucNuocEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
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
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
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
}