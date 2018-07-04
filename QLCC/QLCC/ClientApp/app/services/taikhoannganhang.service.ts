import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { TaiKhoanNganHangEndpoint } from "./taikhoannganhang-endpoint.service";
import { TaiKhoanNganHang } from "../models/taikhoannganhang.model";
import { AuthService } from './auth.service';



@Injectable()
export class TaiKhoanNganHangService {
    constructor(private router: Router, private http: HttpClient, private taikhoannganhangEndpoint: TaiKhoanNganHangEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.taikhoannganhangEndpoint.getItems<TaiKhoanNganHang[]>(start, count, whereClause, orderBy);
    }
    
    getAllTaiKhoanNganHang() {
        return this.taikhoannganhangEndpoint.getAllTaiKhoanNganHang<TaiKhoanNganHang[]>();
    }
    getTaiKhoanNganHangByNganHang(nganhang: number) {
        return this.taikhoannganhangEndpoint.getTaiKhoanNganHangByNganHang<TaiKhoanNganHang[]>(nganhang);
    }
    getTaiKhoanNganHangByID(id?: number) {
        return this.taikhoannganhangEndpoint.getTaiKhoanNganHangByID<TaiKhoanNganHang>(id);
    }

    updateTaiKhoanNganHang(id?: number, taikhoannganhang?: TaiKhoanNganHang) {
        if (taikhoannganhang.taiKhoanNganHangId) {
            return this.taikhoannganhangEndpoint.updateTaiKhoanNganHang(taikhoannganhang.taiKhoanNganHangId, taikhoannganhang);
        }
    }

    addnewTaiKhoanNganHang(taikhoannganhang?: TaiKhoanNganHang) {
        return this.taikhoannganhangEndpoint.addnewTaiKhoanNganHang<TaiKhoanNganHang>(taikhoannganhang);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteTaiKhoanNganHang(id: number) {
        return this.taikhoannganhangEndpoint.deleteTaiKhoanNganHang(id);
    }
    
}