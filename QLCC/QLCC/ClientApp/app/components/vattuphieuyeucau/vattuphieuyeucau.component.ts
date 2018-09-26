import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { VatTuPhieuYeuCauService } from "../../services/vattuphieuyeucau.service";
import { VatTuPhieuYeuCau } from "../../models/vattuphieuyeucau.model";
import { VatTuPhieuYeuCauInfoComponent } from "./vattuphieuyeucau-info.component";

@Component({
    selector: "vattuphieuyeucau",
    templateUrl: "./vattuphieuyeucau.component.html",
    styleUrls: ["./vattuphieuyeucau.component.css"]
})

export class VatTuPhieuYeuCauComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: VatTuPhieuYeuCau[] = [];
    rowsCache: VatTuPhieuYeuCau[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    vattuphieuyeucauEdit: VatTuPhieuYeuCau;
    sourcevattuphieuyeucau: VatTuPhieuYeuCau;
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

    @ViewChild('vattuphieuyeucauEditor')
    VatTuPhieuYeuCauEditor: VatTuPhieuYeuCauInfoComponent;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private vattuphieuyeucauService: VatTuPhieuYeuCauService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'nguoiYeuCau', name: gT('NguoiYeuCau')},
			{ prop: 'phongBanId', name: gT('PhongBanId')},
			{ prop: 'toaNhaId', name: gT('ToaNhaId')},
			{ prop: 'mucDichSuDung', name: gT('MucDichSuDung')},
			{ prop: 'nguoiTiepNhan', name: gT('NguoiTiepNhan')},
			{ prop: 'dienGiai', name: gT('DienGiai')},
			{ prop: 'nguoiDuyet', name: gT('NguoiDuyet')},
			{ prop: 'trangThai', name: gT('TrangThai')},
            { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.VatTuPhieuYeuCauEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.VatTuPhieuYeuCauEditor.editorModal.hide();
        };

        this.VatTuPhieuYeuCauEditor.changesCancelledCallback = () => {
            this.vattuphieuyeucauEdit = null;
            this.sourcevattuphieuyeucau = null;
            this.VatTuPhieuYeuCauEditor.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcevattuphieuyeucau) {
            Object.assign(this.sourcevattuphieuyeucau, this.vattuphieuyeucauEdit);
            this.vattuphieuyeucauEdit = null;
            this.sourcevattuphieuyeucau = null;
        }
        else {
            let objVatTuPhieuYeuCau = new VatTuPhieuYeuCau();
            Object.assign(objVatTuPhieuYeuCau, this.vattuphieuyeucauEdit);
            this.vattuphieuyeucauEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objVatTuPhieuYeuCau).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objVatTuPhieuYeuCau);
            this.rows.splice(0, 0, objVatTuPhieuYeuCau);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.vattuphieuyeucauService.getAllVatTuPhieuYeuCau().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: VatTuPhieuYeuCau[]) {
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

    newVatTuPhieuYeuCau() {
        this.editingRowName = null;
        this.sourcevattuphieuyeucau = null;
        this.vattuphieuyeucauEdit = this.VatTuPhieuYeuCauEditor.newVatTuPhieuYeuCau();
        this.VatTuPhieuYeuCauEditor.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.phieuYeuCauVTId,r.nguoiYeuCau,r.phongBanId,r.toaNhaId,r.mucDichSuDung,r.nguoiTiepNhan,r.dienGiai,r.nguoiDuyet,r.trangThai));
    }

    deleteVatTuPhieuYeuCau(row: VatTuPhieuYeuCau) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: VatTuPhieuYeuCau) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.vattuphieuyeucauService.deleteVatTuPhieuYeuCau(row.phieuYeuCauVTId)
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

    editVatTuPhieuYeuCau(row: VatTuPhieuYeuCau) {
        //this.editingRowName = { name: row.tenVatTuPhieuYeuCau };
        this.sourcevattuphieuyeucau = row;
        this.vattuphieuyeucauEdit = this.VatTuPhieuYeuCauEditor.editVatTuPhieuYeuCau(row);
        this.VatTuPhieuYeuCauEditor.editorModal.show();
    }    
}