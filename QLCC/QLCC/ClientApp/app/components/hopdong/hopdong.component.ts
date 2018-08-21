import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router, NavigationExtras } from '@angular/router';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { HopDongService } from "../../services/hopdong.service";
import { HopDong } from "../../models/hopdong.model";
import { HopDongInfoComponent } from "./hopdong-info.component";

@Component({
    selector: "hopdong",
    templateUrl: "./hopdong.component.html",
    styleUrls: ["./hopdong.component.css"]
})

export class HopDongComponent implements OnInit, AfterViewInit {
    public limit: number = 10;
    columns: any[] = [];
    rows: HopDong[] = [];
    rowsCache: HopDong[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    hopdongEdit: HopDong;
    sourcehopdong: HopDong;
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

    @ViewChild('hopdongEditor')
    HopDongEditor: HopDongInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private hopdongService: HopDongService, private router: Router) {
    }
    
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },              
            { prop: 'soHopDong', name: gT('Số hợp đồng') },
            { prop: 'hopDong', name: gT('Tên hợp đồng')},
            { prop: 'khachHangId', name: gT('Khách hàng')},
            { prop: 'ngayKy', name: gT('Ngày ký')},
            { name: 'Quản trị', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }
    
    ngAfterViewInit() {
        
    }
    
    addNewToList() {
        if (this.sourcehopdong) {
            Object.assign(this.sourcehopdong, this.hopdongEdit);
            this.hopdongEdit = null;
            this.sourcehopdong = null;
        }
        else {
            let objHopDong = new HopDong();
            Object.assign(objHopDong, this.hopdongEdit);
            this.hopdongEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            
            (<any>objHopDong).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objHopDong);
            this.rows.splice(0, 0, objHopDong);
        }
    }
    
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.hopdongService.getAllHopDong().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    
    onDataLoadSuccessful(obj: HopDong[]) {
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

    newHopDong() {
        this.router.navigate(['./themhopdong']);
    }
    
    SelectedValue(value: number) {
        this.limit = value;
    }
    
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.hopDongId, r.tenhopDong, r.soHopDong, r.loaiHopDong, r.mauHopDong, r.khachHangId, r.ngayKy, r.ngayHieuLuc, r.thoiHan, r.kyThanhToan, r.hanThanhToan, r.ngayBanGiao, r.tyleDCGT, r.soNamDCGT, r.mucDCGT, r.loaiTienId, r.tyGia, r.giaThue, r.tienCoc, r.nguoiNhap, r.ngayNhap, r.nguoiSua, r.ngaySua));
    }

    deleteHopDong(row: HopDong) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }
    
    deleteHelper(row: HopDong) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.hopdongService.deleteHopDong(row.hopDongId)
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

    editHopDong(row: HopDong) {
        //this.editingRowName = { name: row.tenhopDong };
        //this.sourcehopdong = row;
        //this.hopdongEdit = this.HopDongEditor.editHopDong(row);
        //this.editorModal.show();
    }    
}