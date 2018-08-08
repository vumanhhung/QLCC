import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { DichVuCoBanEndpoint } from "./dichvucoban-endpoint.service";
import { DichVuCoBan } from "../models/dichvucoban.model";
import { AuthService } from './auth.service';



@Injectable()
export class DichVuCoBanService {
    constructor(private router: Router, private http: HttpClient, private dichvucobanEndpoint: DichVuCoBanEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.dichvucobanEndpoint.getItems<DichVuCoBan[]>(start, count, whereClause, orderBy);
    }
    
    getAllDichVuCoBan() {
        return this.dichvucobanEndpoint.getAllDichVuCoBan<DichVuCoBan[]>();
    }

    getDichVuCoBanByID(id?: number) {
        return this.dichvucobanEndpoint.getDichVuCoBanByID<DichVuCoBan>(id);
    }

    updateDichVuCoBan(id?: number, dichvucoban?: DichVuCoBan) {
        if (dichvucoban.dichVuCoBanId) {
            return this.dichvucobanEndpoint.updateDichVuCoBan(dichvucoban.dichVuCoBanId, dichvucoban);
        }
    }

    addnewDichVuCoBan(dichvucoban?: DichVuCoBan) {
        return this.dichvucobanEndpoint.addnewDichVuCoBan<DichVuCoBan>(dichvucoban);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteDichVuCoBan(id: number) {
        return this.dichvucobanEndpoint.deleteDichVuCoBan(id);
    }

    checkExpire() {
        return this.dichvucobanEndpoint.checkExpire<DichVuCoBan>();
    }

    importDVCB(dichvucoban?: any, khachHangId?: number, matBangId?: number, loaiDichVuId?: number, donViTinhId?: number, loaiTienId?: number) {
        return this.dichvucobanEndpoint.importDVCB<any>(dichvucoban, khachHangId, matBangId, loaiDichVuId, donViTinhId, loaiTienId);
    }

    getItemByFilter(tanglauId?: number, loaidichvuId?: number, status?: number) {
        return this.dichvucobanEndpoint.getItembyFilter<DichVuCoBan[]>(tanglauId, loaidichvuId, status);
    }

    filterByDate(month?: number, year?: number) {
        return this.dichvucobanEndpoint.filterByDate<DichVuCoBan[]>(month, year);
    }
}