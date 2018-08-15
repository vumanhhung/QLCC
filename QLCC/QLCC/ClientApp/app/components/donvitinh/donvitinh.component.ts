import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { DonViTinhService } from "../../services/donvitinh.service";
import { DonViTinh } from "../../models/donvitinh.model";
import { DonViTinhInfoComponent } from "./donvitinh-info.component";

@Component({
    selector: "donvitinh",
    templateUrl: "./donvitinh.component.html",
    styleUrls: ["./donvitinh.component.css"]
})

export class DonViTinhComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: DonViTinh[] = [];
    rowsCache: DonViTinh[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    donvitinhEdit: DonViTinh;
    sourcedonvitinh: DonViTinh;
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

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('donvitinhEditor')
    DonViTinhEditor: DonViTinhInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private donvitinhService: DonViTinhService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 50, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenDonViTinh', name: gT('Tên đơn vị tính')},
			{ prop: 'dienGiai', name: gT('Mô tả')},
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.DonViTinhEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.DonViTinhEditor.changesCancelledCallback = () => {
            this.donvitinhEdit = null;
            this.sourcedonvitinh = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcedonvitinh) {
            Object.assign(this.sourcedonvitinh, this.donvitinhEdit);
            this.donvitinhEdit = null;
            this.sourcedonvitinh = null;
        }
        else {
            let objDonViTinh = new DonViTinh();
            Object.assign(objDonViTinh, this.donvitinhEdit);
            this.donvitinhEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objDonViTinh).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objDonViTinh);
            this.rows.splice(0, 0, objDonViTinh);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.donvitinhService.getAllDonViTinh().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: DonViTinh[]) {
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
        this.DonViTinhEditor.resetForm(true);
    }

    newDonViTinh() {
        this.editingRowName = null;
        this.sourcedonvitinh = null;
        this.donvitinhEdit = this.DonViTinhEditor.newDonViTinh();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.donViTinhId,r.tenDonViTinh,r.dienGiai,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteDonViTinh(row: DonViTinh) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: DonViTinh) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.donvitinhService.deleteDonViTinh(row.donViTinhId)
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

    editDonViTinh(row: DonViTinh) {
        this.editingRowName = { name: row.tenDonViTinh };
        this.sourcedonvitinh = row;
        this.donvitinhEdit = this.DonViTinhEditor.editDonViTinh(row);
        this.editorModal.show();
    }    
}