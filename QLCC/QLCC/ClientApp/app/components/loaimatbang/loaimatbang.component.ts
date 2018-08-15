import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { LoaiMatBangService } from "../../services/loaimatbang.service";
import { LoaiMatBang } from "../../models/loaimatbang.model";
import { LoaiMatBangInfoComponent } from "./loaimatbang-info.component";

@Component({
    selector: "loaimatbang",
    templateUrl: "./loaimatbang.component.html",
    styleUrls: ["./loaimatbang.component.css"]
})

export class LoaiMatBangComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    public titleForm: string = "Thêm mới";
    columns: any[] = [];
    rows: LoaiMatBang[] = [];
    rowsCache: LoaiMatBang[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    loaimatbangEdit: LoaiMatBang;
    sourceloaimatbang: LoaiMatBang;
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

    @ViewChild('loaimatbangEditor')
    LoaiMatBangEditor: LoaiMatBangInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private loaimatbangService: LoaiMatBangService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenLoaiMatBang', name: gT('Tên loại mặt bằng')},
			{ prop: 'dienGiai', name: gT('Giới thiệu')},
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.LoaiMatBangEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.LoaiMatBangEditor.changesCancelledCallback = () => {
            this.loaimatbangEdit = null;
            this.sourceloaimatbang = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourceloaimatbang) {
            Object.assign(this.sourceloaimatbang, this.loaimatbangEdit);
            this.loaimatbangEdit = null;
            this.sourceloaimatbang = null;
        }
        else {
            let objLoaiMatBang = new LoaiMatBang();
            Object.assign(objLoaiMatBang, this.loaimatbangEdit);
            this.loaimatbangEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objLoaiMatBang).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objLoaiMatBang);
            this.rows.splice(0, 0, objLoaiMatBang);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.loaimatbangService.getAllLoaiMatBang().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: LoaiMatBang[]) {
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
        this.LoaiMatBangEditor.resetForm(true);
    }

    newLoaiMatBang() {
        this.titleForm = "Thêm mới";
        this.editingRowName = null;
        this.sourceloaimatbang = null;
        this.loaimatbangEdit = this.LoaiMatBangEditor.newLoaiMatBang();
        this.LoaiMatBangEditor.isViewDetails = false;
        this.LoaiMatBangEditor.setFirstFocus = true;
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.loaiMatBangId,r.tenLoaiMatBang,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteLoaiMatBang(row: LoaiMatBang) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: LoaiMatBang) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.loaimatbangService.deleteLoaiMatBang(row.loaiMatBangId)
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

    editLoaiMatBang(row: LoaiMatBang) {
        this.titleForm = "Chỉnh sửa - " + row.tenLoaiMatBang;
        this.editingRowName = { name: row.tenLoaiMatBang };
        this.sourceloaimatbang = row;
        this.loaimatbangEdit = this.LoaiMatBangEditor.editLoaiMatBang(row);
        this.LoaiMatBangEditor.isViewDetails = false;
        this.LoaiMatBangEditor.setFirstFocus = true;
        this.editorModal.show();
    }    
    ViewLoaiMatBang(row: LoaiMatBang) {
        this.titleForm = "Chi tiết - " + row.tenLoaiMatBang;
        this.editingRowName = { name: row.tenLoaiMatBang };
        this.sourceloaimatbang = row;
        this.loaimatbangEdit = this.LoaiMatBangEditor.editLoaiMatBang(row);
        this.LoaiMatBangEditor.isViewDetails = true;
        this.LoaiMatBangEditor.setFirstFocus = false;
        this.editorModal.show();
    }  
}