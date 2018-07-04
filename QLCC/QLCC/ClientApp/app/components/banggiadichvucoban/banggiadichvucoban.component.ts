import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { BangGiaDichVuCoBanService } from "../../services/banggiadichvucoban.service";
import { BangGiaDichVuCoBan } from "../../models/banggiadichvucoban.model";
import { BangGiaDichVuCoBanInfoComponent } from "./banggiadichvucoban-info.component";

@Component({
    selector: "banggiadichvucoban",
    templateUrl: "./banggiadichvucoban.component.html",
    styleUrls: ["./banggiadichvucoban.component.css"]
})

export class BangGiaDichVuCoBanComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: BangGiaDichVuCoBan[] = [];
    rowsCache: BangGiaDichVuCoBan[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    banggiadichvucobanEdit: BangGiaDichVuCoBan;
    sourcebanggiadichvucoban: BangGiaDichVuCoBan;
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

    @ViewChild('banggiadichvucobanEditor')
    BangGiaDichVuCoBanEditor: BangGiaDichVuCoBanInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private banggiadichvucobanService: BangGiaDichVuCoBanService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'loaiDichVuId', name: gT('LoaiDichVuId')},
			{ prop: 'loaiTienId', name: gT('LoaiTienId')},
			{ prop: 'donViTinhId', name: gT('DonViTinhId')},
			{ prop: 'toaNhaId', name: gT('ToaNhaId')},
			{ prop: 'donGia', name: gT('DonGia')},
			{ prop: 'dienGiai', name: gT('DienGiai')},
			{ prop: 'nguoiNhap', name: gT('NguoiNhap')},
			{ prop: 'ngayNhap', name: gT('NgayNhap')},
			{ prop: 'nguoiSua', name: gT('NguoiSua')},
			{ prop: 'ngaySua', name: gT('NgaySua')},
            { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.BangGiaDichVuCoBanEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.BangGiaDichVuCoBanEditor.changesCancelledCallback = () => {
            this.banggiadichvucobanEdit = null;
            this.sourcebanggiadichvucoban = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcebanggiadichvucoban) {
            Object.assign(this.sourcebanggiadichvucoban, this.banggiadichvucobanEdit);
            this.banggiadichvucobanEdit = null;
            this.sourcebanggiadichvucoban = null;
        }
        else {
            let objBangGiaDichVuCoBan = new BangGiaDichVuCoBan();
            Object.assign(objBangGiaDichVuCoBan, this.banggiadichvucobanEdit);
            this.banggiadichvucobanEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objBangGiaDichVuCoBan).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objBangGiaDichVuCoBan);
            this.rows.splice(0, 0, objBangGiaDichVuCoBan);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.banggiadichvucobanService.getAllBangGiaDichVuCoBan().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: BangGiaDichVuCoBan[]) {
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
        this.BangGiaDichVuCoBanEditor.resetForm(true);
    }

    newBangGiaDichVuCoBan() {
        this.editingRowName = null;
        this.sourcebanggiadichvucoban = null;
        this.banggiadichvucobanEdit = this.BangGiaDichVuCoBanEditor.newBangGiaDichVuCoBan();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.bangGiaDichVuCoBanId,r.loaiDichVuId,r.loaiTienId,r.donViTinhId,r.toaNhaId,r.donGia,r.dienGiai,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteBangGiaDichVuCoBan(row: BangGiaDichVuCoBan) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: BangGiaDichVuCoBan) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.banggiadichvucobanService.deleteBangGiaDichVuCoBan(row.bangGiaDichVuCoBanId)
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

    editBangGiaDichVuCoBan(row: BangGiaDichVuCoBan) {
        this.editingRowName = { name: row.dienGiai };
        this.sourcebanggiadichvucoban = row;
        this.banggiadichvucobanEdit = this.BangGiaDichVuCoBanEditor.editBangGiaDichVuCoBan(row);
        this.editorModal.show();
    }    
}