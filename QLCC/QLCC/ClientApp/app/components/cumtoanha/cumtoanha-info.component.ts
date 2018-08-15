import { Component, OnInit, ViewChild, Input, ViewChildren } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { CumToaNha } from "../../models/cumtoanha.model";
import { CumToaNhaService } from "./../../services/cumtoanha.service";
import * as EmailValidator from 'email-validator';
import { UploadEvent, SelectEvent, FileInfo } from '@progress/kendo-angular-upload';
import { CumToaNhaComponent } from './cumtoanha.component';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: "cumtoanha-info",
    templateUrl: "./cumtoanha-info.component.html",
    styleUrls: ["./cumtoanha-info.component.css"]
})

export class CumToaNhaInfoComponent implements OnInit {
    public tencumtoanha: string = "";
    isViewDetails = false;
    isValidateEmail: boolean;
    public stringRandom: string;
    private isNew = false;
    private isEdit = false;
    private isSaving = false;
    static srcDataImg: any;
    public altImageItem: string;
    public imagePreviews: FileInfo[] = [];
    isdisplayImage = false;
    public imageData: string;
    public cumtoanhaId: number;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private CumToaNhaEdit: CumToaNha = new CumToaNha();
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
    @ViewChildren('input') vc;
    CumToaNhaForm: CumToaNhaComponent;
    @ViewChild('editorModal')
    editorModal: ModalDirective;
    constructor(private alertService: AlertService, private gvService: CumToaNhaService) {
    }
    
    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getCumToaNhaByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }
    
    private onDataLoadSuccessful(obj: CumToaNha) {
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

    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }
    
    private cancel() {
        this.CumToaNhaEdit = new CumToaNha();
        this.showValidationErrors = false;
        this.resetForm();
        if (this.isViewDetails == false) {
            this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        }
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    onValidateEmail(email: string) {
        this.isValidateEmail = EmailValidator.validate(email); // true
    }

    private save() {
        this.stringRandom = Utilities.RandomText(10);
        let k_file_name: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("k-file-name") as HTMLCollectionOf<HTMLElement>;

        if (this.isValidateEmail == false) { return; }
        this.isSaving = true;
        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");        
        if (this.isNew) {
            if (k_file_name[0] != undefined) {//Nếu ảnh đại diện được chọn. Up ảnh
                this.CumToaNhaEdit.logo = CumToaNhaInfoComponent.srcDataImg;
            }
            else {
                this.CumToaNhaEdit.logo = "no_image.gif";
            }
            this.gvService.addnewCumToaNha(this.CumToaNhaEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
            if (k_file_name[0] != undefined) {//Nếu ảnh đại diện được chọn. Up ảnh
                this.CumToaNhaEdit.logo = CumToaNhaInfoComponent.srcDataImg;
            }
            this.gvService.updateCumToaNha(this.CumToaNhaEdit.cumToaNhaId, this.CumToaNhaEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }
    
    newCumToaNha() {
        this.isdisplayImage = false;
        this.isGeneralEditor = true;
        this.isValidateEmail = false;
        this.isNew = true;
        this.isEdit = false;
        this.altImageItem = "";
        this.imageData = location.protocol + "//" + location.hostname + ":" + location.port + "/images/no_image.gif";
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.CumToaNhaEdit = new CumToaNha();
        this.edit();
        return this.CumToaNhaEdit;
    }

    private saveSuccessHelper(obj?: CumToaNha) {
        if (obj)
            Object.assign(this.CumToaNhaEdit, obj);

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
        this.CumToaNhaEdit = new CumToaNha();
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    private saveImageSuccessHelper(obj?: CumToaNha) {
        if (obj) {
            Object.assign(this.CumToaNhaEdit, obj);
            this.alertService.showMessage("Thành công", `Thực hiện xóa ảnh thành công`, MessageSeverity.success);
        }
        //if (this.changesSavedCallback)
        //    this.changesSavedCallback();
    }
    

    uploadEventHandler(e: UploadEvent, value: string) {
        e.data = {
            stringRandom: this.stringRandom,
            urlSever: value
        };
    }

    public selectEventHandler(e: SelectEvent): void {
        const that = this;
        e.files.forEach((file) => {
            if (!file.validationErrors) {
                const reader = new FileReader();

                reader.onload = function (ev: any) {
                    const image: any = {
                        src: ev.target.result,
                        uid: file.uid
                    };
                    CumToaNhaInfoComponent.srcDataImg = image.src;
                    that.imagePreviews.unshift(image);
                };
                reader.readAsDataURL(file.rawFile);
            }
        });
    }


    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }

    private saveImageFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "Không thể xóa ảnh. Vui lòng kiểm tra lại:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }


    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    editCumToaNha(obj: CumToaNha) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.isEdit = true;
            this.isdisplayImage = true;
            this.editingRowName = obj.tenCumToaNha;
            this.isValidateEmail = EmailValidator.validate(obj.email);
            this.CumToaNhaEdit = new CumToaNha();
            Object.assign(this.CumToaNhaEdit, obj);
            Object.assign(this.CumToaNhaEdit, obj);
            this.edit();
            this.cumtoanhaId = obj.cumToaNhaId;
            this.altImageItem = this.CumToaNhaEdit.tenCumToaNha;
            if (this.CumToaNhaEdit.logo.length > 0 && this.CumToaNhaEdit.logo != "no_image.gif") {
                this.imageData = this.CumToaNhaEdit.logo;
            }
            else {
                this.imageData = location.protocol + "//" + location.hostname + ":" + location.port + "/images/no_image.gif";
            }

            return this.CumToaNhaEdit;
        }
        else {
            return this.newCumToaNha();
        }
    }

    clearImageData(event) {
        var idItem = "";
        idItem = event.target.id;
        //Update image Item to NULL
        this.CumToaNhaEdit.logo = "";
        this.gvService.updateCumToaNha(this.CumToaNhaEdit.cumToaNhaId, this.CumToaNhaEdit).subscribe(response => this.saveImageSuccessHelper(), error => this.saveImageFailedHelper(error));
        this.imageData = location.protocol + "//" + location.hostname + ":" + location.port + "/images/no_image.gif";
    }
    private edit() {
        if (!this.isGeneralEditor || !this.CumToaNhaEdit) {
            this.CumToaNhaEdit = new CumToaNha();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.CumToaNhaEdit = new CumToaNha();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }  
    private moveToEditForm() {
        this.isViewDetails = false;
        this.isEdit = true;
    }
}