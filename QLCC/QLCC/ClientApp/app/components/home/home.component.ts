// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, OnInit, Host, Inject } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { TangLauService } from '../../services/tanglau.service';
import { Utilities } from '../../services/utilities';
import { ToaNha } from '../../models/toanha.model';
import { ToaNhaService } from '../../services/toanha.service';
import { MatBangService } from '../../services/matbang.service';
import { MatBang } from '../../models/matbang.model';
import { AppComponent } from '../app.component';



@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [fadeInOut]
})
export class HomeComponent implements OnInit {
    loadingIndicator: boolean;
    ishiddenBox: string = '';
    isFullScreen: string = '';
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    public tongToaNha: number = 0;
    public tongMatBang: number = 0;
    isActivetodo: number = 0;
    public ArrayTodo: any[] =[];

    constructor(private alertService: AlertService, public configurations: ConfigurationService, private toanhaService: ToaNhaService, private matbangService: MatBangService, @Inject(AppComponent) private parentApp: AppComponent) {
    }
    loadData() {
        this.toanhaService.getAllToaNha().subscribe(results => this.onDataLoadToaNhaSuccessful(results), error => this.onDataLoadFailed(error));
        this.matbangService.getAllMatBang().subscribe(results => this.onDataLoadMatBangSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadToaNhaSuccessful(obj: ToaNha[]) {
        this.tongToaNha = obj.length;
    }
    onDataLoadMatBangSuccessful(obj: MatBang[]) {
        this.tongMatBang = obj.length;
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    ngOnInit() {
        this.loadData();
    }

    toggleFullScreen(menuName: string, event: Event) {
        event.preventDefault();
        if (this.isFullScreen.length == 0) {
            this.isFullScreen = menuName;
            this.parentApp.isFullScreen = true;
        }
        else {
            this.isFullScreen = '';
            this.parentApp.isFullScreen = false;
        }
    }
    Togglechild(menuName: string, event: Event) {
        event.preventDefault();
        if (this.ishiddenBox.length == 0) {
            this.ishiddenBox = menuName;
        }
        else {
            this.ishiddenBox = '';
        }
    }
    reloadData() {
        alert("Đang chờ dữ liệu");
    }

    todolist(id: number, event) {
        event.preventDefault();
        //Cách làm
        //Cập nhật trạng thái đã làm trong db, load lại dữ liệu từ db để đổ lại trạng thái
        if (this.isActivetodo == 0) {
            this.isActivetodo = id;
        }
        this.alertService.showStickyMessage("Thông báo", `Bạn đã thay đổi trạng thái của yêu cầu này`,
            MessageSeverity.info);
    }
}
