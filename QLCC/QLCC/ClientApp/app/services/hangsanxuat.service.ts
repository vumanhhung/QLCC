import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { HangSanXuatEndpoint } from "./hangsanxuat-endpoint.service";
import { HangSanXuat } from "../models/hangsanxuat.model";
import { AuthService } from './auth.service';



@Injectable()
export class HangSanXuatService {
    constructor(private router: Router, private http: HttpClient, private hangsanxuatEndpoint: HangSanXuatEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.hangsanxuatEndpoint.getItems<HangSanXuat[]>(start, count, whereClause, orderBy);
    }
    
    getAllHangSanXuat() {
        return this.hangsanxuatEndpoint.getAllHangSanXuat<HangSanXuat[]>();
    }

    getHangSanXuatByID(id?: number) {
        return this.hangsanxuatEndpoint.getHangSanXuatByID<HangSanXuat>(id);
    }

    updateHangSanXuat(id?: number, hangsanxuat?: HangSanXuat) {
        if (hangsanxuat.hangSanXuatId) {
            return this.hangsanxuatEndpoint.updateHangSanXuat(hangsanxuat.hangSanXuatId, hangsanxuat);
        }
    }

    addnewHangSanXuat(hangsanxuat?: HangSanXuat) {
        return this.hangsanxuatEndpoint.addnewHangSanXuat<HangSanXuat>(hangsanxuat);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteHangSanXuat(id: number) {
        return this.hangsanxuatEndpoint.deleteHangSanXuat(id);
    }

    getFilterStatus(status?: boolean) {
        return this.hangsanxuatEndpoint.getFilterStatus<HangSanXuat[]>(status);
    }
}