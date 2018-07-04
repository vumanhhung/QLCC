import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import * as XLSX from 'ts-xlsx';
import { MatBang } from '../../models/matbang.model';
import { MatBangService } from '../../services/matbang.service';
import { Observable } from 'rxjs/Observable';
import { CumToaNha } from '../../models/cumtoanha.model';
import { ToaNha } from '../../models/toanha.model';
import { TangLau } from '../../models/tanglau.model';
import { ToaNhaService } from '../../services/toanha.service';
import { CumToaNhaService } from '../../services/cumtoanha.service';
import { TangLauService } from '../../services/tanglau.service';



@Component({
    selector: 'import-excel',
    templateUrl: './import-excel.component.html',
    styleUrls: ['./import-excel.component.css']
})
export class ImportExcelComponent implements OnInit, AfterViewInit {
    isUploadClick: boolean = false;
    isDisplayUploadButton: boolean = false;
    valueProgress: number = 0;
    arrayBuffer: any;
    isSelectedTangLau: boolean = false;


    cumtoanha: CumToaNha;
    toanha: ToaNha;
    tanglau: TangLau;


    cumtoanhas: CumToaNha[] = [];
    toanhas: ToaNha[] = [];
    tanglaus: TangLau[] = [];

    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    ArrLog: string[] = [];
    file: File;
    @ViewChild('editorModal')
    editorModal: ModalDirective;
    @ViewChild('logImport')
    logImport: ElementRef;
    @ViewChild('myFileUpload')
    myFileUpload: any;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private matbangService: MatBangService, private toanhaService: ToaNhaService, private cumtoanhaService: CumToaNhaService, private tanglauService: TangLauService) {
    }

    incomingfile(event) {
        this.file = event.target.files[0];
        if (this.file.size > 0) {
            this.isDisplayUploadButton = true;
        }
    }

    Upload(cumtoanha: number, toanha: number, tanglau: number) {
        if (this.isSelectedTangLau == true) {
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
                this.SetData(arr1, cumtoanha, toanha, tanglau);
            }
            fileReader.readAsArrayBuffer(this.file);
        }
        else {
            alert("Vui lòng chọn tầng để import mặt bằng");
            return false;
        }

    }


    onDataLoadTangLauItemSuccessful(obj: TangLau) {
        this.tanglau = obj;
    }


    SetData(json: any, cumtoanha: number, toanha: number, tanglau: number) {

        this.ArrLog.push("Đang thực hiện import...");
        this.logImport.nativeElement.insertAdjacentHTML("beforebegin", "<div class='itemLog first' style='font-weight:900;margin-bottom: 5px;'>Đang thực hiện import...</div>");
        this.matbangService.importMatBang(json, cumtoanha, toanha, tanglau).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
    }


    private saveSuccessHelper(obj?: MatBang[]) {
        var count: number = 0;
        if (obj.length) {
            for (var a = 0; a < obj.length; a++) {
                this.ArrLog.push("Thực hiện insert bản ghi thứ " + (a + 1) + ":___" + obj[a].tenMatBang);
                this.ArrLog.push("Thành công");
                this.logImport.nativeElement.insertAdjacentHTML("beforebegin", "<div class='itemLog' style='margin-bottom:3px;padding-bottom:3px'>Thực hiện insert bản ghi thứ " + (a + 1) + ":___<span class='nameItem' style='font-style:italic'>" + obj[a].tenMatBang + "</span></div><div class='itemLog status' style='color: #048b8b;margin-bottom:3px;padding-bottom:3px;border-bottom: 1px solid #ccc;'>Thành công  <i class='fa fa-check'></i></div>");
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


    SelectedGroupValue(tanglau: number, toanha: number, cumtoanha: number) {
        this.loadToaNha(cumtoanha);
        this.loadTangLau(toanha, cumtoanha);
    }
    SelectedItemValue(tanglau: number, value: number, cumvalue: number) {
        this.loadTangLau(value, cumvalue);
    }

    loadToaNha(cumtoanha: number) {
        this.toanhaService.getToaNhaByCum(cumtoanha).subscribe(results => this.onDataLoadItemSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadItemSuccessful(obj: ToaNha[]) {
        this.toanhas = obj;
    }
    loadTangLau(toanha: number, cumtoanha: number) {
        this.tanglauService.getTangLauByToaNha(toanha, cumtoanha).subscribe(results => this.onDataLoadTangLauSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadTangLauSuccessful(obj: TangLau[]) {
        this.tanglaus = obj;
    }
    SelectedTangLauValue(tanglau: number, toanha: number, cumtoanha: number) {
        if (tanglau > 0) {
            this.isSelectedTangLau = true;
        }
        else {
            this.isSelectedTangLau = false;
        }
    }
    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }
    onEditorModalHidden() { }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    closeImport() {
        var a: string = '';
        this.editorModal.hide();
        this.valueProgress = 0;
        try {
            var logImport: HTMLElement = document.getElementById("logImport") as HTMLElement;
            logImport.innerHTML = "";
        } catch{ }
        this.isUploadClick = false;
        this.isDisplayUploadButton = false;
        this.myFileUpload.nativeElement.value = "";
        this.ArrLog.length = 0;
    }
}
