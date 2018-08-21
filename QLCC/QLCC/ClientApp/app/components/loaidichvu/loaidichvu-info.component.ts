import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { LoaiDichVu } from "../../models/loaidichvu.model";
import { LoaiDichVuService } from "./../../services/loaidichvu.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { selectRows } from '@swimlane/ngx-datatable/release/utils';

@Component({
    selector: "loaidichvu-info",
    templateUrl: "./loaidichvu-info.component.html",
    styleUrls: ["./loaidichvu-info.component.css"]
})

export class LoaiDichVuInfoComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    isViewDetails = false;
    private isEdit = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private LoaiDichVuEdit: LoaiDichVu = new LoaiDichVu();
    listDichVu: LoaiDichVu[] = [];
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    private chDichVu: boolean;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    checkTen: boolean;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    constructor(private alertService: AlertService, private gvService: LoaiDichVuService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {        
        this.alertService.startLoadingMessage();
        this.gvService.getLoaiDichVuByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: LoaiDichVu) {
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
        this.LoaiDichVuEdit = new LoaiDichVu();
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
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
            this.gvService.addnewLoaiDichVu(this.LoaiDichVuEdit).subscribe(results => {
                if (results.tenLoaiDichVu == "Exist") {
                    this.showErrorAlert("Lỗi nhập liệu", "Loại dịch vụ: " + this.LoaiDichVuEdit.tenLoaiDichVu + " đã tồn tại trên hệ thống, vui lòng chọn tên khác!");
                    this.alertService.stopLoadingMessage();
                    this.isSaving = false;
                    this.checkTen = false;
                }else this.saveSuccessHelper();
            }, error => this.saveFailedHelper(error));
        }
        else {
            this.gvService.updateLoaiDichVu(this.LoaiDichVuEdit.loaiDichVuId, this.LoaiDichVuEdit).subscribe(response => {
                if (response == "Exist") {
                    this.showErrorAlert("Lỗi nhập liệu", "Loại dịch vụ: " + this.LoaiDichVuEdit.tenLoaiDichVu + " đã tồn tại trên hệ thống, vui lòng chọn tên khác!");
                    this.alertService.stopLoadingMessage();
                    this.isSaving = false;
                    this.checkTen = false;
                } else this.saveSuccessHelper();
            }, error => this.saveFailedHelper(error));
        }
    }

    newLoaiDichVu() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.isEdit = false;
        this.chDichVu = false;
        this.showValidationErrors = true;
        this.editingRowName = null;
        this.chDichVu = false;
        this.LoaiDichVuEdit = new LoaiDichVu();
        this.LoaiDichVuEdit.dichVuCoBan = true;
        this.LoaiDichVuEdit.trangThai = 1;
        this.LoaiDichVuEdit.maLoaiDichVuCha = 0;
        this.edit();
        return this.LoaiDichVuEdit;
    }

    private saveSuccessHelper(obj?: LoaiDichVu) {
        if (obj)
            Object.assign(this.LoaiDichVuEdit, obj);
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
        this.LoaiDichVuEdit = new LoaiDichVu();
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        //if (this.check == false) {
        //    this.alertService.showMessage("Lỗi", 'Tên danh mục đã trùng, vui lòng nhập lại!', MessageSeverity.warn);
        //}
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    editLoaiDichVu(obj: LoaiDichVu) {
        if (obj) {
            //this.LoaiDichVuEdit.loaiDichVuId = 0;
            this.isGeneralEditor = true;
            this.isNew = false;
            this.isEdit = true;

            this.editingRowName = obj.tenLoaiDichVu;
            this.chDichVu = true;
            this.LoaiDichVuEdit = new LoaiDichVu();
            Object.assign(this.LoaiDichVuEdit, obj);
            Object.assign(this.LoaiDichVuEdit, obj);
            this.edit();
            this.gvService.getLoaiDichVuByID(obj.loaiDichVuId).subscribe(result => this.LoaiDichVuEdit.tenLoaiDichVu = result.tenLoaiDichVu);
            return this.LoaiDichVuEdit;
        }
        else {
            return this.newLoaiDichVu();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.LoaiDichVuEdit) {
            this.LoaiDichVuEdit = new LoaiDichVu();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.LoaiDichVuEdit = new LoaiDichVu();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    movetoEditForm() {
        this.isNew = false;
        this.isViewDetails = false;
        this.isEdit = true;
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }

    changeDanhMuc(id: number) {
        if (id > 0) {
            this.chDichVu = true;
        } else {
            this.chDichVu = false;
        }
    }

    tenChk(ten: string) {
        if (ten != "") {
            this.checkTen = true;
        } else
            this.checkTen = false;
    }
}