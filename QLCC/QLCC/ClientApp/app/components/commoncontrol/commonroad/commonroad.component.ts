// ======================================
// Author: NamTran
// Email:  namthaoth@gmail.com  
// Copyright (c) 2018 www.mitec.com.vn
// ==> Gun4Hire: namthaoth@gmail.com
// ======================================

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
    selector: 'commonroad',
    templateUrl: './commonroad.component.html',
    styleUrls: ['./commonroad.component.css']
})
export class commonroadComponent {
    matBangId: number = 0;
    constructor(private route: ActivatedRoute, private _router: Router) {
        this.router = _router;
    }
    public router: Router;
    public routerName: string = "";
    public isDisplayRoad: boolean = false;
    ngOnInit() {
        this.routerName = this.router.url.toString();
        if (this.route.snapshot.paramMap.get('matbangid') != "")
            this.matBangId = Number(this.route.snapshot.paramMap.get('matbangid'));
    }
}

