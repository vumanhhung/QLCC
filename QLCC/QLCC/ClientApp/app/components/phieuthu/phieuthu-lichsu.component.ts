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
    selector: "phieuthu-lichsu",
    templateUrl: "./phieuthu-lichsu.component.html",
    styleUrls: ["./phieuthu-lichsu.component.css"]
})

export class PhieuThuLichSuComponent implements OnInit {
    columns: any[] = [];
    columnsPT: any[] = [];
    matbangObj: MatBang = new MatBang();
    thexes: TheXe[] = [];
    thexesCache: TheXe[] = [];
    thexesSelected: TheXe = new TheXe();
    snam: number = 0;
    sthang: number = 0;
    matBangId: number;
    nams = [];
    phieuthuchitiets: PhieuThuChiTiet[] = [];

    //@ViewChild('indexTemplate')
    //indexTemplate: TemplateRef<any>;

    @ViewChild('trangthaiTemplate')
    trangthaiTemplate: TemplateRef<any>;

    @ViewChild('phieuthuTemplate')
    phieuthuTemplate: TemplateRef<any>;

    @ViewChild('namthangTemplate')
    namthangTemplate: TemplateRef<any>;

    @ViewChild('sotienTemplate')
    sotienTemplate: TemplateRef<any>;

    @ViewChild('ngaynopTemplate')
    ngaynopTemplate: TemplateRef<any>;

    constructor(private alertService: AlertService, private phieuthuchitietService: PhieuThuChiTietService, private route: ActivatedRoute, private router: Router, private matbangService: MatBangService, private thexeService: TheXeService) {
    }

    ngOnInit(): void {

        this.columns = [
            { prop: "index", name: '#', width: 40, canAutoResize: false },
            { prop: 'maTheXe', name: 'Mã thẻ', width: 100 },
            { prop: 'bienSoXe', name: 'Biển số', width: 100 },
            { prop: 'kyThanhToan', name: 'Kỳ TT', width: 80 },
            { name: 'Trạng thái', cellTemplate: this.trangthaiTemplate, width: 110 }
        ];

        this.columnsPT = [
            { prop: "index", name: '#', width: 40, canAutoResize: false },
            { name: 'Phiếu thu', cellTemplate: this.phieuthuTemplate, width: 100 },
            { name: 'Tháng', cellTemplate: this.namthangTemplate, width: 100 },
            { name: 'Số tiền', cellTemplate: this.sotienTemplate, width: 100 },
            { name: 'Ngày nộp', cellTemplate: this.ngaynopTemplate, width: 100 },
        ];

        this.matBangId = Number(this.route.snapshot.paramMap.get('matbangid'));
        if (this.matBangId > 0) {
            this.matbangService.getMatBangByID(this.matBangId).subscribe(result => {
                this.matbangObj = result;
                var where = "MatBangId = " + this.matbangObj.matBangId;
                this.thexeService.getItems(0, 0, where, "x").subscribe(results => {
                    results.forEach((item, index, results) => {
                        (<any>item).index = index + 1;
                    });
                    this.thexesCache = [...results];
                    this.thexes = results;
                }, error => this.onDataLoadFailed(error));
            }, errors => this.onDataLoadFailed(errors));
            this.sthang = new Date().getMonth() + 1;
            this.snam = new Date().getFullYear();
            for (var i = this.snam + 1; i >= this.snam - 5; i--) {
                this.nams.push(i);
            }
        }
    }

    getFormatPrice(price: number): string {
        return Utilities.formatNumber(price);
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    sthangChange(thang: number) {
        if (this.thexesSelected.theXeId != null) this.LoadPhieuThu();
        else this.alertService.showMessage("Chưa chọn xe", "Vui lòng chọn xe để xem lịch sử thu phí!", MessageSeverity.error);
    }

    snamChange(nam: number) {
        if (this.thexesSelected.theXeId != null) this.LoadPhieuThu();
        else this.alertService.showMessage("Chưa chọn xe", "Vui lòng chọn xe để xem lịch sử thu phí!", MessageSeverity.error);
    }

    onSearchChanged(value: string) {
        this.thexes = this.thexesCache.filter(r => Utilities.searchArray(value, false, r.maTheXe, r.bienSoXe));
    }

    onSelect({ selected }) {
        var row: TheXe = selected[0];
        this.thexesSelected = this.thexesCache.find(o => o.theXeId == row.theXeId);
        this.LoadPhieuThu();
    }

    LoadPhieuThu() {
        var where = "TheXeID = " + this.thexesSelected.theXeId + " AND Nam = " + this.snam;
        if (this.sthang > 0) where += " AND Thang = " + this.sthang;
        this.phieuthuchitietService.getItems(0, 0, where, "Nam DESC,Thang DESC").subscribe(results => {
            results.forEach((item, index, results) => {
                (<any>item).index = index + 1;
            });
            this.phieuthuchitiets = [...results];
        }, error => this.onDataLoadFailed(error));
    }
}