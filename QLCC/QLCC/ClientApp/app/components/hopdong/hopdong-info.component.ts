import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { HopDong } from "../../models/hopdong.model";
import { HopDongService } from "./../../services/hopdong.service";
import { KhachHangService } from "./../../services/khachhang.service";
import { KhachHang } from '../../models/khachhang.model';

@Component({
    selector: "hopdong-info",
    templateUrl: "./hopdong-info.component.html",
    styleUrls: ["./hopdong-info.component.css"]
})

export class HopDongInfoComponent implements OnInit {
    private id: number = 0;

    public isFullScreenModal: boolean = false;
    isViewDetails = false;
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    public heightScroll: number = 480;
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private HopDongEdit: HopDong = new HopDong();
    public valueNgaybangiao: Date = new Date();
    public valueNgayhieuluc: Date = new Date();
    public valueNgayky: Date = new Date();    
    private isEditMode = false;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isHoverChangeInputDate = true;
    public isFocusChangeInputDate = 1;

    khachhangsFilter: KhachHang[];
    khachhangs: KhachHang[] = [];
    khachhang: KhachHang = new KhachHang();
    khachhangChk: boolean = false;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;  

    constructor(private alertService: AlertService, private gvService: HopDongService, private route: ActivatedRoute, private khachhangService: KhachHangService) {
    }

    ngOnInit() {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        if (this.id != 0) {
            this.loadData();
        } else {
            this.themmoiHopDong();
        }
    }

    themmoiHopDong() {
        this.loadKhachhang(true);
        this.HopDongEdit = new HopDong();
        this.HopDongEdit.loaiHopDong = 1;
    }

    loadKhachhang(isNew: boolean) {
        var where = "";
        if (isNew) where = "KhachHangId not in (Select KhachHangId From tbl_HopDong)";
        else where = "KhachHangId not in (Select KhachHangId From tbl_HopDong where KhachHangId != " + this.HopDongEdit.khachHangId + ")";
        this.khachhangService.getItems(0, 0, where, "KhDoanhNghiep DESC").subscribe(results => {
            this.khachhangs = results;
            this.khachhangsFilter = results;
        }, error => this.onDataLoadFailed(error));
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getHopDongByID().subscribe(result => {
            this.alertService.stopLoadingMessage();
            this.HopDongEdit = result;
            this.loadKhachhang(false);
        }, error => this.onDataLoadFailed(error));
    }

    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    private cancel() {
        this.HopDongEdit = new HopDong();
        this.showValidationErrors = false;
        //this.resetForm();
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    public onHovering(event) {
        event.target.parentElement.children[0].setAttribute('class', "isHoverChangeInputDate");
    }

    public onUnovering(event) {

        if (this.isFocusChangeInputDate == 1) {
            event.target.parentElement.children[0].setAttribute('class', "text-display");
        } else {
            event.target.parentElement.children[0].setAttribute('class', "isHoverChangeInputDate");
        }
    }

    public focusFunction(event) {
        event.target.parentElement.children[0].setAttribute('class', "isHoverChangeInputDate");
        this.isFocusChangeInputDate = 2;
    }

    public focusOutFunction(event) {
        event.target.parentElement.children[0].setAttribute('class', "text-display");
        this.isFocusChangeInputDate = 1;
    }

    private save() {
        alert(123);
        //this.isSaving = true;
        //this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
        //if (this.isNew) {
        //    this.gvService.addnewHopDong(this.HopDongEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        //}
        //else {
        //    this.gvService.updateHopDong(this.HopDongEdit.hopDongId, this.HopDongEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        //}
    }

    private saveSuccessHelper(obj?: HopDong) {
        if (obj)
            Object.assign(this.HopDongEdit, obj);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;
        if (this.isGeneralEditor) {
            if (this.isNew) {
                this.alertService.showMessage("Thành công", `Thực hiện thêm mới thành công`, MessageSeverity.success);
            }
            else
                this.alertService.showMessage("Thành công", `Thực hiện thay đổi thông tin thành công`, MessageSeverity.success);
        }
        this.HopDongEdit = new HopDong();
        //this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    khachhangChange(khachhang: KhachHang) {
        if (khachhang != null) {
            this.khachhangChk = true;            
        }
        else this.khachhangChk = false;
    }

    khachhangfilterChange(value) {
        this.khachhangsFilter = this.khachhangs.filter((s) => s.tenDayDu.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
}