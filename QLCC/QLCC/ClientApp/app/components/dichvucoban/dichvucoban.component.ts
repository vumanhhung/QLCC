import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { DichVuCoBanService } from "../../services/dichvucoban.service";
import { DichVuCoBan } from "../../models/dichvucoban.model";
import { DichVuCoBanInfoComponent } from "./dichvucoban-info.component";
import { MatBang } from '../../models/matbang.model';
import { KhachHang } from '../../models/khachhang.model';
import { LoaiDichVu } from '../../models/loaidichvu.model';
import { DonViTinh } from '../../models/donvitinh.model';
import { LoaiTien } from '../../models/loaitien.model';
import { KhachHangService } from '../../services/khachhang.service';
import { MatBangService } from '../../services/matbang.service';
import { LoaiDichVuService } from '../../services/loaidichvu.service';
import { DonViTinhService } from '../../services/donvitinh.service';
import { LoaiTienService } from '../../services/loaitien.service';

@Component({
    selector: "dichvucoban",
    templateUrl: "./dichvucoban.component.html",
    styleUrls: ["./dichvucoban.component.css"]
})

export class DichVuCoBanComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: DichVuCoBan[] = [];
    rowsCache: DichVuCoBan[] = [];
    matBang: MatBang[] = [];
    khachHang: KhachHang[] = [];
    loaiDichVu: LoaiDichVu[] = [];
    donViTinh: DonViTinh[] = [];
    loaiTien: LoaiTien[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    dichvucobanEdit: DichVuCoBan;
    sourcedichvucoban: DichVuCoBan;
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

    @ViewChild('dichvucobanEditor')
    DichVuCoBanEditor: DichVuCoBanInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService,
        private dichvucobanService: DichVuCoBanService,
        private khachHangService: KhachHangService,
        private matbangService: MatBangService,
        private loaidichvuService: LoaiDichVuService,
        private donvitinhService: DonViTinhService,
        private loaitienService: LoaiTienService) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
			{ prop: 'soChungTu', name: gT('SoChungTu')},
			{ prop: 'ngayChungTu', name: gT('NgayChungTu')},
			{ prop: 'matBangId', name: gT('MatBangId')},
			{ prop: 'khachHangId', name: gT('KhachHangId')},
			{ prop: 'loaiDichVuId', name: gT('LoaiDichVuId')},
			{ prop: 'donViTinhId', name: gT('DonViTinhId')},
			{ prop: 'donGia', name: gT('DonGia')},
			{ prop: 'soLuong', name: gT('SoLuong')},
			{ prop: 'thanhTien', name: gT('ThanhTien')},
			{ prop: 'ngayThanhToan', name: gT('NgayThanhToan')},
			{ prop: 'kyThanhToan', name: gT('KyThanhToan')},
			{ prop: 'tienThanhToan', name: gT('TienThanhToan')},
			{ prop: 'tienTTQuyDoi', name: gT('TienTTQuyDoi')},
			{ prop: 'loaiTienId', name: gT('LoaiTienId')},
			{ prop: 'tyGia', name: gT('TyGia')},
			{ prop: 'tuNgay', name: gT('TuNgay')},
			{ prop: 'denNgay', name: gT('DenNgay')},
			{ prop: 'dienGiai', name: gT('DienGiai')},
			{ prop: 'lapLai', name: gT('LapLai')},
			{ prop: 'trangThai', name: gT('TrangThai')},
            { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }

    loadAllKhachHang() {
        this.khachHangService.getAllKhachHang().subscribe(results => this.onDataLoadKhachHangSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadKhachHangSuccessful(obj: KhachHang[]) {
        this.khachHang = obj;
    }
    
    ngAfterViewInit() {
        this.DichVuCoBanEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.editorModal.hide();
        };

        this.DichVuCoBanEditor.changesCancelledCallback = () => {
            this.dichvucobanEdit = null;
            this.sourcedichvucoban = null;
            this.editorModal.hide();
        };
    }
    
    addNewToList() {
        if (this.sourcedichvucoban) {
            Object.assign(this.sourcedichvucoban, this.dichvucobanEdit);
            this.dichvucobanEdit = null;
            this.sourcedichvucoban = null;
        }
        else {
            let objDichVuCoBan = new DichVuCoBan();
            Object.assign(objDichVuCoBan, this.dichvucobanEdit);
            this.dichvucobanEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objDichVuCoBan).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objDichVuCoBan);
            this.rows.splice(0, 0, objDichVuCoBan);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.dichvucobanService.getAllDichVuCoBan().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: DichVuCoBan[]) {
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
        this.DichVuCoBanEditor.resetForm(true);
    }

    newDichVuCoBan() {
        this.editingRowName = null;
        this.sourcedichvucoban = null;
        this.dichvucobanEdit = this.DichVuCoBanEditor.newDichVuCoBan();
        this.editorModal.show();
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false,r.dichVuCoBanId,r.soChungTu,r.ngayChungTu,r.matBangId,r.khachHangId,r.loaiDichVuId,r.donViTinhId,r.donGia,r.soLuong,r.thanhTien,r.ngayThanhToan,r.kyThanhToan,r.tienThanhToan,r.tienTTQuyDoi,r.loaiTienId,r.tyGia,r.tuNgay,r.denNgay,r.dienGiai,r.lapLai,r.trangThai,r.ngayNhap,r.nguoiNhap,r.ngaySua,r.nguoiSua));
    }

    deleteDichVuCoBan(row: DichVuCoBan) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: DichVuCoBan) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.dichvucobanService.deleteDichVuCoBan(row.dichVuCoBanId)
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

    editDichVuCoBan(row: DichVuCoBan) {
        //this.editingRowName = { name: row.tenichVuCoBan };
        this.sourcedichvucoban = row;
        this.dichvucobanEdit = this.DichVuCoBanEditor.editDichVuCoBan(row);
        this.editorModal.show();
    }    
}