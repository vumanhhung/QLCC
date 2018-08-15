import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { BangGiaXeService } from "../../services/banggiaxe.service";
import { BangGiaXe } from "../../models/banggiaxe.model";
import { BangGiaXeInfoComponent } from "./banggiaxe-info.component";
import { AuthService } from '../../services/auth.service';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { LoaiXeService } from '../../services/loaixe.service';
import { LoaiXe } from '../../models/loaixe.model';

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
    objNDTN: NguoiDungToaNha = new NguoiDungToaNha();
    loaixes: LoaiXe[] = [];

    @ViewChild('f')
    private form;

    @ViewChild('giaNgayTemplate')
    giaNgayTemplate: TemplateRef<any>;

    @ViewChild('giaThangTemplate')
    giaThangTemplate: TemplateRef<any>;

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
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private banggiaxeService: BangGiaXeService, private authService: AuthService, private nguoidungtoanhaService: NguoiDungToaNhaService, private loaixeService: LoaiXeService) {
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'loaiXe.tenLoaiXe', name: gT('Loại xe') },
            { prop: 'dinhMuc', name: gT('Định mức') },
            { name: gT('Giá theo tháng'), cellTemplate: this.giaThangTemplate },
            { name: gT('Giá theo ngày'), cellTemplate: this.giaNgayTemplate },            
            { prop: 'dienGiai', name: gT('Ghi chú') },
            { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        if (this.authService.currentUser) {
            var userId = this.authService.currentUser.id;
            var where = "NguoiDungId = '" + userId + "'";
            this.nguoidungtoanhaService.getItems(0, 1, where, "x").subscribe(result => this.getNguoiDungToaNha(result), error => {
                this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng tòa nhà từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
        }
    }

    getNguoiDungToaNha(list: NguoiDungToaNha[]) {
        if (list.length > 0) {
            this.objNDTN = list[0];
            this.loadData();
            this.loaixeService.getAllLoaiXe().subscribe(results => { this.loaixes = results }
                , error => {
                    this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error)
                });
        }
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
        this.loadData();
        if (this.sourcebanggiaxe) {
            Object.assign(this.sourcebanggiaxe, this.banggiaxeEdit);
            this.banggiaxeEdit = null;
            this.sourcebanggiaxe = null;
        }
        else {
            //let objBangGiaXe = new BangGiaXe();
            //Object.assign(objBangGiaXe, this.banggiaxeEdit);
            //this.banggiaxeEdit = null;

            //let maxIndex = 0;
            //for (let u of this.rowsCache) {
            //    if ((<any>u).index > maxIndex)
            //        maxIndex = (<any>u).index;
            //}

            //(<any>objBangGiaXe).index = maxIndex + 1;

            //this.rowsCache.splice(0, 0, objBangGiaXe);
            //this.rows.splice(0, 0, objBangGiaXe);
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.banggiaxeService.getItems(0, 0, "ToaNhaId = " + this.objNDTN.toaNhaId, "x").subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
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

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
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
        this.BangGiaXeEditor.toaNhaId = this.objNDTN.toaNhaId;
        this.BangGiaXeEditor.loaixes = this.loaixes;
        this.editorModal.show();
    }

    SelectedValue(value: number) {
        this.limit = value;
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.bangGiaXeId, r.toaNhaId, r.loaiXeId, r.dinhMuc, r.giaThang, r.giaNgay, r.dienGiai, r.nguoiNhap, r.ngayNhap, r.nguoiSua, r.ngaySua));
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
        this.BangGiaXeEditor.loaixes = this.loaixes;
        this.editorModal.show();
    }

    formatPrice(price: string): string {
        if (price) {            
            var pN = Number(price);
            var fm = Utilities.formatNumber(pN);
            return fm;
        } else return "";        
    }
}