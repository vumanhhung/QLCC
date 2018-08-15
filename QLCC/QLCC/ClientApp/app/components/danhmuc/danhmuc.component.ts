// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';


@Component({
    selector: 'danhmuc',
    templateUrl: './danhmuc.component.html',
    styleUrls: ['./danhmuc.component.css'],
    animations: [fadeInOut]
})
export class DanhMucComponent implements OnInit {
    //loadingIndicator: boolean;
    //public tongToaNha: number = 0;
    //public tongMatBang: number = 0;
    //constructor(private alertService: AlertService, public configurations: ConfigurationService, private toanhaService: ToaNhaService, private matbangService: MatBangService) {
    //}
    //loadData() {
    //    this.alertService.startLoadingMessage();
    //    this.loadingIndicator = true;
    //    this.toanhaService.getAllToaNha().subscribe(results => this.onDataLoadToaNhaSuccessful(results), error => this.onDataLoadFailed(error));
    //    this.matbangService.getAllMatBang().subscribe(results => this.onDataLoadMatBangSuccessful(results), error => this.onDataLoadFailed(error));
    //}
    //onDataLoadToaNhaSuccessful(obj: ToaNha[]) {
    //    this.alertService.startLoadingMessage();
    //    this.loadingIndicator = true;
    //    this.tongToaNha = obj.length;
    //}
    //onDataLoadMatBangSuccessful(obj: MatBang[]) {
    //    this.alertService.startLoadingMessage();
    //    this.loadingIndicator = true;
    //    this.tongMatBang = obj.length;
    //}






    //onDataLoadFailed(error: any) {
    //    this.alertService.stopLoadingMessage();
    //    this.loadingIndicator = false;
    //    this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
    //        MessageSeverity.error, error);
    //}

    ngOnInit() {
       // this.loadData();
    }
}
