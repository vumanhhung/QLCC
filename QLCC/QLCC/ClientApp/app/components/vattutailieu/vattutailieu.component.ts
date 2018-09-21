import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { VatTuTaiLieuService } from "../../services/vattutailieu.service";
import { VatTuTaiLieu } from "../../models/vattutailieu.model";
import { VatTuTaiLieuInfoComponent } from "./vattutailieu-info.component";
import { VatTuService } from '../../services/vattu.service';
import { VatTu } from '../../models/vattu.model';

@Component({
    selector: "vattutailieu",
    templateUrl: "./vattutailieu.component.html",
    styleUrls: ["./vattutailieu.component.css"]
})

export class VatTuTaiLieuComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: VatTuTaiLieu[] = [];
    rowsCache: VatTuTaiLieu[] = [];
    vattu: VatTu[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    vattutailieuEdit: VatTuTaiLieu;
    sourcevattutailieu: VatTuTaiLieu;
    editingRowName: { name: string };
    public selectedVattu: number = 0;

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

    @ViewChild('vattutailieuEditor')
    VatTuTaiLieuEditor: VatTuTaiLieuInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private vattutailieuService: VatTuTaiLieuService, private vattuService: VatTuService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'tenTaiLieu', name: gT('TenTaiLieu')},
            //{ prop: 'dienGiai', name: gT('DienGiai')},
            { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData(0);
        this.loadAllVatTu();
    }

    loadAllVatTu() {
        this.vattuService.getAllVatTu().subscribe(results => this.onDataLoadVatTuSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadVatTuSuccessful(obj: VatTu[]) {
        this.vattu = obj;
    }
    
    ngAfterViewInit() {
        //this.VatTuTaiLieuEditor.changesSavedCallback = () => {
        //    this.addNewToList();
        //    this.editorModal.hide();
        //};

        //this.VatTuTaiLieuEditor.changesCancelledCallback = () => {
        //    this.vattutailieuEdit = null;
        //    this.sourcevattutailieu = null;
        //    this.editorModal.hide();
        //};
    }
    
    addNewToList() {
        if (this.sourcevattutailieu) {
            Object.assign(this.sourcevattutailieu, this.vattutailieuEdit);
            this.vattutailieuEdit = null;
            this.sourcevattutailieu = null;
        }
        else {
            let objVatTuTaiLieu = new VatTuTaiLieu();
            Object.assign(objVatTuTaiLieu, this.vattutailieuEdit);
            this.vattutailieuEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objVatTuTaiLieu).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objVatTuTaiLieu);
            this.rows.splice(0, 0, objVatTuTaiLieu);
        }
    }
    
    loadData(value: number) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        if (value == 0) {
            this.vattutailieuService.getAllVatTuTaiLieu().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
        } else {
            this.vattutailieuService.getFilter(value).subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
        }
    }
    
    onDataLoadSuccessful(obj: VatTuTaiLieu[]) {
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
        this.VatTuTaiLieuEditor.resetForm(true);
    }

    newVatTuTaiLieu() {
        this.editingRowName = null;
        this.sourcevattutailieu = null;
        this.vattutailieuEdit = this.VatTuTaiLieuEditor.newVatTuTaiLieu();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.vatTutaiLieuId, r.tenTaiLieu, r.urlTaiLieu,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteVatTuTaiLieu(row: VatTuTaiLieu) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: VatTuTaiLieu) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.vattutailieuService.deleteVatTuTaiLieu(row.vatTutaiLieuId)
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

    editVatTuTaiLieu(row: VatTuTaiLieu) {
        this.editingRowName = { name: row.tenTaiLieu };
        this.sourcevattutailieu = row;
        this.vattutailieuEdit = this.VatTuTaiLieuEditor.editVatTuTaiLieu(row);
        this.editorModal.show();
    }    

    SelectedVattuValue(value: number) {
        this.loadData(value);
    }
}