import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { BangGiaXeService } from "../../services/banggiaxe.service";
import { BangGiaXe } from "../../models/banggiaxe.model";
import { BangGiaXeInfoComponent } from "./banggiaxe-info.component";

@Component({
    selector: "banggiaxe",
    templateUrl: "./banggiaxe.component.html",
    styleUrls: ["./banggiaxe.component.css"]
})

export class BangGiaXeComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: BangGiaXe[] = [];
    rowsCache: BangGiaXe[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    banggiaxeEdit: BangGiaXe;
    sourcebanggiaxe: BangGiaXe;
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

    @ViewChild('banggiaxeEditor')
    BangGiaXeEditor: BangGiaXeInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private banggiaxeService: BangGiaXeService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'toaNhaId', name: gT('ToaNhaId')},
			{ prop: 'loaiXeId', name: gT('LoaiXeId')},
			{ prop: 'dinhMuc', name: gT('DinhMuc')},
			{ prop: 'giaThang', name: gT('GiaThang')},
			{ prop: 'giaNgay', name: gT('GiaNgay')},
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
        this.BangGiaXeEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.BangGiaXeEditor.changesCancelledCallback = () => {
            this.banggiaxeEdit = null;
            this.sourcebanggiaxe = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcebanggiaxe) {
            Object.assign(this.sourcebanggiaxe, this.banggiaxeEdit);
            this.banggiaxeEdit = null;
            this.sourcebanggiaxe = null;
        }
        else {
            let objBangGiaXe = new BangGiaXe();
            Object.assign(objBangGiaXe, this.banggiaxeEdit);
            this.banggiaxeEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objBangGiaXe).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objBangGiaXe);
            this.rows.splice(0, 0, objBangGiaXe);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.banggiaxeService.getAllBangGiaXe().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: BangGiaXe[]) {
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
        this.BangGiaXeEditor.resetForm(true);
    }

    newBangGiaXe() {
        this.editingRowName = null;
        this.sourcebanggiaxe = null;
        this.banggiaxeEdit = this.BangGiaXeEditor.newBangGiaXe();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.bangGiaXeId,r.toaNhaId,r.loaiXeId,r.dinhMuc,r.giaThang,r.giaNgay,r.dienGiai,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteBangGiaXe(row: BangGiaXe) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: BangGiaXe) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.banggiaxeService.deleteBangGiaXe(row.bangGiaXeId)
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

    editBangGiaXe(row: BangGiaXe) {
        this.editingRowName = { name: row.dienGiai };
        this.sourcebanggiaxe = row;
        this.banggiaxeEdit = this.BangGiaXeEditor.editBangGiaXe(row);
        this.editorModal.show();
    }    
}