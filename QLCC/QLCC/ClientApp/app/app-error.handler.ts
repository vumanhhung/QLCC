﻿// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Injectable, ErrorHandler } from "@angular/core";
import { AlertService, MessageSeverity } from './services/alert.service';


@Injectable()
export class AppErrorHandler extends ErrorHandler {

    //private alertService: AlertService;

    constructor() {
        super();
    }


    handleError(error: any) {
        //if (this.alertService == null) {
        //    this.alertService = this.injector.get(AlertService);
        //}

        //this.alertService.showStickyMessage("Fatal Error!", "An unresolved error has occured. Please reload the page to correct this error", MessageSeverity.warn);
        //this.alertService.showStickyMessage("Unhandled Error", error.message || error, MessageSeverity.error, error);

        if (confirm("Lỗi nghiêm trọng!\nĐã xảy ra lỗi chưa được giải quyết. Bạn có muốn tải lại trang để sửa lỗi này không?\n\nError: " + error.message))
            window.location.reload(true);

        super.handleError(error);
    }
}