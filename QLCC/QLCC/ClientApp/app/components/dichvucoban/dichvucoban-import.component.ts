import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import * as XLSX from 'ts-xlsx';
import { Observable } from 'rxjs/Observable';
import { DichVuCoBan } from '../../models/dichvucoban.model';
import { DichVuCoBanService } from '../../services/dichvucoban.service';
import { MatBangService } from '../../services/matbang.service';
import { MatBang } from '../../models/matbang.model';
import { KhachHang } from '../../models/khachhang.model';
import { LoaiDichVu } from '../../models/loaidichvu.model';
import { DonViTinh } from '../../models/donvitinh.model';
import { LoaiTien } from '../../models/loaitien.model';
import { KhachHangService } from '../../services/khachhang.service';
import { LoaiDichVuService } from '../../services/loaidichvu.service';
import { DonViTinhService } from '../../services/donvitinh.service';
import { LoaiTienService } from '../../services/loaitien.service';

@Component({
    selector: 'dichvucoban-import',
    templateUrl: './dichvucoban-import.component.html',
    styleUrls: ['./dichvucoban-import.component.css']
})
export class DichVuCoBanImportComponent implements OnInit, AfterViewInit {
    public changesSavedCallback: () => void;
    isUploadClick: boolean = false;
    isDisplayUploadButton: boolean = false;
    valueProgress: number = 0;
    arrayBuffer: any;
    isSelectedKhachHang: boolean = false;
    isSelectedMatBang: boolean = false;
    isSelectedLoaiDichVu: boolean = false;
    isSelectedDonViTinh: boolean = false;
    isSelectedLoaiTien: boolean = false;

    dichvucoban: DichVuCoBan;
    matBangs: MatBang[] = [];
    khachHangs: KhachHang[] = [];
    loaiDichVus: LoaiDichVu[] = [];
    donViTinhs: DonViTinh[] = [];
    loaiTiens: LoaiTien[] = [];

    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    ArrLog: string[] = [];
    file: File;

    @ViewChild('f')
    private form;

    @ViewChild('dvcbModal')
    dvcbModal: ModalDirective;

    @ViewChild('logImport')
    logImport: ElementRef;

    @ViewChild('myFileUpload')
    myFileUpload: any;

    constructor(private alertService: AlertService, private translationService: AppTranslationService,
        private dichvucobanService: DichVuCoBanService,
        private khachHangService: KhachHangService,
        private matbangService: MatBangService,
        private loaidichvuService: LoaiDichVuService,
        private donvitinhService: DonViTinhService,
        private loaitienService: LoaiTienService) {
    }

