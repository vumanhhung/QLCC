import { Component, OnInit, ViewChild, Input, TemplateRef } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { MatBang } from '../../models/matbang.model';
import { TheXe } from '../../models/thexe.model';
import { PhieuThuChiTietService } from '../../services/phieuthuchitiet.service';
import { PhieuThuChiTiet } from '../../models/phieuthuchitiet.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { MatBangService } from '../../services/matbang.service';
import { TheXeService } from '../../services/thexe.service';

@Component({
    selector: "phieuthu-print",
    templateUrl: "./phieuthu-print.component.html",
    styleUrls: ["./phieuthu-print.component.css"]
})

export class PhieuThuPrintComponent implements OnInit {  

    constructor(private alertService: AlertService, private phieuthuchitietService: PhieuThuChiTietService, private route: ActivatedRoute, private router: Router, private matbangService: MatBangService, private thexeService: TheXeService) {
    }

    ngOnInit(): void {      
    }    
}