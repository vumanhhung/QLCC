// ======================================
// Author: NamTran
// Email:  namthaoth@gmail.com  
// Copyright (c) 2018 www.mitec.com.vn
// ==> Gun4Hire: namthaoth@gmail.com
// ======================================

import { Component } from '@angular/core';
import { Router } from '@angular/router';



@Component({
    selector: 'commonroad',
    templateUrl: './commonroad.component.html',
    styleUrls: ['./commonroad.component.css']
})
export class commonroadComponent {
    constructor(private _router: Router) {
        this.router = _router;
    }
    public router: Router;
    public routerName: string = "";
    public isDisplayRoad: boolean = false;
    ngOnInit() {
        this.routerName = this.router.url.toString();
    }
}

