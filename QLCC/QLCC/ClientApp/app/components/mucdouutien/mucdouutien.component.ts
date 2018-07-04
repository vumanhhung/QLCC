import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { MucDoUuTienService } from "../../services/mucdouutien.service";
import { MucDoUuTien } from "../../models/mucdouutien.model";
import { MucDoUuTienInfoComponent } from "./mucdouutien-info.component";

@Component({
    selector: "mucdouutien",
    templateUrl: "./mucdouutien.component.html",
    styleUrls: ["./mucdouutien.component.css"]
})

export class MucDoUuTienComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: MucDoUuTien[] = [];
    rowsCache: MucDoUuTien[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    mucdouutienEdit: MucDoUuTien;
    sourcemucdouutien: MucDoUuTien;
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

    @ViewChild('mucdouutienEditor')
    MucDoUuTienEditor: MucDoUuTienInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private mucdouutienService: MucDoUuTienService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenMucDoUuTien', name: 'Tên mức độ ưu tiên'},			
            { name: 'Chức năng', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.MucDoUuTienEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.MucDoUuTienEditor.changesCancelledCallback = () => {
            this.mucdouutienEdit = null;
            this.sourcemucdouutien = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcemucdouutien) {
            Object.assign(this.sourcemucdouutien, this.mucdouutienEdit);
            this.mucdouutienEdit = null;
            this.sourcemucdouutien = null;
        }
        else {
            let objMucDoUuTien = new MucDoUuTien();
            Object.assign(objMucDoUuTien, this.mucdouutienEdit);
            this.mucdouutienEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objMucDoUuTien).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objMucDoUuTien);
            this.rows.splice(0, 0, objMucDoUuTien);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.mucdouutienService.getAllMucDoUuTien().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: MucDoUuTien[]) {
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
        this.MucDoUuTienEditor.resetForm(true);
    }

    newMucDoUuTien() {
        this.editingRowName = null;
        this.sourcemucdouutien = null;
        this.mucdouutienEdit = this.MucDoUuTienEditor.newMucDoUuTien();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.mucDoUuTienId,r.tenMucDoUuTien,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteMucDoUuTien(row: MucDoUuTien) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: MucDoUuTien) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.mucdouutienService.deleteMucDoUuTien(row.mucDoUuTienId)
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

    editMucDoUuTien(row: MucDoUuTien) {
        this.editingRowName = { name: row.tenMucDoUuTien };
        this.sourcemucdouutien = row;
        this.mucdouutienEdit = this.MucDoUuTienEditor.editMucDoUuTien(row);
        this.editorModal.show();
    }    
}