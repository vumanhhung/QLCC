// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, ViewChild, TemplateRef } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { AccountService } from '../../services/account.service';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { Utilities } from '../../services/utilities';

@Component({
    selector: 'flour',
    templateUrl: './flour.component.html',
    styleUrls: ['./flour.component.css'],
    animations: [fadeInOut]
})
export class FloursComponent {
    public limit: number = 10;
    columns: any[] = [];
    rows: User[] = [];
    rowsCache: User[] = [];
    editingUserName: { name: string };
    loadingIndicator: boolean;
    public anv : User[] = [];

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;
    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private accountService: AccountService) {
    }
    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);
        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'jobTitle', name: gT('users.management.Title'), width: 200 },
            { name: gT('matbang.qlmb_chucnang'), width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false, cellClass: "overflow" }
        ];
        //this.columns.push({ name: 'Chức năng', cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });
        this.loadData();

    }
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.accountService.getUsers().subscribe(
            users => {
                this.onDataLoadSuccessful(users, []);


            },
            error => this.onDataLoadFailed(error));

    }



    onDataLoadSuccessful(users: User[], roles: Role[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        users.forEach((user, index, users) => {
            (<any>user).index = index + 1;
        });

        this.rowsCache = [...users];
        this.rows = users;

    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    SelectedValue(value: number) {
        this.limit = value;
    }
    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.userName, r.fullName, r.email, r.phoneNumber, r.jobTitle, r.roles));
    }
}
