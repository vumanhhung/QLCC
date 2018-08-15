// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, OnInit, OnDestroy, Input } from "@angular/core";

import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AuthService } from "../../services/auth.service";
import { ConfigurationService } from '../../services/configuration.service';
import { Utilities } from '../../services/utilities';
import { UserLogin } from '../../models/user-login.model';

@Component({
    selector: "app-login",
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

    userLogin = new UserLogin();
    isLoading = false;
    formResetToggle = true;
    modalClosedCallback: () => void;
    loginStatusSubscription: any;

    @Input()
    isModal = false;


    constructor(private alertService: AlertService, private authService: AuthService, private configurations: ConfigurationService) {

    }


    ngOnInit() {

        this.userLogin.rememberMe = this.authService.rememberMe;

        if (this.getShouldRedirect()) {
            this.authService.redirectLoginUser();
        }
        else {
            this.loginStatusSubscription = this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
                if (this.getShouldRedirect()) {
                    this.authService.redirectLoginUser();
                }
            });
        }
    }


    ngOnDestroy() {
        if (this.loginStatusSubscription)
            this.loginStatusSubscription.unsubscribe();
    }


    getShouldRedirect() {
        return !this.isModal && this.authService.isLoggedIn && !this.authService.isSessionExpired;
    }


    showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    closeModal() {
        if (this.modalClosedCallback) {
            this.modalClosedCallback();
        }
    }


    login() {
        this.isLoading = true;
        this.alertService.startLoadingMessage("", "Đang thực hiện đăng nhập...");

        this.authService.login(this.userLogin.email, this.userLogin.password, this.userLogin.rememberMe)
            .subscribe(
            user => {
                setTimeout(() => {
                    this.alertService.stopLoadingMessage();
                    this.isLoading = false;
                    this.reset();

                    if (!this.isModal) {
                        this.alertService.showMessage("Login", `Chào mừng ${user.userName}!`, MessageSeverity.success);
                    }
                    else {
                        this.alertService.showMessage("Login", `Phiên làm việc của ${user.userName} đã được khôi phục!`, MessageSeverity.success);
                        setTimeout(() => {
                            this.alertService.showStickyMessage("Khôi phục phiên làm việc", "Vui lòng thử lại thao tác cuối cùng của bạn", MessageSeverity.default);
                        }, 500);

                        this.closeModal();
                    }
                }, 500);
            },
            error => {

                this.alertService.stopLoadingMessage();

                if (Utilities.checkNoNetwork(error)) {
                    this.alertService.showStickyMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error, error);
                    this.offerAlternateHost();
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);

                    if (errorMessage)
                        this.alertService.showStickyMessage("Không thể đăng nhập", errorMessage, MessageSeverity.error, error);
                    else
                        this.alertService.showStickyMessage("Không thể đăng nhập", "Đã xảy ra lỗi khi đăng nhập, vui lòng thử lại sau.\nLỗi: " + error.statusText || error.status, MessageSeverity.error, error);
                }

                setTimeout(() => {
                    this.isLoading = false;
                }, 500);
            });
    }


    offerAlternateHost() {

        if (Utilities.checkIsLocalHost(location.origin) && Utilities.checkIsLocalHost(this.configurations.baseUrl)) {
            this.alertService.showDialog("Dear Developer!\nDịch vụ Web API không chạy ..\n" +
                "Bạn có muốn tạm thời chuyển sang API Demo trực tuyến bên dưới? (Hoặc chỉ định một cách khác)",
                DialogType.prompt,
                (value: string) => {
                    this.configurations.baseUrl = value;
                    this.alertService.showStickyMessage("API Changed!", "Web API đã được thay đổi thành: " + value, MessageSeverity.warn);
                },
                null,
                null,
                null,
                this.configurations.fallbackBaseUrl);
        }
    }


    reset() {
        this.formResetToggle = false;

        setTimeout(() => {
            this.formResetToggle = true;
        });
    }
}
