import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { TrangThaiCuDanEndpoint } from "./trangthaicudan-endpoint.service";
import { TrangThaiCuDan } from "../models/trangthaicudan.model";
import { AuthService } from './auth.service';



@Injectable()
export class TrangThaiCuDanService {
    constructor(private router: Router, private http: HttpClient, private trangthaicudanEndpoint: TrangThaiCuDanEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.trangthaicudanEndpoint.getItems<TrangThaiCuDan[]>(start, count, whereClause, orderBy);
    }
    
    getAllTrangThaiCuDan() {
        return this.trangthaicudanEndpoint.getAllTrangThaiCuDan<TrangThaiCuDan[]>();
    }

    getTrangThaiCuDanByID(id?: number) {
        return this.trangthaicudanEndpoint.getTrangThaiCuDanByID<TrangThaiCuDan>(id);
    }

    updateTrangThaiCuDan(id?: number, trangthaicudan?: TrangThaiCuDan) {
        if (trangthaicudan.trangThaiCuDanId) {
            return this.trangthaicudanEndpoint.updateTrangThaiCuDan(trangthaicudan.trangThaiCuDanId, trangthaicudan);
        }
    }

    addnewTrangThaiCuDan(trangthaicudan?: TrangThaiCuDan) {
        return this.trangthaicudanEndpoint.addnewTrangThaiCuDan<TrangThaiCuDan>(trangthaicudan);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteTrangThaiCuDan(id: number) {
        return this.trangthaicudanEndpoint.deleteTrangThaiCuDan(id);
    }
    
}