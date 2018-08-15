// ======================================
// Author: NamTran
// Email:  namthaoth@gmail.com  
// Copyright (c) 2018 www.mitec.com.vn
// ==> Gun4Hire: namthaoth@gmail.com
// ======================================

import { Component } from '@angular/core';



@Component({
    selector: 'footerControl',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent {
    getYear() {
        return new Date().getUTCFullYear();
    }
}

