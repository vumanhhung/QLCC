import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { LoaiGiaThueService } from "../../services/loaigiathue.service";
import { LoaiGiaThue } from "../../models/loaigiathue.model";
import { LoaiGiaThueInfoComponent } from "./loaigiathue-info.component";
import { LoaiTienService } from '../../services/loaitien.service';
import { LoaiTien } from '../../models/loaitien.model';

@Component({
    selector: "loaigiathue",
    templateUrl: "./loaigiathue.component.html",
    styleUrls: ["./loaigiathue.component.css"]
})

export class LoaiGiaThueComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: LoaiGiaThue[] = [];
    rowsCache: LoaiGiaThue[] = [];
    loaitiens: LoaiTien[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    loaigiathueEdit: LoaiGiaThue;
    sourceloaigiathue: LoaiGiaThue;
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

    @ViewChild('donGiaTemplate')
    donGiaTemplate: TemplateRef<any>;

    @ViewChild('loaigiathueEditor')
    LoaiGiaThueEditor: LoaiGiaThueInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private loaigiathueService: LoaiGiaThueService, private loaitienService: LoaiTienService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenLoaiGia', name: gT('Tên loại giá')},
            { name: gT('Đơn giá'), cellTemplate: this.donGiaTemplate },
			{ prop: 'loaitien.kyHieu', name: gT('Loại tiền')},
            { name: gT('matbang.qlmb_chucnang'), width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];

        this.getAllLoaiTien();
        this.loadData(0);
    }
    
    ngAfterViewInit() {
        this.LoaiGiaThueEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.LoaiGiaThueEditor.changesCancelledCallback = () => {
            this.loaigiathueEdit = null;
            this.sourceloaigiathue = null;
            this.editorModal.hide();
        };
    }
    LoaiTienValueChange(loaitien: number) {
        this.loadData(loaitien);
    }
    addNewToList() {
        if (this.sourceloaigiathue) {
            Object.assign(this.sourceloaigiathue, this.loaigiathueEdit);
            this.loaigiathueEdit = null;
            this.sourceloaigiathue = null;
        }
        else {
            let objLoaiGiaThue = new LoaiGiaThue();
            Object.assign(objLoaiGiaThue, this.loaigiathueEdit);
            this.loaigiathueEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objLoaiGiaThue).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objLoaiGiaThue);
            this.rows.splice(0, 0, objLoaiGiaThue);
        }
    }
    
    loadData(loaitien:number) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.loaigiathueService.getLoaiGiaThueByLoaiTien(loaitien).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: LoaiGiaThue[]) {
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
        this.LoaiGiaThueEditor.resetForm(true);
    }

    newLoaiGiaThue() {
        this.editingRowName = null;
        this.sourceloaigiathue = null;
        this.LoaiGiaThueEditor.loaitiens = this.loaitiens;
        this.loaigiathueEdit = this.LoaiGiaThueEditor.newLoaiGiaThue();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.loaiGiaThueId,r.tenLoaiGia,r.donGia,r.loaiTienId,r.dienGiai,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteLoaiGiaThue(row: LoaiGiaThue) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    getAllLoaiTien() {
        this.loaitienService.getAllLoaiTien().subscribe(results => this.onDataLoadLoaiTienSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadLoaiTienSuccessful(obj: LoaiTien[]) {
        this.loaitiens = obj
    }

    deleteHelper(row: LoaiGiaThue) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.loaigiathueService.deleteLoaiGiaThue(row.loaiGiaThueId)
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

    editLoaiGiaThue(row: LoaiGiaThue) {
        this.editingRowName = { name: row.tenLoaiGia };
        this.sourceloaigiathue = row;
        this.LoaiGiaThueEditor.loaitiens = this.loaitiens;
        this.loaigiathueEdit = this.LoaiGiaThueEditor.editLoaiGiaThue(row);
        this.editorModal.show();
    }    
}