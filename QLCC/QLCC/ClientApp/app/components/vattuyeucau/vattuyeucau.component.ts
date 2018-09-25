import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { VatTuYeuCauService } from "../../services/vattuyeucau.service";
import { VatTuYeuCau } from "../../models/vattuyeucau.model";
import { VatTuYeuCauInfoComponent } from "./vattuyeucau-info.component";

@Component({
    selector: "vattuyeucau",
    templateUrl: "./vattuyeucau.component.html",
    styleUrls: ["./vattuyeucau.component.css"]
})

export class VatTuYeuCauComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: VatTuYeuCau[] = [];
    rowsCache: VatTuYeuCau[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    vattuyeucauEdit: VatTuYeuCau;
    sourcevattuyeucau: VatTuYeuCau;
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

    @ViewChild('vattuyeucauEditor')
    VatTuYeuCauEditor: VatTuYeuCauInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private vattuyeucauService: VatTuYeuCauService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'phieuYeuCauVTId', name: gT('PhieuYeuCauVTId')},
			{ prop: 'vatTuId', name: gT('VatTuId')},
			{ prop: 'donViTinhId', name: gT('DonViTinhId')},
			{ prop: 'quocTichId', name: gT('QuocTichId')},
			{ prop: 'soLuong', name: gT('SoLuong')},
			{ prop: 'ghiChu', name: gT('GhiChu')},
			{ prop: 'nguoiNhap', name: gT('NguoiNhap')},
			{ prop: 'ngayNhap', name: gT('NgayNhap')},
			{ prop: 'nguoiSua', name: gT('NguoiSua')},
			{ prop: 'ngaySua', name: gT('NgaySua')},
            { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.VatTuYeuCauEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.VatTuYeuCauEditor.changesCancelledCallback = () => {
            this.vattuyeucauEdit = null;
            this.sourcevattuyeucau = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcevattuyeucau) {
            Object.assign(this.sourcevattuyeucau, this.vattuyeucauEdit);
            this.vattuyeucauEdit = null;
            this.sourcevattuyeucau = null;
        }
        else {
            let objVatTuYeuCau = new VatTuYeuCau();
            Object.assign(objVatTuYeuCau, this.vattuyeucauEdit);
            this.vattuyeucauEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objVatTuYeuCau).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objVatTuYeuCau);
            this.rows.splice(0, 0, objVatTuYeuCau);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.vattuyeucauService.getAllVatTuYeuCau().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: VatTuYeuCau[]) {
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
        this.VatTuYeuCauEditor.resetForm(true);
    }

    newVatTuYeuCau() {
        this.editingRowName = null;
        this.sourcevattuyeucau = null;
        this.vattuyeucauEdit = this.VatTuYeuCauEditor.newVatTuYeuCau();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.yeuCauvatTuId,r.phieuYeuCauVTId,r.vatTuId,r.donViTinhId,r.quocTichId,r.soLuong,r.ghiChu,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteVatTuYeuCau(row: VatTuYeuCau) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: VatTuYeuCau) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.vattuyeucauService.deleteVatTuYeuCau(row.vatTuYeuCauId)
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

    editVatTuYeuCau(row: VatTuYeuCau) {
        this.editingRowName = { name: row.tenVatTuYeuCau };
        this.sourcevattuyeucau = row;
        this.vattuyeucauEdit = this.VatTuYeuCauEditor.editVatTuYeuCau(row);
        this.editorModal.show();
    }    
}