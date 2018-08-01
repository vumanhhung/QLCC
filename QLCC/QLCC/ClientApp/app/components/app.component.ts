// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, ViewEncapsulation, OnInit, OnDestroy, ViewChildren, AfterViewInit, QueryList, ElementRef, Injectable, ViewChild, HostListener } from "@angular/core";
import { Router, NavigationStart } from '@angular/router';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, AlertDialog, DialogType, AlertMessage, MessageSeverity } from '../services/alert.service';
import { NotificationService } from "../services/notification.service";
import { AppTranslationService } from "../services/app-translation.service";
import { AccountService } from '../services/account.service';
import { LocalStoreManager } from '../services/local-store-manager.service';
import { AppTitleService } from '../services/app-title.service';
import { AuthService } from '../services/auth.service';
import { ConfigurationService } from '../services/configuration.service';
import { Permission } from '../models/permission.model';
import { LoginComponent } from "../components/login/login.component";
import { CustomersComponent } from "../components/customers/customers.component";
import { MenuLeftComponent } from "../components/commoncontrol/menuleft/menuleft.component";
import { NguoiDungToaNha } from '../models/nguoidungtoanha.model';
import { NguoiDungToaNhaService } from "../services/nguoidungtoanha.service";
import { NguoiDungToaNhaComponent } from "../components/nguoidungtoanha/nguoidungtoanha.component";

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpProgressEvent, HttpEventType, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

var alertify: any = require('../assets/scripts/alertify.js');
//var ckeditor: any = require('../assets/scripts/ckeditor.js');

import { of } from 'rxjs/observable/of';
import { concat } from 'rxjs/observable/concat';
import { delay } from 'rxjs/operators/delay';
import { Utilities } from "../services/utilities";