    onEditorModalHidden() { }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    loadAllKhachHang() {
        this.khachHangService.getAllKhachHang().subscribe(results => this.onDataLoadKhachHangSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadKhachHangSuccessful(obj: KhachHang[]) {
        this.khachHangs = obj;
    }

    loadAllMatBang() {
        this.matbangService.getAllMatBang().subscribe(results => this.onDataLoadMatBangSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadMatBangSuccessful(obj: MatBang[]) {
        this.matBangs = obj;
    }

    loadAllLoaiDichVu() {
        this.loaidichvuService.getAllLoaiDichVu().subscribe(results => this.onDataLoadLoaiDichVuSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadLoaiDichVuSuccessful(obj: LoaiDichVu[]) {
        this.loaiDichVus = obj;
    }

    loadAllDonViTinh() {
        this.donvitinhService.getAllDonViTinh().subscribe(results => this.onDataLoadDonViTinhSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadDonViTinhSuccessful(obj: DonViTinh[]) {
        this.donViTinhs = obj;
    }

    loadAllLoaiTien() {
        this.loaitienService.getAllLoaiTien().subscribe(results => this.onDataLoadLoaiTienSuccessful(results), error => this.onDataLoadFailed(error))
    }
    onDataLoadLoaiTienSuccessful(obj: LoaiTien[]) {
        this.loaiTiens = obj;
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    SelectedKhachHangValue(khachhangId: number) {
        if (khachhangId > 0) {
            this.isSelectedKhachHang = true;
        }
        else {
            this.isSelectedKhachHang = false;
        }
    }

    SelectedMatBangValue(matbangId: number) {
        if (matbangId > 0) {
            this.isSelectedMatBang = true;
        }
        else {
            this.isSelectedMatBang = false;
        }
    }

    SelectedLoaiDichVuValue(loaidichvuId: number) {
        if (loaidichvuId > 0) {
            this.isSelectedLoaiDichVu = true;
        }
        else {
            this.isSelectedLoaiDichVu = false;
        }
    }

    SelectedDonViTinhValue(donvitinhId: number) {
        if (donvitinhId > 0) {
            this.isSelectedDonViTinh = true;
        }
        else {
            this.isSelectedDonViTinh = false;
        }
    }

    SelectedLoaiTienValue(loaitienId: number) {
        if (loaitienId > 0) {
            this.isSelectedLoaiTien = true;
        }
        else {
            this.isSelectedLoaiTien = false;
        }
    }

    incomingfile(event) {
        this.file = event.target.files[0];
        if (this.file.size > 0) {
            this.isDisplayUploadButton = true;
        }
    }
    Upload(khachhang: number, matbang: number, loaidichvu: number, donvitinh: number, loaitien: number) {
        console.log(khachhang, matbang, loaidichvu, donvitinh, loaitien);
        this.isUploadClick = true;
        this.ArrLog.push("Bắt đầu");
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) {
                arr[i] = String.fromCharCode(data[i]);
            }
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary" });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            var arr1 = XLSX.utils.sheet_to_json(worksheet, { raw: true });
            this.SetData(arr1, khachhang, matbang, loaidichvu, donvitinh, loaitien);
        }
        fileReader.readAsArrayBuffer(this.file);
        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    SetData(json: any,khachhang: number, matbang: number, loaidichvu: number, donvitinh: number, loaitien: number) {
        this.ArrLog.push("Đang thực hiện import...");
        this.logImport.nativeElement.insertAdjacentHTML("beforebegin", "<div class='itemLog first' style='font-weight:900;margin-bottom: 5px;'>Đang thực hiện import...</div>");
        this.dichvucobanService.importDVCB(json, khachhang, matbang, loaidichvu, donvitinh, loaitien).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
    }

    private saveSuccessHelper(obj?: DichVuCoBan[]) {
        var count: number = 0;
        if (obj.length) {
            for (var a = 0; a < obj.length; a++) {
                console.log(obj[a].soChungTu);
                //this.ArrLog.push("Thực hiện insert bản ghi thứ " + (a + 1) + ":___" + obj[a].soChungTu);
                this.ArrLog.push("Thành công");
                //this.logImport.nativeElement.insertAdjacentHTML("beforebegin", "<div class='itemLog' style='margin-bottom:3px;padding-bottom:3px'>Thực hiện insert bản ghi thứ " + (a + 1) + ":___<span class='nameItem' style='font-style:italic'>" + obj[a].soChungTu + "</span></div><div class='itemLog status' style='color: #048b8b;margin-bottom:3px;padding-bottom:3px;border-bottom: 1px solid #ccc;'>Thành công  <i class='fa fa-check'></i></div>");
                this.valueProgress = ((a + 1) / (obj.length)) * 100;
            }
            this.logImport.nativeElement.insertAdjacentHTML("afterend", "<div class='itemLog complete' style='color: #048b8b;font-weight:900'>Hoàn thành!</div>");
            this.alertService.showMessage("Thành công", `Thực hiện thêm mới thành công \"${obj.length}\" bản ghi`, MessageSeverity.success);
            this.isDisplayUploadButton = false;
            this.myFileUpload.nativeElement.value = "";
        } else {
            this.alertService.showMessage("Thành công", `Thực hiện thêm mới không thành công`, MessageSeverity.success);
        }
    }

    private saveFailedHelper(error: any) {
        this.valueProgress = 0;
        this.isDisplayUploadButton = false;
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        this.logImport.nativeElement.insertAdjacentHTML("beforebegin", "<div class='itemLog falis' style='margin-bottom:3px;padding-bottom:3px;color:red'>Có lỗi xảy ra với file excel...</div>");
    }

    closeImport() {
        var a: string = '';
        this.dvcbModal.hide();
        this.valueProgress = 0;
        try {
            var logImport: HTMLElement = document.getElementById("logImport") as HTMLElement;
            logImport.innerHTML = "";
        } catch{ }
        this.isUploadClick = false;
        this.isDisplayUploadButton = false;
        this.myFileUpload.nativeElement.value = "";
        this.ArrLog.length = 0;
        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }
}
