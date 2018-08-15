// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { ConfigurationService } from '../../services/configuration.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { BootstrapSelectDirective } from "../../directives/bootstrap-select.directive";
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { Permission } from '../../models/permission.model';


@Component({
    selector: 'user-preferences',
    templateUrl: './user-preferences.component.html',
    styleUrls: ['./user-preferences.component.css']
})
export class UserPreferencesComponent implements OnInit, OnDestroy {

    themeSelectorToggle = true;

    languageChangedSubscription: any;

    @ViewChild("languageSelector")
    languageSelector: BootstrapSelectDirective;

    @ViewChild("homePageSelector")
    homePageSelector: BootstrapSelectDirective;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private accountService: AccountService, public configurations: ConfigurationService) {
    }

    ngOnInit() {
        this.languageChangedSubscription = this.translationService.languageChangedEvent().subscribe(data => {
            this.themeSelectorToggle = false;

            setTimeout(() => {
                this.languageSelector.refresh();
                this.homePageSelector.refresh();
                this.themeSelectorToggle = true;
            });
        });
    }

    ngOnDestroy() {
        this.languageChangedSubscription.unsubscribe();
    }



    reloadFromServer() {
        this.alertService.startLoadingMessage();

        this.accountService.getUserPreferences()
            .subscribe(results => {
                this.alertService.stopLoadingMessage();

                this.configurations.import(results);

                this.alertService.showMessage("Nạp mặc định!", "", MessageSeverity.info);

            },
            error => {
                this.alertService.stopLoadingMessage();
                this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất cấu hình người dùng từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }

    setAsDefault() {
        this.alertService.showDialog("Bạn có chắc chắn muốn thiết lập cấu hình hiện tại làm mặc định mới của mình?", DialogType.confirm,
            () => this.setAsDefaultHelper(),
            () => this.alertService.showMessage("Thao tác bị hủy bỏ!", "", MessageSeverity.default));
    }

    setAsDefaultHelper() {
        this.alertService.startLoadingMessage("", "Đang lưu mặc định mới");

        this.accountService.updateUserPreferences(this.configurations.export())
            .subscribe(response => {
                this.alertService.stopLoadingMessage();
                this.alertService.showMessage("Mặc định mới", "Đã cập nhật thành công tài khoản mặc định", MessageSeverity.success)

            },
            error => {
                this.alertService.stopLoadingMessage();
                this.alertService.showStickyMessage("Ghi nhận lỗi", `Đã xảy ra lỗi trong khi lưu các cài đặt mặc định cấu hình.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }



    resetDefault() {
        this.alertService.showDialog("Bạn có chắc chắn muốn đặt lại mặc định của mình?", DialogType.confirm,
            () => this.resetDefaultHelper(),
            () => this.alertService.showMessage("Thao tác bị hủy bỏ!", "", MessageSeverity.default));
    }

    resetDefaultHelper() {
        this.alertService.startLoadingMessage("", "Đặt lại mặc định");

        this.accountService.updateUserPreferences(null)
            .subscribe(response => {
                this.alertService.stopLoadingMessage();
                this.configurations.import(null);
                this.alertService.showMessage("Thiết lập lại mặc định", "Thiết lập mặc định tài khoản đã thành công", MessageSeverity.success)

            },
            error => {
                this.alertService.stopLoadingMessage();
                this.alertService.showStickyMessage("Lưu Lỗi", `Đã xảy ra lỗi trong khi đặt lại mặc định cấu hình.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }




    get canViewCustomers() {
        return this.accountService.userHasPermission(Permission.viewUsersPermission); //eg. viewCustomersPermission
    }

    get canViewProducts() {
        return this.accountService.userHasPermission(Permission.viewUsersPermission); //eg. viewProductsPermission
    }

    get canViewOrders() {
        return true; //eg. viewOrdersPermission
    }
}
