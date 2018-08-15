import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { PhieuThu } from "../../models/phieuthu.model";
import { PhieuThuService } from "./../../services/phieuthu.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MatBang } from '../../models/matbang.model';
import { TheXe } from '../../models/thexe.model';
import { PhieuThuChiTietService } from '../../services/phieuthuchitiet.service';
import { PhieuThuChiTiet } from '../../models/phieuthuchitiet.model';
import { elementAt } from 'rxjs/operator/elementAt';

@Component({
    selector: "phieuthu-info",
    templateUrl: "./phieuthu-info.component.html",
    styleUrls: ["./phieuthu-info.component.css"]
})

export class PhieuThuInfoComponent implements OnInit {
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    public formResetToggle = true;
    matbangObj: MatBang = new MatBang();
    thexes: TheXe[] = [];
    fromMonth: Date;
    toMonth: Date;
    tongTien: string = "0";
    kyHan: number = 1;
    ghiChu: string = "";

    //@ViewChild('f')
    //private form;

    @ViewChild('phieuthuModal')
    phieuthuModal: ModalDirective;


    constructor(private alertService: AlertService, private gvService: PhieuThuService, private phieuthuchitietService: PhieuThuChiTietService) {
    }

    ngOnInit() {
        //this.fromMonth = new Date();
        //this.toMonth = new Date();
    }

    onHidden() {
        this.resetForm(true);
    }

    resetForm(replace = false) {
        this.fromMonth = null;
        this.toMonth = null;

        if (!replace) {
            // cancel button click
            //this.form.reset();            
        }
        else {
            //x button click

            //this.formResetToggle = false;

            //setTimeout(() => {
            //    this.formResetToggle = true;
            //});
        }
    }

    private cancel() {
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        this.resetForm();
        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
        this.phieuthuModal.hide();
    }

    newPhieuThu(thexes: TheXe[]) {
        if (thexes.length > 0) {
            //this.kyHan = thexes[0].kyThanhToan;
            //var hanchot = thexes[0].ngayThanhToan;

            //this.phieuthuchitietService.getItems(0, 1, "TheXeId = " + thexes[0].theXeId, "Nam DESC, Thang DESC").subscribe(results => {
            //    var cMonth = new Date().getMonth();
            //    let cDate = new Date();
            //    if (results.length == 0 || (results.length > 0 && results[0].nam < cDate.getFullYear())) {
            //        if (hanchot < cDate.getDate()) {
            //            var fm = new Date();
            //            fm.setMonth(cMonth + 1);
            //            fm.setDate(1);
            //            this.fromMonth = fm;

            //            var tm = new Date();
            //            tm.setMonth(cMonth + thexes[0].kyThanhToan + 1);
            //            tm.setDate(0);
            //            this.toMonth = tm;
            //        } else {
            //            var fm = new Date();
            //            fm.setDate(1);
            //            this.fromMonth = fm;

            //            var tm = new Date();
            //            tm.setMonth(cMonth + thexes[0].kyThanhToan);
            //            tm.setDate(0);
            //            this.toMonth = tm;
            //        }
            //    } else {

            //    }
            //}, error => {
            //    this.alertService.showStickyMessage("Lỗi truy suất dữ liệu", `Không thể lấy dữ liệu từ vào máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            //        MessageSeverity.error, error);
            //});

            let cDate = new Date();
            for (var i = 0; i < thexes.length; i++) {
                if (thexes[i].phieuThuChiTiets.hanDenNgay != null || (thexes[i].phieuThuChiTiets.hanDenNgay != null && thexes[i].phieuThuChiTiets.nam < cDate.getFullYear())) {
                    if (thexes[i].ngayThanhToan < cDate.getDate()) {
                        //var fm = new Date();
                        //fm.setMonth(cMonth + 1);
                        //fm.setDate(1);
                        //this.fromMonth = fm;

                        //var tm = new Date();
                        //tm.setMonth(cMonth + thexes[0].kyThanhToan + 1);
                        //tm.setDate(0);
                        //this.toMonth = tm;
                    } else {
                        //var fm = new Date();
                        //fm.setDate(1);
                        //this.fromMonth = fm;

                        //var tm = new Date();
                        //tm.setMonth(cMonth + thexes[0].kyThanhToan);
                        //tm.setDate(0);
                        //this.toMonth = tm;
                    }
                } else {

                }
            }


            this.thexes = thexes;
            var thanhtien = 0;
            var tongtienthanhtoan = 0;
            for (var i = 0; i < thexes.length; i++) {
                thanhtien = thexes[i].kyThanhToan * thexes[i].phiGuiXe;
                tongtienthanhtoan += thanhtien;
            }
            this.tongTien = Utilities.formatNumber(tongtienthanhtoan);
        }
    }

