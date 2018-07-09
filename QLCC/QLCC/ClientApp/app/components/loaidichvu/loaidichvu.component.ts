﻿import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { LoaiDichVuService } from "../../services/loaidichvu.service";
import { LoaiDichVu } from "../../models/loaidichvu.model";
import { LoaiDichVuInfoComponent } from "./loaidichvu-info.component";
import { forEach } from '@angular/router/src/utils/collection';

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
    sourceloaidichvu: LoaiDichVu;
    editingRowName: { name: string };


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

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('loaidichvuEditor')
    LoaiDichVuEditor: LoaiDichVuInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private loaidichvuService: LoaiDichVuService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
            { prop: 'tenLoaiDichVu', name: gT('Tên loại dịch vụ')},
            { prop: 'moTa', name: gT('Mô tả')},
            { prop: 'viTri', name: gT('Vị trí')},
			{ prop: 'maLoaiDichVuCha', name: gT('MaLoaiDichVuCha')},
            { prop: 'trangThai', name: gT('TrangThai'), cellTemplate: this.statusTemplate },
            { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
        this.getParentValue();
    }
    
    ngAfterViewInit() {
        this.LoaiDichVuEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.LoaiDichVuEditor.changesCancelledCallback = () => {
            this.loaidichvuEdit = null;
            this.sourceloaidichvu = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
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
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.loaidichvuService.getAllLoaiDichVu().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: LoaiDichVu[]) {
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
        this.LoaiDichVuEditor.resetForm(true);
    }

    newLoaiDichVu() {
        this.editingRowName = null;
        this.sourceloaidichvu = null;
        this.loaidichvuEdit = this.LoaiDichVuEditor.newLoaiDichVu();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.loaiDichVuId,r.tenLoaiDichVu,r.moTa,r.viTri,r.maLoaiDichVuCha,r.dichVuCoBan,r.trangThai,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteLoaiDichVu(row: LoaiDichVu) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: LoaiDichVu) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.loaidichvuService.deleteLoaiDichVu(row.loaiDichVuId)
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

    editLoaiDichVu(row: LoaiDichVu) {
        this.editingRowName = { name: row.tenLoaiDichVu };
        this.sourceloaidichvu = row;
        this.loaidichvuEdit = this.LoaiDichVuEditor.editLoaiDichVu(row);
        this.editorModal.show();
    }    

    getParentValue() {
        var name = this.loaidichvuEdit.tenLoaiDichVu;
        var id = this.loaidichvuEdit.loaiDichVuId.toString();
        var macha = this.loaidichvuEdit.maLoaiDichVuCha;
        var parent_id = 0;
        for (let data of this.rowsCache) {
            if (parent_id == macha) {
                console.log(name);
            }
        }
    }
}