import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { VatTuHinhAnhService } from "../../services/vattuhinhanh.service";
import { VatTuHinhAnh } from "../../models/vattuhinhanh.model";
import { VatTuHinhAnhInfoComponent } from "./vattuhinhanh-info.component";

@Component({
    selector: "vattuhinhanh",
    templateUrl: "./vattuhinhanh.component.html",
    styleUrls: ["./vattuhinhanh.component.css"]
})

export class VatTuHinhAnhComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: VatTuHinhAnh[] = [];
    rowsCache: VatTuHinhAnh[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    vattuhinhanhEdit: VatTuHinhAnh;
    sourcevattuhinhanh: VatTuHinhAnh;
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

    @ViewChild('vattuhinhanhEditor')
    VatTuHinhAnhEditor: VatTuHinhAnhInfoComponent;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private vattuhinhanhService: VatTuHinhAnhService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { name: gT('Hình ảnh'), cellTemplate: this.descriptionTemplate },
            { prop: 'tenHinhAnh', name: gT('Tên hình ảnh') },
            { prop: 'dienGiai', name: gT('Diễn giải') },
            { name: gT('Chức năng'), width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        this.VatTuHinhAnhEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.VatTuHinhAnhEditor.changesCancelledCallback = () => {
            this.vattuhinhanhEdit = null;
            this.sourcevattuhinhanh = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        this.loadData();
        if (this.sourcevattuhinhanh) {
            Object.assign(this.sourcevattuhinhanh, this.vattuhinhanhEdit);
            this.vattuhinhanhEdit = null;
            this.sourcevattuhinhanh = null;
        }
        else {
            let objVatTuHinhAnh = new VatTuHinhAnh();
            Object.assign(objVatTuHinhAnh, this.vattuhinhanhEdit);
            this.vattuhinhanhEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objVatTuHinhAnh).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objVatTuHinhAnh);
            this.rows.splice(0, 0, objVatTuHinhAnh);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.vattuhinhanhService.getAllVatTuHinhAnh().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: VatTuHinhAnh[]) {
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

    newVatTuHinhAnh() {
        this.editingRowName = null;
        this.sourcevattuhinhanh = null;
        this.vattuhinhanhEdit = this.VatTuHinhAnhEditor.newVatTuHinhAnh();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.tenHinhAnh,r.dienGiai));
    }

    deleteVatTuHinhAnh(row: VatTuHinhAnh) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: VatTuHinhAnh) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.vattuhinhanhService.deleteVatTuHinhAnh(row.vatTuHinhAnhId)
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

    editVatTuHinhAnh(row: VatTuHinhAnh) {
        this.editingRowName = { name: row.tenHinhAnh };
        this.sourcevattuhinhanh = row;
        this.VatTuHinhAnhEditor.isEdit = true;
        this.vattuhinhanhEdit = this.VatTuHinhAnhEditor.editVatTuHinhAnh(row);
        this.editorModal.show();
    }    

    onEditorModalHidden() {
        this.editingRowName = null;
        this.VatTuHinhAnhEditor.resetForm(true);
    }
}