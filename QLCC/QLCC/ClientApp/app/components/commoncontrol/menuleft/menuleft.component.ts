// ======================================
// Author: NamTran
// Email:  namthaoth@gmail.com  
// Copyright (c) 2018 www.mitec.com.vn
// ==> Gun4Hire: namthaoth@gmail.com
// ======================================

import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AlertService } from '../../../services/alert.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { AppComponent } from '../../app.component';



@Component({
    selector: 'menuleft',
    templateUrl: './menuleft.component.html',
    styleUrls: ['./menuleft.component.css']
})
export class MenuLeftComponent implements OnInit {
    isActiveMenu: string = "TrangChu";
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    public heightMenu: any;

    constructor(private alertService: AlertService, public configurations: ConfigurationService) {
    }
    ngOnInit() {

    }


    toggleNavigationSub(menuName: string, event: Event) {
        event.preventDefault();
        this.isActiveMenu = menuName;
    };

    building() {
        alert("Module đang được xây dựng");
    }
}
