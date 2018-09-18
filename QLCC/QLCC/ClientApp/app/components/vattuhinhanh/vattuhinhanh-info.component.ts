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
    public urlServer: string = "\image_vattu";
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

    public clearEventHandler(e: ClearEvent): void {
        console.log('Clearing the file upload');
        this.imagePreviews = [];
    }

    public completeEventHandler() {
        console.log(`All files processed`);
        //
    }

    public removeEventHandler(e: RemoveEvent, value: string): void {
        console.log(`Removing ${e.files[0].name}`);

        e.data = {
            path: value
        };

        const index = this.imagePreviews.findIndex(item => item.uid === e.files[0].uid);

        if (index >= 0) {
            this.imagePreviews.splice(index, 1);
        }
    }

    uploadEventHandler(e: UploadEvent, value: string) {
        this.stringRandom = Utilities.RandomText(5);
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
                    VatTuHinhAnhInfoComponent.srcDataImg = image.src;
                    that.imagePreviews.unshift(image);
                };
                reader.readAsDataURL(file.rawFile);
            }
        });
    }

    private save() {        
        let k_file_name: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("k-upload-selected") as HTMLCollectionOf<HTMLElement>;
        if (k_file_name.length > 0) {
            k_file_name[0].click();
        //}
        //if (this.imagePreviews.length == 0) {
        //    this.alertService.showStickyMessage("Lỗi nhập liệu", "Ảnh không được để trống - Vui lòng chọn ảnh để upload", MessageSeverity.error);
        //    this.isUpload = false;
        //} else {
        //    this.isSaving = true;
        //    this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
        //    this.VatTuHinhAnhEdit.vatTuId = 0;
            
            //for (var image in k_file_name) {
            //    this.fileuploadservice.uploadFile(image, this.urlServer).subscribe(results => {
            //        console.log(results);
            //    })
            //}
            
            //if (this.isNew) {
            //    for (var i = 0; i < this.imagePreviews.length; i++) {
            //        this.VatTuHinhAnhEdit.tenHinhAnh = this.imagePreviews[i].name;
            //        this.gvService.addnewVatTuHinhAnh(this.VatTuHinhAnhEdit).subscribe(results => {
            //            this.saveSuccessHelper(results);
            //            console.log(results.urlHinhAnh);
            //        }, error => this.saveFailedHelper(error));
            //    }
            //}
            //else {
            //    for (var i = 0; i < this.imagePreviews.length; i++) {
            //        this.VatTuHinhAnhEdit.tenHinhAnh = this.imagePreviews[i].name;
            //        this.gvService.updateVatTuHinhAnh(this.VatTuHinhAnhEdit.vatTuHinhAnhId, this.VatTuHinhAnhEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
            //    }                
            //}
        }        
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
                this.alertService.showMessage("Thành công", `Thực hiện thêm mới thành công`, MessageSeverity.success);
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
        var idItem = "";
        idItem = event.target.id;
        //Update image Item to NULL
        this.VatTuHinhAnhEdit.urlHinhAnh = "";
        this.gvService.updateVatTuHinhAnh(this.VatTuHinhAnhEdit.vatTuHinhAnhId, this.VatTuHinhAnhEdit).subscribe(response => this.saveImageSuccessHelper(), error => this.saveImageFailedHelper(error));
        this.imageData = location.protocol + "//" + location.hostname + ":" + location.port + "/images/no_image.gif";
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