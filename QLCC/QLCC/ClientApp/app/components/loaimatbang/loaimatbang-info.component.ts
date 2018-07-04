import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit, Renderer } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { LoaiMatBang } from "../../models/loaimatbang.model";
import { LoaiMatBangService } from "./../../services/loaimatbang.service";

@Component({
    selector: "loaimatbang-info",
    templateUrl: "./loaimatbang-info.component.html",
    styleUrls: ["./loaimatbang-info.component.css"]
})

export class LoaiMatBangInfoComponent implements OnInit {

    isViewDetails = false;
    setFirstFocus = false;
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private LoaiMatBangEdit: LoaiMatBang = new LoaiMatBang();
    public value: Date = new Date();
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
    @ViewChild('f')
    private form;

    constructor(private alertService: AlertService, private gvService: LoaiMatBangService, private renderer: Renderer) {
    }
    
    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }
    //ngAfterViewInit() {
    //    try {
    //        let onElement: HTMLInputElement = document.getElementById("tenLoaiMatBang") as HTMLInputElement;
    //        onElement.focus();
    //    }
    //    catch{}
    //}


    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getLoaiMatBangByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    
    private onDataLoadSuccessful(obj: LoaiMatBang) {
        this.alertService.stopLoadingMessage();
    }

    private onCurrentUserDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
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
    
    private cancel() {
            this.LoaiMatBangEdit = new LoaiMatBang();
            this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    private save() {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");        
        if (this.isNew) {
            this.gvService.addnewLoaiMatBang(this.LoaiMatBangEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateLoaiMatBang(this.LoaiMatBangEdit.loaiMatBangId, this.LoaiMatBangEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }
    
    newLoaiMatBang() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.LoaiMatBangEdit = new LoaiMatBang();
        this.edit();
        return this.LoaiMatBangEdit;
    }

    private saveSuccessHelper(obj?: LoaiMatBang) {
        if (obj)
            Object.assign(this.LoaiMatBangEdit, obj);

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
        this.LoaiMatBangEdit = new LoaiMatBang();
        this.resetForm();
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

    editLoaiMatBang(obj: LoaiMatBang) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.tenLoaiMatBang;
            this.LoaiMatBangEdit = new LoaiMatBang();
            Object.assign(this.LoaiMatBangEdit, obj);
            Object.assign(this.LoaiMatBangEdit, obj);
            this.edit();

            return this.LoaiMatBangEdit;
        }
        else {
            return this.newLoaiMatBang();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.LoaiMatBangEdit) {
            this.LoaiMatBangEdit = new LoaiMatBang();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.LoaiMatBangEdit = new LoaiMatBang();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }   
    private moveToEditForm() {
        this.isViewDetails = false;
    }
}