import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { NhomKhachHangEndpoint } from "./nhomkhachhang-endpoint.service";
import { NhomKhachHang } from "../models/nhomkhachhang.model";
import { AuthService } from './auth.service';



@Injectable()
export class NhomKhachHangService {
    constructor(private router: Router, private http: HttpClient, private nhomkhachhangEndpoint: NhomKhachHangEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.nhomkhachhangEndpoint.getItems<NhomKhachHang[]>(start, count, whereClause, orderBy);
    }
    
    getAllNhomKhachHang() {
        return this.nhomkhachhangEndpoint.getAllNhomKhachHang<NhomKhachHang[]>();
    }

    getNhomKhachHangByID(id?: number) {
        return this.nhomkhachhangEndpoint.getNhomKhachHangByID<NhomKhachHang>(id);
    }

    updateNhomKhachHang(id?: number, nhomkhachhang?: NhomKhachHang) {
        if (nhomkhachhang.nhomKhachHangId) {
            return this.nhomkhachhangEndpoint.updateNhomKhachHang(nhomkhachhang.nhomKhachHangId, nhomkhachhang);
        }
    }

    addnewNhomKhachHang(nhomkhachhang?: NhomKhachHang) {
        return this.nhomkhachhangEndpoint.addnewNhomKhachHang<NhomKhachHang>(nhomkhachhang);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteNhomKhachHang(id: number) {
        return this.nhomkhachhangEndpoint.deleteNhomKhachHang(id);
    }
    
}