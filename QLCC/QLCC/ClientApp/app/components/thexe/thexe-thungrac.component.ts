import { Component, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TheXe } from '../../models/thexe.model';
import { MatBang } from '../../models/matbang.model';
import { Utilities } from '../../services/utilities';
import { TheXeService } from '../../services/thexe.service';

@Component({
    selector: "thexe-thungrac",
    templateUrl: "./thexe-thungrac.component.html",
    styleUrls: ["./thexe-thungrac.component.css"]
})

export class TheXeThungRacComponent {
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };

    matbangObj: MatBang = new MatBang();
    thexes: TheXe[] = [];
    thexesCache: TheXe[] = [];

    @ViewChild('thungracModal')
    thungracModal: ModalDirective;

    constructor(private alertService: AlertService, private thexeService: TheXeService) {
    }

    private SavedCallback() {
        if (this.changesSavedCallback)
            this.changesSavedCallback();        
    }    

    editStatus(row: TheXe) {
        row.trangThai = 0;
        this.thexeService.updateTheXe(row.theXeId, row).subscribe(results => {
            this.alertService.showMessage("Thành công", `Thực hiện khôi phục thẻ xe: ${row.maTheXe} thành công`, MessageSeverity.success);
            var index = this.thexes.indexOf(row);
            if (index != -1) this.thexes.splice(index, 1);
        }, error => { });
    }

    editStatusAll() {
        for (var i = 0; i < this.thexes.length; i++) {
            this.thexes[i].trangThai = 0;
        }
        this.thexeService.updateTheXes(this.thexes).subscribe(results => {
            this.thexes = [];
            this.alertService.showMessage("Thành công", `Thực hiện khôi phục toàn bộ thẻ xe thành công`, MessageSeverity.success);
            this.SavedCallback();
        }, error => { });
    }

    delete(row: TheXe) {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa bản ghi này?', DialogType.confirm, () => this.deleteHelper(row));
    }

    deleteAll() {
        this.alertService.showDialog('Bạn có chắc chắn muốn xóa toàn bộ các bản ghi này?', DialogType.confirm, () => {
            this.thexeService.deleteTheXes(this.thexes).subscribe(results => {
                this.thexes = [];
                this.alertService.showMessage("Thành công", `Thực hiện xóa toàn bộ các thẻ xe trong thùng rác thành công`, MessageSeverity.success);
                this.SavedCallback();
            }, error => { });
        });
    }

    deleteHelper(row: TheXe) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");

        this.thexeService.deleteTheXe(row.theXeId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
                var index = this.thexes.indexOf(row);
                if (index != -1) this.thexes.splice(index, 1);
            },
                error => {
                    this.alertService.stopLoadingMessage();
                    this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                });
    }

    getFormatPrice(price: number): string {
        return Utilities.formatNumber(price);
    }
}