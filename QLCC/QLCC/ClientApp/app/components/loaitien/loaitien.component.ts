import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { LoaiTienService } from "../../services/loaitien.service";
import { LoaiTien } from "../../models/loaitien.model";
import { LoaiTienInfoComponent } from "./loaitien-info.component";

@Component({
    selector: "loaitien",
    templateUrl: "./loaitien.component.html",
    styleUrls: ["./loaitien.component.css"]
})

export class LoaiTienComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: LoaiTien[] = [];
    rowsCache: LoaiTien[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    loaitienEdit: LoaiTien;
    sourceloaitien: LoaiTien;
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

    @ViewChild('loaitienEditor')
    LoaiTienEditor: LoaiTienInfoComponent;

    @ViewChild('tyGiaTemplate')
    tyGiaTemplate: TemplateRef<any>;


    constructor(private alertService: AlertService, private translationService: AppTranslationService, private loaitienService: LoaiTienService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenLoaiTien', name: gT('Tên loại tiền')},
            { prop: 'kyHieu', name: gT('Ký hiệu') },
            { name: gT('Tỷ giá'), cellTemplate: this.tyGiaTemplate },
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.LoaiTienEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.LoaiTienEditor.changesCancelledCallback = () => {
            this.loaitienEdit = null;
            this.sourceloaitien = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourceloaitien) {
            Object.assign(this.sourceloaitien, this.loaitienEdit);
            this.loaitienEdit = null;
            this.sourceloaitien = null;
        }
        else {
            let objLoaiTien = new LoaiTien();
            Object.assign(objLoaiTien, this.loaitienEdit);
            this.loaitienEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objLoaiTien).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objLoaiTien);
            this.rows.splice(0, 0, objLoaiTien);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.loaitienService.getAllLoaiTien().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: LoaiTien[]) {
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
        this.LoaiTienEditor.resetForm(true);
    }

    newLoaiTien() {
        this.editingRowName = null;
        this.sourceloaitien = null;
        this.loaitienEdit = this.LoaiTienEditor.newLoaiTien();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.loaiTienId,r.tenLoaiTien,r.kyHieu,r.tyGia,r.nguoiNhap,r.ngayNgap,r.nguoiSua,r.ngaySua));
    }

    deleteLoaiTien(row: LoaiTien) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: LoaiTien) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.loaitienService.deleteLoaiTien(row.loaiTienId)
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

    editLoaiTien(row: LoaiTien) {
        this.editingRowName = { name: row.tenLoaiTien };
        this.sourceloaitien = row;
        this.loaitienEdit = this.LoaiTienEditor.editLoaiTien(row);
        this.editorModal.show();
    }    
}