    getFormatPrice(price: number): string {
        return Utilities.formatNumber(price);
    }

    private save() {
        console.log(this.thexes);
        this.alertService.startLoadingMessage("Đang thực hiện lưu dữ liệu...");
        var phieuthu = new PhieuThu();
        phieuthu.matBangId = this.matbangObj.matBangId;
        phieuthu.loaiDichVu = 1;
        phieuthu.tongSoTien = Utilities.formatPriceStringToNumber(this.tongTien);
        phieuthu.trangThai = 1;
        phieuthu.ghiChu = this.ghiChu;
        phieuthu.soLanInHoaDon = 0;
        phieuthu.ngayLap = new Date();

        this.gvService.addnewPhieuThu(phieuthu).subscribe(results => {
            var phieuthuId = results.phieuThuId;
            var phieuthuChiTiets: PhieuThuChiTiet[] = [];

            for (var i = 0; i < this.thexes.length; i++) {
                if (this.kyHan > 1) {
                    for (var j = 1; j <= this.kyHan; j++) {
                        let chitiet = new PhieuThuChiTiet();
                        chitiet.phieuThuId = phieuthuId;
                        chitiet.matBangId = this.matbangObj.matBangId;
                        chitiet.loaiDichVu = 1;
                        chitiet.theXeId = this.thexes[i].theXeId;
                        chitiet.tongSoTien = this.thexes[i].phiGuiXe;
                        if (this.fromMonth.getMonth() + j > 12) {
                            chitiet.thang = this.fromMonth.getMonth() + j - 12;
                            chitiet.nam = this.fromMonth.getFullYear() + 1;
                        }
                        else {
                            chitiet.thang = this.fromMonth.getMonth() + j;
                            chitiet.nam = this.fromMonth.getFullYear();
                        }

                        phieuthuChiTiets.push(chitiet);

                    }
                } else {
                    var chitiet = new PhieuThuChiTiet();
                    chitiet.phieuThuId = phieuthuId;
                    chitiet.matBangId = this.matbangObj.matBangId;
                    chitiet.loaiDichVu = 1;
                    chitiet.theXeId = this.thexes[i].theXeId;
                    chitiet.tongSoTien = this.thexes[i].phiGuiXe;
                    chitiet.hanTuNgay = this.fromMonth;
                    chitiet.hanDenNgay = this.toMonth;
                    chitiet.thang = this.fromMonth.getMonth() + 1;
                    chitiet.nam = this.fromMonth.getFullYear();
                    phieuthuChiTiets.push(chitiet);
                }
            }

            this.phieuthuchitietService.addnewPhieuThuChiTiets(phieuthuChiTiets).subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.alertService.showMessage("Thành công", `Thực hiện xuất phiếu thu thành công`, MessageSeverity.success);
                this.resetForm();
                this.phieuthuModal.hide();
                if (this.changesSavedCallback)
                    this.changesSavedCallback();
            }, error => this.onDataLoadFailed(error));
        }, error => { this.onDataLoadFailed(error) });
    }

    getFromDateInput(num: number): Date {
        var date = this.fromMonth;
        var cMonth = this.fromMonth.getMonth();
        var m = cMonth + num - 1;
        date.setMonth(m, 1);
        return date;
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Xuất phiếu thu lỗi", `Không thể dữ liệu ghi dữ liệu vào máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    kyThanhToanChange() {
        var thanhtien = 0;
        var tongtienthanhtoan = 0;
        for (var i = 0; i < this.thexes.length; i++) {
            thanhtien = this.thexes[i].kyThanhToan * this.thexes[i].phiGuiXe;
            tongtienthanhtoan += thanhtien;
        }
        this.tongTien = Utilities.formatNumber(tongtienthanhtoan);
    }
}