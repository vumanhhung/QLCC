import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { VatTuPhieuDiChuyenService } from "../../services/vattuphieudichuyen.service";
import { VatTuPhieuDiChuyen } from "../../models/vattuphieudichuyen.model";
import { VatTuPhieuDiChuyenInfoComponent } from "./vattuphieudichuyen-info.component";

@Component({
    selector: "vattuphieudichuyen",
    templateUrl: "./vattuphieudichuyen.component.html",
    styleUrls: ["./vattuphieudichuyen.component.css"]
})

export class VatTuPhieuDiChuyenComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: VatTuPhieuDiChuyen[] = [];
    rowsCache: VatTuPhieuDiChuyen[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    vattuphieudichuyenEdit: VatTuPhieuDiChuyen;
    sourcevattuphieudichuyen: VatTuPhieuDiChuyen;
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

    @ViewChild('vattuphieudichuyenEditor')
    VatTuPhieuDiChuyenEditor: VatTuPhieuDiChuyenInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private vattuphieudichuyenService: VatTuPhieuDiChuyenService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'phieuYeuCauVTId', name: gT('PhieuYeuCauVTId')},
			{ prop: 'donViQLTS', name: gT('DonViQLTS')},
			{ prop: 'ngayYeuCau', name: gT('NgayYeuCau')},
			{ prop: 'nguoiYeuCau', name: gT('NguoiYeuCau')},
			{ prop: 'donViYeuCau', name: gT('DonViYeuCau')},
			{ prop: 'daiDienDVYC', name: gT('DaiDienDVYC')},
			{ prop: 'donViNhan', name: gT('DonViNhan')},
			{ prop: 'daiDienDVN', name: gT('DaiDienDVN')},
			{ prop: 'noiDung', name: gT('NoiDung')},
			{ prop: 'ghiChu', name: gT('GhiChu')},
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
        this.VatTuPhieuDiChuyenEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.VatTuPhieuDiChuyenEditor.changesCancelledCallback = () => {
            this.vattuphieudichuyenEdit = null;
            this.sourcevattuphieudichuyen = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcevattuphieudichuyen) {
            Object.assign(this.sourcevattuphieudichuyen, this.vattuphieudichuyenEdit);
            this.vattuphieudichuyenEdit = null;
            this.sourcevattuphieudichuyen = null;
        }
        else {
            let objVatTuPhieuDiChuyen = new VatTuPhieuDiChuyen();
            Object.assign(objVatTuPhieuDiChuyen, this.vattuphieudichuyenEdit);
            this.vattuphieudichuyenEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objVatTuPhieuDiChuyen).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objVatTuPhieuDiChuyen);
            this.rows.splice(0, 0, objVatTuPhieuDiChuyen);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.vattuphieudichuyenService.getAllVatTuPhieuDiChuyen().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: VatTuPhieuDiChuyen[]) {
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
        this.VatTuPhieuDiChuyenEditor.resetForm(true);
    }

    newVatTuPhieuDiChuyen() {
        this.editingRowName = null;
        this.sourcevattuphieudichuyen = null;
        this.vattuphieudichuyenEdit = this.VatTuPhieuDiChuyenEditor.newVatTuPhieuDiChuyen();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.phieuDiChuyenId,r.phieuYeuCauVTId,r.donViQLTS,r.ngayYeuCau,r.nguoiYeuCau,r.donViYeuCau,r.daiDienDVYC,r.donViNhan,r.daiDienDVN,r.noiDung,r.ghiChu,r.trangThai,r.nguoiNhap,r.ngayNhap,r.nguoiSua,r.ngaySua));
    }

    deleteVatTuPhieuDiChuyen(row: VatTuPhieuDiChuyen) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: VatTuPhieuDiChuyen) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.vattuphieudichuyenService.deleteVatTuPhieuDiChuyen(row.phieuDiChuyenId)
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

    editVatTuPhieuDiChuyen(row: VatTuPhieuDiChuyen) {
        this.sourcevattuphieudichuyen = row;
        this.vattuphieudichuyenEdit = this.VatTuPhieuDiChuyenEditor.editVatTuPhieuDiChuyen(row);
        this.editorModal.show();
    }    
}