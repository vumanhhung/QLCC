import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { LoaiHangService } from "../../services/loaihang.service";
import { LoaiHang } from "../../models/loaihang.model";
import { LoaiHangInfoComponent } from "./loaihang-info.component";

@Component({
    selector: "loaihang",
    templateUrl: "./loaihang.component.html",
    styleUrls: ["./loaihang.component.css"]
})

export class LoaiHangComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: LoaiHang[] = [];
    rowsCache: LoaiHang[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    loaihangEdit: LoaiHang;
    sourceloaihang: LoaiHang;
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

    @ViewChild('loaihangEditor')
    LoaiHangEditor: LoaiHangInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private loaihangService: LoaiHangService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenLoaiHang', name: gT('TenLoaiHang')},
			{ prop: 'kyHieu', name: gT('KyHieu')},
			{ prop: 'dienGiai', name: gT('DienGiai')},
			{ prop: 'trangThai', name: gT('TrangThai')},
			{ prop: 'nguoiNhap', name: gT('NguoiNhap')},
			{ prop: 'ngayNhap', name: gT('NgayNhap')},
			{ prop: 'nguoiSua', name: gT('NguoiSua')},
			{ prop: 'ngaySua', name: gT('NgaySua')},
            { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.LoaiHangEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.LoaiHangEditor.changesCancelledCallback = () => {
            this.loaihangEdit = null;
            this.sourceloaihang = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourceloaihang) {
            Object.assign(this.sourceloaihang, this.loaihangEdit);
            this.loaihangEdit = null;
            this.sourceloaihang = null;
        }
        else {
            let objLoaiHang = new LoaiHang();
            Object.assign(objLoaiHang, this.loaihangEdit);
            this.loaihangEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objLoaiHang).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objLoaiHang);
            this.rows.splice(0, 0, objLoaiHang);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.loaihangService.getAllLoaiHang().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: LoaiHang[]) {
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
        this.LoaiHangEditor.resetForm(true);
    }

    newLoaiHang() {
        this.editingRowName = null;
        this.sourceloaihang = null;
        this.loaihangEdit = this.LoaiHangEditor.newLoaiHang();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.loaiHangId,r.tenLoaiHang,r.kyHieu,r.dienGiai,r.trangThai,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteLoaiHang(row: LoaiHang) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: LoaiHang) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.loaihangService.deleteLoaiHang(row.loaiHangId)
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

    editLoaiHang(row: LoaiHang) {
        this.editingRowName = { name: row.tenLoaiHang };
        this.sourceloaihang = row;
        this.loaihangEdit = this.LoaiHangEditor.editLoaiHang(row);
        this.editorModal.show();
    }    
}