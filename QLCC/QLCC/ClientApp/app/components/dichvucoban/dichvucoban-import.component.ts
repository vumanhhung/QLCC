//import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input, ElementRef } from '@angular/core';
//import { ModalDirective } from 'ngx-bootstrap/modal';

//import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
//import { AppTranslationService } from "../../services/app-translation.service";
//import { Utilities } from "../../services/utilities";
//import * as XLSX from 'ts-xlsx';
//import { Observable } from 'rxjs/Observable';
//import { DichVuCoBan } from '../../models/dichvucoban.model';
//import { DichVuCoBanService } from '../../services/dichvucoban.service';
//import { MatBangService } from '../../services/matbang.service';
//import { MatBang } from '../../models/matbang.model';
//import { KhachHang } from '../../models/khachhang.model';
//import { LoaiDichVu } from '../../models/loaidichvu.model';
//import { DonViTinh } from '../../models/donvitinh.model';
//import { LoaiTien } from '../../models/loaitien.model';
//import { KhachHangService } from '../../services/khachhang.service';
//import { LoaiDichVuService } from '../../services/loaidichvu.service';
//import { DonViTinhService } from '../../services/donvitinh.service';
//import { LoaiTienService } from '../../services/loaitien.service';

//@Component({
//    selector: 'dichvucoban-import',
//    templateUrl: './dichvucoban-import.component.html',
//    styleUrls: ['./dichvucoban-import.component.css']
//})
//export class DichVuCoBanImportComponent implements OnInit, AfterViewInit {
//    public changesSavedCallback: () => void;
//    isUploadClick: boolean = false;
//    isDisplayUploadButton: boolean = false;
//    valueProgress: number = 0;
//    arrayBuffer: any;
//    isSelectedTangLau: boolean = false;

//    dichvucoban: DichVuCoBan;
//    matBang: MatBang[] = [];
//    khachHang: KhachHang[] = [];
//    loaiDichVu: LoaiDichVu[] = [];
//    donViTinh: DonViTinh[] = [];
//    loaiTien: LoaiTien[] = [];

//    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
//    ArrLog: string[] = [];
//    file: File;
//    @ViewChild('editorModal')
//    editorModal: ModalDirective;
//    @ViewChild('logImport')
//    logImport: ElementRef;
//    @ViewChild('myFileUpload')
//    myFileUpload: any;

//    constructor(private alertService: AlertService, private translationService: AppTranslationService,
//        private dichvucobanService: DichVuCoBanService,
//        private khachHangService: KhachHangService,
//        private matbangService: MatBangService,
//        private loaidichvuService: LoaiDichVuService,
//        private donvitinhService: DonViTinhService,
//        private loaitienService: LoaiTienService) {
//    }

//    incomingfile(event) {
//        this.file = event.target.files[0];
//        if (this.file.size > 0) {
//            this.isDisplayUploadButton = true;
//        }
//    }
//    Upload() {
//        this.isUploadClick = true;
//        this.ArrLog.push("Bắt đầu");
//        let fileReader = new FileReader();
//        fileReader.onload = (e) => {
//            this.arrayBuffer = fileReader.result;
//            var data = new Uint8Array(this.arrayBuffer);
//            var arr = new Array();
//            for (var i = 0; i != data.length; ++i) {
//                arr[i] = String.fromCharCode(data[i]);
//            }
//            var bstr = arr.join("");
//            var workbook = XLSX.read(bstr, { type: "binary" });
//            var first_sheet_name = workbook.SheetNames[0];
//            var worksheet = workbook.Sheets[first_sheet_name];
//            var arr1 = XLSX.utils.sheet_to_json(worksheet, { raw: true });
//            this.SetData(arr1, this.cumToaNhaId, this.toaNhaId, tanglau);
//        }
//        fileReader.readAsArrayBuffer(this.file);
//        if (this.changesSavedCallback)
//            this.changesSavedCallback();
//    }

//    SetData(json: any, cumtoanha: number, toanha: number, tanglau: number) {

//        this.ArrLog.push("Đang thực hiện import...");
//        this.logImport.nativeElement.insertAdjacentHTML("beforebegin", "<div class='itemLog first' style='font-weight:900;margin-bottom: 5px;'>Đang thực hiện import...</div>");
//        this.matbangService.importMatBang(json, cumtoanha, toanha, tanglau).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
//    }
//}
