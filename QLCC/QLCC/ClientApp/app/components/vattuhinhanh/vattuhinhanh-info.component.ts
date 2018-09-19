import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { VatTuHinhAnh } from "../../models/vattuhinhanh.model";
import { VatTuHinhAnhService } from "./../../services/vattuhinhanh.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SelectEvent, UploadEvent, FileInfo, FileRestrictions, ClearEvent, RemoveEvent } from '@progress/kendo-angular-upload';
import { VatTu } from '../../models/vattu.model';
import { VatTuHinhAnhComponent } from './vattuhinhanh.component';
import { FileUploadService } from '../../services/fileupload.service';

@Component({
    selector: "vattuhinhanh-info",
    templateUrl: "./vattuhinhanh-info.component.html",
    styleUrls: ["./vattuhinhanh-info.component.css"]
})

export class VatTuHinhAnhInfoComponent implements OnInit {
    private isNew = false;
    isEdit = false;
    public uploadSaveUrl = 'api/FileUploads/UploadFile'; // should represent an actual API endpoint
    public uploadRemoveUrl = 'api/FileUploads/RemoveFileByPath'; // should represent an actual API endpoint
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    public VatTuHinhAnhEdit: VatTuHinhAnh = new VatTuHinhAnh();
    public vatTu: VatTu = new VatTu();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    isUpload = false;
    isdisplayImage = false;
    public imagePreviews: FileInfo[] = [];
    public stringRandom: string;
    public urlServer: string = "";
    public imageData: string;
    static srcDataImg: any;
    public altImageItem: string;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    public uploadRestrictions: FileRestrictions = {
        allowedExtensions: ['.jpg', '.png']
    };

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    constructor(private alertService: AlertService, private gvService: VatTuHinhAnhService, private fileuploadservice: FileUploadService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        //this.gvService.getVatTuHinhAnhByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    loadVatTu(obj: VatTu) {
        this.vatTu = obj;
        this.VatTuHinhAnhEdit.vatTuId = obj.vatTuId;
        return this.VatTuHinhAnhEdit;
    }

    private onDataLoadSuccessful(obj: VatTuHinhAnh) {
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
        this.VatTuHinhAnhEdit = new VatTuHinhAnh();
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    newVatTuHinhAnh() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.isdisplayImage = false;
        this.VatTuHinhAnhEdit = new VatTuHinhAnh();
        this.edit();
        return this.VatTuHinhAnhEdit;
    }

    private saveSuccessHelper(obj?: VatTuHinhAnh) {
        if (obj)
            Object.assign(this.VatTuHinhAnhEdit, obj);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;
        if (this.isGeneralEditor) {
            if (this.isNew) {
                
            }
            else
                this.alertService.showMessage("Thành công", `Thực hiện thay đổi thông tin thành công`, MessageSeverity.success);
        }
        this.VatTuHinhAnhEdit = new VatTuHinhAnh();
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

    editVatTuHinhAnh(obj: VatTuHinhAnh) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.editingRowName = obj.tenHinhAnh;
            this.isdisplayImage = true;
            this.VatTuHinhAnhEdit = new VatTuHinhAnh();
            Object.assign(this.VatTuHinhAnhEdit, obj);
            Object.assign(this.VatTuHinhAnhEdit, obj);
            this.edit();
            this.altImageItem = this.VatTuHinhAnhEdit.tenHinhAnh;
            if (this.VatTuHinhAnhEdit.urlHinhAnh.length > 0 && this.VatTuHinhAnhEdit.urlHinhAnh != "no_image.gif") {
                this.imageData = this.VatTuHinhAnhEdit.urlHinhAnh;
            }
            else {
                this.imageData = location.protocol + "//" + location.hostname + ":" + location.port + "/images/no_image.gif";
            }
            return this.VatTuHinhAnhEdit;
        }
        else {
            return this.newVatTuHinhAnh();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.VatTuHinhAnhEdit) {
            this.VatTuHinhAnhEdit = new VatTuHinhAnh();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.VatTuHinhAnhEdit = new VatTuHinhAnh();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    clearImageData(event) {
        //Update image Item to NULL
        this.VatTuHinhAnhEdit.urlHinhAnh = "";
    }

    private saveImageFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "Không thể xóa ảnh. Vui lòng kiểm tra lại:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }

    private saveImageSuccessHelper(obj?: VatTuHinhAnh) {
        if (obj) {
            Object.assign(this.VatTuHinhAnhEdit, obj);
            this.alertService.showMessage("Thành công", `Thực hiện xóa ảnh thành công`, MessageSeverity.success);
        }
    }
}