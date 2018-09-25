import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { LoaiDichVuService } from "../../services/loaidichvu.service";
import { LoaiDichVu } from "../../models/loaidichvu.model";
import { LoaiDichVuInfoComponent } from "./loaidichvu-info.component";
import { forEach } from '@angular/router/src/utils/collection';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { id } from '@swimlane/ngx-datatable/release/utils';
import { ListComponent } from '@progress/kendo-angular-dropdowns';
import { max } from 'rxjs/operator/max';
import { errors } from '@telerik/kendo-intl';

@Component({
    selector: "loaidichvu",
    templateUrl: "./loaidichvu.component.html",
    styleUrls: ["./loaidichvu.component.css"]
})

export class LoaiDichVuComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: LoaiDichVu[] = [];
    rowsCache: LoaiDichVu[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    loaidichvuEdit: LoaiDichVu;
    listDichVu: LoaiDichVu[] = [];
    sourceloaidichvu: LoaiDichVu;
    public selectedGropup: number = 0;
    editingRowName: { name: string };
    maxSub: number;
    filterStatus: string;

    @ViewChild('f')
    private form;

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('nameTemplate')
    nameTemplate: TemplateRef<any>;

    @ViewChild('descriptionTemplate')
    descriptionTemplate: TemplateRef<any>;

    @ViewChild('statusTemplate')
    statusTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('loaidichvuEditor')
    LoaiDichVuEditor: LoaiDichVuInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private loaidichvuService: LoaiDichVuService) {
    }

    ngOnInit() {
        //let gT = (key: string) => this.translationService.getTranslation(key);

        //this.columns = [
        //    { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
        //    { prop: 'tenLoaiDichVu', name: gT('Tên loại dịch vụ') },
        //    { prop: 'moTa', name: gT('Mô tả') },
        //    { prop: 'viTri', name: gT('Vị trí') },
        //    { prop: 'trangThai', name: gT('Trạng Thái'), cellTemplate: this.statusTemplate },
        //    { name: gT('Chức Năng'), width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        //];
        this.loadData(0);
    }

    ngAfterViewInit() {
        this.LoaiDichVuEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.LoaiDichVuEditor.editorModal.hide();
        };

        this.LoaiDichVuEditor.changesCancelledCallback = () => {
            this.loaidichvuEdit = null;
            this.sourceloaidichvu = null;
            this.LoaiDichVuEditor.editorModal.hide();
        };
    }

    addNewToList() {
        this.loadData(0);
        if (this.sourceloaidichvu) {
            Object.assign(this.sourceloaidichvu, this.loaidichvuEdit);
            this.loaidichvuEdit = null;
            this.sourceloaidichvu = null;
        }
        else {
            let objLoaiDichVu = new LoaiDichVu();
            Object.assign(objLoaiDichVu, this.loaidichvuEdit);
            this.loaidichvuEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objLoaiDichVu).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objLoaiDichVu);
            this.rows.splice(0, 0, objLoaiDichVu);
        }
    }

    loadData(status: number) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        if (status == 0) {
            this.loaidichvuService.dequy().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
        } else if (status > 0) {
            this.loaidichvuService.filterStatus(status).subscribe(results => this.onDataLoadSuccessful(results), errors => this.onDataLoadFailed(errors));
        }
    }

    onDataLoadSuccessful(obj: LoaiDichVu[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        obj.forEach((item, index, obj) => {
            (<any>item).index = index + 1;
        });
        this.listDichVu = obj;
        this.rowsCache = [...obj];
        this.rows = obj;
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }


    newLoaiDichVu() {
        this.editingRowName = null;
        this.sourceloaidichvu = null;
        this.loaidichvuEdit = this.LoaiDichVuEditor.newLoaiDichVu();
        this.LoaiDichVuEditor.isViewDetails = false;
        this.LoaiDichVuEditor.listDichVu = this.listDichVu;
        this.LoaiDichVuEditor.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.tenLoaiDichVu, r.moTa, r.viTri));
    }

    deleteLoaiDichVu(row: LoaiDichVu) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteHelper(row: LoaiDichVu) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;
            this.loaidichvuService.deleteLoaiDichVu(row.loaiDichVuId)
                .subscribe(results => {
                    console.log(results);
                    if (results == "BangGia") {
                        this.alertService.stopLoadingMessage();
                        this.loadingIndicator = false;
                        this.showErrorAlert("Xóa lỗi", "Không thể xóa danh mục " + row.tenLoaiDichVu + " do đang được sử dụng trong Bảng giá dịch vụ !");
                    } else if (results == "DVCB") {
                        this.alertService.stopLoadingMessage();
                        this.loadingIndicator = false;
                        this.showErrorAlert("Xóa lỗi", "Không thể xóa danh mục " + row.tenLoaiDichVu + " do đang được sử dụng trong Dịch vụ cơ bản !");
                    } else if (results == "Con") {
                        this.alertService.stopLoadingMessage();
                        this.loadingIndicator = false;
                        this.showErrorAlert("Xóa lỗi", "Không thể xóa danh mục " + row.tenLoaiDichVu + " do có danh mục con");
                    } else {
                        this.alertService.stopLoadingMessage();
                        this.loadingIndicator = false;
                        this.rowsCache = this.rowsCache.filter(item => item !== row)
                        this.rows = this.rows.filter(item => item !== row)
                        this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
                        this.loadData(0);
                    }
                },
                    error => {
                        this.alertService.stopLoadingMessage();
                        this.loadingIndicator = false;
                        this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                            MessageSeverity.error, error);
                    });
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    editLoaiDichVu(row: LoaiDichVu) {
        this.editingRowName = { name: row.tenLoaiDichVu };
        this.sourceloaidichvu = row;
        this.loaidichvuEdit = this.LoaiDichVuEditor.editLoaiDichVu(row);
        this.LoaiDichVuEditor.isViewDetails = false;
        this.LoaiDichVuEditor.checkTen = true;
        this.loaidichvuService.listDV(row.loaiDichVuId).subscribe(results => { this.LoaiDichVuEditor.listDichVu = results });
        this.LoaiDichVuEditor.editorModal.show();
    }

    viewDetailLoaiDichVu(row: LoaiDichVu) {
        this.editingRowName = { name: row.tenLoaiDichVu };
        this.sourceloaidichvu = row;
        this.loaidichvuEdit = this.LoaiDichVuEditor.editLoaiDichVu(row);
        this.LoaiDichVuEditor.isViewDetails = true;
        this.LoaiDichVuEditor.editorModal.show();
    }

    SelectedStatusValue(status: number) {
        this.loadData(status);
    }
}