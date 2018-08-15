import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { KhachHangEndpoint } from "./khachhang-endpoint.service";
import { KhachHang } from "../models/khachhang.model";
import { AuthService } from './auth.service';



@Injectable()
export class KhachHangService {
    constructor(private router: Router, private http: HttpClient, private khachhangEndpoint: KhachHangEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.khachhangEndpoint.getItems<KhachHang[]>(start, count, whereClause, orderBy);
    }
    
    getAllKhachHang() {
        return this.khachhangEndpoint.getAllKhachHang<KhachHang[]>();
    }
    getAllKhachHangDoanhNghiep() {
        return this.khachhangEndpoint.getAllKhachHangDoanhNghiep<KhachHang[]>();
    }
    getKhachHangByID(id?: number) {
        return this.khachhangEndpoint.getKhachHangByID<KhachHang>(id);
    }

    updateKhachHang(id?: number, khachhang?: KhachHang) {
        if (khachhang.khachHangId) {
            return this.khachhangEndpoint.updateKhachHang(khachhang.khachHangId, khachhang);
        }
    }

    addnewKhachHang(khachhang?: KhachHang) {
        return this.khachhangEndpoint.addnewKhachHang<KhachHang>(khachhang);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteKhachHang(id: number) {
        return this.khachhangEndpoint.deleteKhachHang(id);
    }
    
}