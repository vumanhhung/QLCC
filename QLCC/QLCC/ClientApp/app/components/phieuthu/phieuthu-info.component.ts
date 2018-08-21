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
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    public formResetToggle = true;
    matbangObj: MatBang = new MatBang();
    thexes: TheXe[] = [];    
    tongTien: string = "0";    
    ghiChu: string = "";
    isNew: boolean = false;
    maPhieuThu: string = "";
    ngayLapPhieuThu: Date = new Date();

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
        if (this.changesSavedCallback)
            this.changesSavedCallback();
        this.phieuthuModal.hide();
    }

    newPhieuThu(thexes: TheXe[]) {
        if (thexes.length > 0) {
            this.isNew = true;
            this.thexes = thexes;
            let cDate = new Date();
            let cMonth = new Date().getMonth();
            var thanhtien = 0;
            var tongtienthanhtoan = 0;
            for (var i = 0; i < this.thexes.length; i++) {
                if (this.thexes[i].phieuThuChiTiets == null || (this.thexes[i].phieuThuChiTiets != null && this.thexes[i].phieuThuChiTiets.nam < cDate.getFullYear())
                    || (this.thexes[i].phieuThuChiTiets.nam == cDate.getFullYear() && this.thexes[i].phieuThuChiTiets.thang < (cMonth + 1))) {
                    if (this.thexes[i].ngayThanhToan < cDate.getDate()) {
                        var fm = new Date();
                        fm.setMonth(cMonth + 1);
                        fm.setDate(1);
                        this.thexes[i].hanTuNgay = fm;

                        var tm = new Date();
                        tm.setMonth(cMonth + this.thexes[i].kyThanhToan + 1);
                        tm.setDate(0);
                        this.thexes[i].hanDenNgay = tm;
                    } else {
                        var fm = new Date();
                        fm.setDate(1);
                        this.thexes[i].hanTuNgay = fm;

                        var tm = new Date();                        
                        tm.setMonth(cMonth + this.thexes[i].kyThanhToan);
                        tm.setDate(0);
                        this.thexes[i].hanDenNgay = tm;
                    }
                } else if (this.thexes[i].phieuThuChiTiets.nam == cDate.getFullYear() && this.thexes[i].phieuThuChiTiets.thang == (cMonth + 1)) {
                    // nộp đúng hạn
                    var fm = new Date();
                    fm.setMonth(cMonth + 1);
                    fm.setDate(1);
                    this.thexes[i].hanTuNgay = fm;

                    var tm = new Date();
                    tm.setMonth(cMonth + this.thexes[i].kyThanhToan + 1);
                    tm.setDate(0);
                    this.thexes[i].hanDenNgay = tm;
                } else if (this.thexes[i].phieuThuChiTiets.nam == cDate.getFullYear() && this.thexes[i].phieuThuChiTiets.thang > (cMonth + 1) || this.thexes[i].phieuThuChiTiets.nam > cDate.getFullYear()) {
                    // nộp trước
                    var fm = new Date();
                    fm.setFullYear(this.thexes[i].phieuThuChiTiets.nam);
                    fm.setMonth(this.thexes[i].phieuThuChiTiets.thang);
                    fm.setDate(1);
                    this.thexes[i].hanTuNgay = fm;

                    var tm = new Date();
                    tm.setFullYear(this.thexes[i].phieuThuChiTiets.nam);
                    tm.setMonth(this.thexes[i].phieuThuChiTiets.thang + this.thexes[i].kyThanhToan);
                    tm.setDate(0);
                    this.thexes[i].hanDenNgay = tm;
                }

                thanhtien = this.thexes[i].kyThanhToan * this.thexes[i].phiGuiXe;
                tongtienthanhtoan += thanhtien;
            }
            this.tongTien = Utilities.formatNumber(tongtienthanhtoan);
        }
    }

    getFormatPrice(price: number): string {
        return Utilities.formatNumber(price);
    }

    private save() {        
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
            this.isNew = false;
            this.maPhieuThu = results.maPhieuThu;
            this.ngayLapPhieuThu = results.ngayLap;

            var phieuthuId = results.phieuThuId;
            var phieuthuChiTiets: PhieuThuChiTiet[] = [];

            for (var i = 0; i < this.thexes.length; i++) {
                if (this.thexes[i].kyThanhToan > 1) {
                    for (var j = 1; j <= this.thexes[i].kyThanhToan; j++) {
                        let chitiet = new PhieuThuChiTiet();
                        chitiet.ngayNop = new Date();
                        chitiet.phieuThuId = phieuthuId;
                        chitiet.matBangId = this.matbangObj.matBangId;
                        chitiet.loaiDichVu = 1;
                        chitiet.theXeId = this.thexes[i].theXeId;
                        chitiet.tongSoTien = this.thexes[i].phiGuiXe;
                        if (this.thexes[i].hanTuNgay.getMonth() + j > 12) {
                            chitiet.thang = this.thexes[i].hanTuNgay.getMonth() + j - 12;
                            chitiet.nam = this.thexes[i].hanTuNgay.getFullYear() + 1;
                        }
                        else {
                            chitiet.thang = this.thexes[i].hanTuNgay.getMonth() + j;
                            chitiet.nam = this.thexes[i].hanTuNgay.getFullYear();
                        }

                        phieuthuChiTiets.push(chitiet);

                    }
                } else {
                    var chitiet = new PhieuThuChiTiet();
                    chitiet.ngayNop = new Date();
                    chitiet.phieuThuId = phieuthuId;
                    chitiet.matBangId = this.matbangObj.matBangId;
                    chitiet.loaiDichVu = 1;
                    chitiet.theXeId = this.thexes[i].theXeId;
                    chitiet.tongSoTien = this.thexes[i].phiGuiXe;
                    chitiet.hanTuNgay = this.thexes[i].hanTuNgay;
                    chitiet.hanDenNgay = this.thexes[i].hanDenNgay;
                    chitiet.thang = this.thexes[i].hanTuNgay.getMonth() + 1;
                    chitiet.nam = this.thexes[i].hanTuNgay.getFullYear();
                    phieuthuChiTiets.push(chitiet);
                }
            }

            this.phieuthuchitietService.addnewPhieuThuChiTiets(phieuthuChiTiets).subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.alertService.showMessage("Thành công", `Thực hiện xuất phiếu thu thành công`, MessageSeverity.success);
                this.resetForm();
                
                //this.phieuthuModal.hide();
                //if (this.changesSavedCallback)
                //    this.changesSavedCallback();
               
            }, error => this.onDataLoadFailed(error));
        }, error => { this.onDataLoadFailed(error) });
    }

    //getFromDateInput(num: number): Date {
    //    var date = this.fromMonth;
    //    var cMonth = this.fromMonth.getMonth();
    //    var m = cMonth + num - 1;
    //    date.setMonth(m, 1);
    //    return date;
    //}

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Xuất phiếu thu lỗi", `Không thể dữ liệu ghi dữ liệu vào máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    kyThanhToanChange(thexe: TheXe, num: string) {
        let cDate = new Date();
        let cMonth = new Date().getMonth();
        thexe.hanTuNgay = new Date();
        thexe.hanDenNgay = new Date();

        if (thexe.phieuThuChiTiets == null || (thexe.phieuThuChiTiets != null && thexe.phieuThuChiTiets.nam < cDate.getFullYear())
            || (thexe.phieuThuChiTiets.nam == cDate.getFullYear() && thexe.phieuThuChiTiets.thang < (cMonth + 1))) {
            if (thexe.ngayThanhToan < cDate.getDate()) {
                var fm = new Date();
                fm.setMonth(cMonth + 1);
                fm.setDate(1);
                thexe.hanTuNgay = fm;

                var tm = new Date();
                tm.setMonth(cMonth + Number(num) + 1);
                tm.setDate(0);
                thexe.hanDenNgay = tm;
            } else {
                var fm = new Date();
                fm.setDate(1);
                thexe.hanTuNgay = fm;

                var tm = new Date();                
                tm.setMonth(cMonth + Number(num));
                tm.setDate(0);
                thexe.hanDenNgay = tm;                
            }
        } else if (thexe.phieuThuChiTiets.nam == cDate.getFullYear() && thexe.phieuThuChiTiets.thang == (cMonth + 1)) {
            // nộp đúng hạn
            var fm = new Date();
            fm.setMonth(cMonth + 1);
            fm.setDate(1);
            thexe.hanTuNgay = fm;

            var tm = new Date();
            tm.setMonth(cMonth + Number(num) + 1);
            tm.setDate(0);
            thexe.hanDenNgay = tm;
        } else if (thexe.phieuThuChiTiets.nam == cDate.getFullYear() && thexe.phieuThuChiTiets.thang > (cMonth + 1) || thexe.phieuThuChiTiets.nam > cDate.getFullYear()) {
            // nộp trước
            var fm = new Date();
            fm.setFullYear(thexe.phieuThuChiTiets.nam);
            fm.setMonth(thexe.phieuThuChiTiets.thang);
            fm.setDate(1);
            thexe.hanTuNgay = fm;

            var tm = new Date();
            tm.setFullYear(thexe.phieuThuChiTiets.nam);
            tm.setMonth(thexe.phieuThuChiTiets.thang + Number(num));
            tm.setDate(0);
            thexe.hanDenNgay = tm;
        }

        //thexe.hanDenNgay = new Date();

        var thanhtien = 0;
        var tongtienthanhtoan = 0;
        for (var i = 0; i < this.thexes.length; i++) {
            thanhtien = this.thexes[i].kyThanhToan * this.thexes[i].phiGuiXe;
            tongtienthanhtoan += thanhtien;
        }
        this.tongTien = Utilities.formatNumber(tongtienthanhtoan);
    }
}