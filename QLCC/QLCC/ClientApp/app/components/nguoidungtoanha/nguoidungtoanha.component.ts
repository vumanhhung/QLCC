import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Utilities } from '../../services/utilities';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { NguoiDungToaNhaService } from '../../services/nguoidungtoanha.service';

@Component({
    selector: 'nguoidungtoanha',
    templateUrl: './nguoidungtoanha.component.html',
    styleUrls: ['./nguoidungtoanha.component.css']
})
export class NguoiDungToaNhaComponent implements OnInit, AfterViewInit {
    public userId: string = "";
    public tenToaNha: string = "";;
    public objNDTN: NguoiDungToaNha = new NguoiDungToaNha();

    constructor(private _location: Location, private authService: AuthService, private alertService: AlertService, private nguoidungtoanhaService: NguoiDungToaNhaService) {

    }

    ngAfterViewInit() {
    }

    ngOnInit() {
        if (this.authService.currentUser) {
            this.userId = this.authService.currentUser.id;
            var where = "NguoiDungId = '" + this.userId + "'";
            this.nguoidungtoanhaService.getItems(0, 1, where, "x").subscribe(result => this.getNguoiDungToaNha(result), error => {
                this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng tòa nhà từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
        }
    }

    getNguoiDungToaNha(obj: NguoiDungToaNha[]) {
        if (obj.length > 0) {
            this.objNDTN = obj[0];
            this.tenToaNha = "- " + this.objNDTN.toaNha.tenKhoiNha;
        }
    }
}