@Component({
    selector: "quick-app",
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css', '../styles.css', '../themes.css', '../kendo.common.min.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {
    clock = Observable
        .interval(1000)
        .map(() => new Date());

    isDisplayMenuMini: boolean = false;
    mobWidth: any;
    isClickUserConfig: boolean = false;

    public isFullScreen: boolean = false;
    public heightMenu: any;

    isAppLoaded: boolean;
    isUserLoggedIn: boolean;
    shouldShowLoginModal: boolean;
    removePrebootScreen: boolean;
    newNotificationCount = 0;
    appTitle = "QUẢN LÝ CHUNG CƯ";
    appLogo = require("../../../wwwroot/icon/logo.png");
    //userId: string = "";
    //tenToaNha: string = "";;
    //objNDTN: NguoiDungToaNha = new NguoiDungToaNha();
    
    stickyToasties: number[] = [];

    dataLoadingConsecutiveFailurs = 0;
    notificationsLoadingSubscription: any;
    @HostListener('document:click', ['$event']) clickedOutside($event) {
        // here you can hide your menu
        this.isClickUserConfig == false;
    }

    @ViewChild('nguoidungtoanha')
    nguoidungtoanhaView: NguoiDungToaNhaComponent;

    @ViewChild('menuLeft')
    menuLeft: ElementRef;
    @ViewChild('leftMenu')
    menuLeftComponent: MenuLeftComponent;


    @ViewChildren('loginModal,loginControl')
    modalLoginControls: QueryList<any>;

    loginModal: ModalDirective;
    loginControl: LoginComponent;

    get notificationsTitle() {

        let gT = (key: string) => this.translationService.getTranslation(key);

        if (this.newNotificationCount)
            return `${gT("app.Notifications")} (${this.newNotificationCount} ${gT("app.New")})`;
        else
            return gT("app.Notifications");
    }


    constructor(storageManager: LocalStoreManager, private toastyService: ToastyService, private toastyConfig: ToastyConfig,
        private accountService: AccountService, private alertService: AlertService, private notificationService: NotificationService, private appTitleService: AppTitleService,
        private authService: AuthService, private translationService: AppTranslationService, public configurations: ConfigurationService, public router: Router, private el: ElementRef, private nguoidungtoanhaService: NguoiDungToaNhaService) {

        storageManager.initialiseStorageSyncListener();

        translationService.addLanguages(["en", "fr", "de", "pt", "ar", "ko"]);
        translationService.setDefaultLanguage('en');


        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.position = 'top-right';
        this.toastyConfig.limit = 100;
        this.toastyConfig.showClose = true;

        this.appTitleService.appName = this.appTitle;
        this.mobWidth = (window.screen.width);

    }

    clickUser(event) { this.isClickUserConfig == true; }


    ngAfterViewInit() {
        this.modalLoginControls.changes.subscribe((controls: QueryList<any>) => {
            controls.forEach(control => {
                if (control) {
                    if (control instanceof LoginComponent) {
                        this.loginControl = control;
                        this.loginControl.modalClosedCallback = () => this.loginModal.hide();
                    }
                    else {
                        this.loginModal = control;
                        this.loginModal.show();
                    }
                }
            });
        });        
    }



    onResize(event) {
        this.heightMenu = this.menuLeft.nativeElement.offsetHeight;
        this.menuLeftComponent.heightMenu = this.heightMenu - 130;
        this.mobWidth = (event.target.innerWidth);
        if (this.mobWidth < 769) {
            this.isDisplayMenuMini = true;
        }
        else { this.isDisplayMenuMini = false; }
    }

    //onScroll(event) {
    //    this.heightMenu = this.menuLeft.nativeElement.offsetHeight;
    //}



    onLoginModalShown() {
        this.alertService.showStickyMessage("Phiên hết hạn", "Phiên của bạn đã hết hạn. Xin vui lòng đăng nhập lại", MessageSeverity.info);
    }


    onLoginModalHidden() {
        this.alertService.resetStickyMessage();
        this.loginControl.reset();
        this.shouldShowLoginModal = false;

        if (this.authService.isSessionExpired)
            this.alertService.showStickyMessage("Phiên hết hạn", "Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại để gia hạn phiên làm việc của bạn", MessageSeverity.warn);
    }


    onLoginModalHide() {
        this.alertService.resetStickyMessage();
    }

    ToggleClick() {
        if (this.isDisplayMenuMini == false) {
            this.isDisplayMenuMini = true;
        }
        else {
            this.isDisplayMenuMini = false;
        }
    }

    //onResize(event) {
    //    this.heightMain = this.mainContent.nativeElement.offsetHeight + 50;

    //    this.mobWidth = (event.target.innerWidth);
    //    if (this.mobWidth < 769) {
    //        this.isDisplayMenuMini = true;
    //    }
    //    else { this.isDisplayMenuMini = false; }
    //}

    //onScroll(event) {
    //    this.heightMain = this.mainContent.nativeElement.offsetHeight + 50;
    //}   

    ngOnInit() {        
        this.heightMenu = this.menuLeft.nativeElement.offsetHeight;
        this.menuLeftComponent.heightMenu = this.heightMenu - 130;
        this.isUserLoggedIn = this.authService.isLoggedIn;               

        // 1 sec to ensure all the effort to get the css animation working is appreciated :|, Preboot screen is removed .5 sec later
        setTimeout(() => this.isAppLoaded = true, 1000);
        setTimeout(() => this.removePrebootScreen = true, 1500);

        setTimeout(() => {
            if (this.isUserLoggedIn) {                
                this.alertService.resetStickyMessage();

                //if (!this.authService.isSessionExpired)
                this.alertService.showMessage("Login", `Chào mừng ${this.userName} đã trở lại!`, MessageSeverity.default);
                //else
                //    this.alertService.showStickyMessage("Session Expired", "Your Session has expired. Please log in again", MessageSeverity.warn);
            }
        }, 2000);


        this.alertService.getDialogEvent().subscribe(alert => this.showDialog(alert));
        this.alertService.getMessageEvent().subscribe(message => this.showToast(message, false));
        this.alertService.getStickyMessageEvent().subscribe(message => this.showToast(message, true));

        this.authService.reLoginDelegate = () => this.shouldShowLoginModal = true;

        this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
            this.isUserLoggedIn = isLoggedIn;


            if (this.isUserLoggedIn) {
                this.initNotificationsLoading();
            }
            else {
                this.unsubscribeNotifications();
            }

            setTimeout(() => {
                if (!this.isUserLoggedIn) {
                    this.alertService.showMessage("Kết thúc phiên!", "", MessageSeverity.default);
                }
            }, 500);
        });

        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                let url = (<NavigationStart>event).url;

                if (url !== url.toLowerCase()) {
                    this.router.navigateByUrl((<NavigationStart>event).url.toLowerCase());
                }
            }
        });
    }


    ngOnDestroy() {
        this.unsubscribeNotifications();
    }



    private unsubscribeNotifications() {
        if (this.notificationsLoadingSubscription)
            this.notificationsLoadingSubscription.unsubscribe();
    }



    initNotificationsLoading() {

        this.notificationsLoadingSubscription = this.notificationService.getNewNotificationsPeriodically()
            .subscribe(notifications => {
                this.dataLoadingConsecutiveFailurs = 0;
                this.newNotificationCount = notifications.filter(n => !n.isRead).length;
            },
            error => {
                this.alertService.logError(error);

                if (this.dataLoadingConsecutiveFailurs++ < 20)
                    setTimeout(() => this.initNotificationsLoading(), 5000);
                else
                    this.alertService.showStickyMessage("Tải lỗi", "Đang thực hiện tải thông báo mới từ máy chủ không thành công!", MessageSeverity.error);
            });
    }


    markNotificationsAsRead() {

        let recentNotifications = this.notificationService.recentNotifications;

        if (recentNotifications.length) {
            this.notificationService.readUnreadNotification(recentNotifications.map(n => n.id), true)
                .subscribe(response => {
                    for (let n of recentNotifications) {
                        n.isRead = true;
                    }

                    this.newNotificationCount = recentNotifications.filter(n => !n.isRead).length;
                },
                error => {
                    this.alertService.logError(error);
                    this.alertService.showMessage("Thông báo lỗi", "Đánh dấu thông báo đã đọc không thành công", MessageSeverity.error);

                });
        }
    }



    showDialog(dialog: AlertDialog) {

        alertify.set({
            labels: {
                ok: dialog.okLabel || "OK",
                cancel: dialog.cancelLabel || "Cancel"
            }
        });

        switch (dialog.type) {
            case DialogType.alert:
                alertify.alert(dialog.message);

                break
            case DialogType.confirm:
                alertify
                    .confirm(dialog.message, (e) => {
                        if (e) {
                            dialog.okCallback();
                        }
                        else {
                            if (dialog.cancelCallback)
                                dialog.cancelCallback();
                        }
                    });

                break;
            case DialogType.prompt:
                alertify
                    .prompt(dialog.message, (e, val) => {
                        if (e) {
                            dialog.okCallback(val);
                        }
                        else {
                            if (dialog.cancelCallback)
                                dialog.cancelCallback();
                        }
                    }, dialog.defaultValue);

                break;
        }
    }





    showToast(message: AlertMessage, isSticky: boolean) {

        if (message == null) {
            for (let id of this.stickyToasties.slice(0)) {
                this.toastyService.clear(id);
            }

            return;
        }

        let toastOptions: ToastOptions = {
            title: message.summary,
            msg: message.detail,
            timeout: isSticky ? 0 : 4000
        };


        if (isSticky) {
            toastOptions.onAdd = (toast: ToastData) => this.stickyToasties.push(toast.id);

            toastOptions.onRemove = (toast: ToastData) => {
                let index = this.stickyToasties.indexOf(toast.id, 0);

                if (index > -1) {
                    this.stickyToasties.splice(index, 1);
                }

                toast.onAdd = null;
                toast.onRemove = null;
            };
        }


        switch (message.severity) {
            case MessageSeverity.default: this.toastyService.default(toastOptions); break
            case MessageSeverity.info: this.toastyService.info(toastOptions); break;
            case MessageSeverity.success: this.toastyService.success(toastOptions); break;
            case MessageSeverity.error: this.toastyService.error(toastOptions); break
            case MessageSeverity.warn: this.toastyService.warning(toastOptions); break;
            case MessageSeverity.wait: this.toastyService.wait(toastOptions); break;
        }
    }





    logout() {
        this.authService.logout();
        this.authService.redirectLogoutUser();
    }


    getYear() {
        return new Date().getUTCFullYear();
    }


    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }


    get fullName(): string {
        return this.authService.currentUser ? this.authService.currentUser.fullName : "";
    }



    get canViewqldiem() {
        return this.accountService.userHasPermission(Permission.viewUsersPermission); //eg. viewCustomersPermission
    }

    get canViewProducts() {
        return this.accountService.userHasPermission(Permission.viewUsersPermission); //eg. viewProductsPermission
    }

    get canViewOrders() {
        return true; //eg. viewOrdersPermission
    }

    get canViewqldanhmuc() {
        return this.accountService.userHasPermission(Permission.viewUsersPermission); //eg. viewCustomersPermission
    }
}

@Injectable()
export class UploadInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url === 'saveUrl') {
            const events: Observable<HttpEvent<any>>[] = [0, 30, 60, 100].map((x) => of(<HttpProgressEvent>{
                type: HttpEventType.UploadProgress,
                loaded: x,
                total: 100
            }).pipe(delay(1000)));

            const success = of(new HttpResponse({ status: 200 })).pipe(delay(1000));
            events.push(success);

            return concat(...events);
        }

        if (req.url === 'removeUrl') {
            return of(new HttpResponse({ status: 200 }));
        }
        return next.handle(req);
    }
}
