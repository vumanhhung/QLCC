// ======================================
// Author: NamTran
// Email:  namthaoth@gmail.com  
// Copyright (c) 2018 www.mitec.com.vn
// ==> Gun4Hire: namthaoth@gmail.com
// ======================================

import { Component } from '@angular/core';
import { Location } from '@angular/common';


@Component({
    selector: 'goback',
    templateUrl: './goback.component.html',
    styleUrls: ['./goback.component.css']
})
export class gobackComponent {
    constructor(private _location: Location) {
       
    }  

    goBack() {
        this._location.back();
    }
}

