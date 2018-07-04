import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { TrangThaiYeuCauEndpoint } from "./trangthaiyeucau-endpoint.service";
import { TrangThaiYeuCau } from "../models/trangthaiyeucau.model";
import { AuthService } from './auth.service';



@Injectable()
export class TrangThaiYeuCauService {
    constructor(private router: Router, private http: HttpClient, private trangthaiyeucauEndpoint: TrangThaiYeuCauEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.trangthaiyeucauEndpoint.getItems<TrangThaiYeuCau[]>(start, count, whereClause, orderBy);
    }
    
    getAllTrangThaiYeuCau() {
        return this.trangthaiyeucauEndpoint.getAllTrangThaiYeuCau<TrangThaiYeuCau[]>();
    }

    getTrangThaiYeuCauByID(id?: number) {
        return this.trangthaiyeucauEndpoint.getTrangThaiYeuCauByID<TrangThaiYeuCau>(id);
    }

    updateTrangThaiYeuCau(id?: number, trangthaiyeucau?: TrangThaiYeuCau) {
        if (trangthaiyeucau.trangThaiYeuCauId) {
            return this.trangthaiyeucauEndpoint.updateTrangThaiYeuCau(trangthaiyeucau.trangThaiYeuCauId, trangthaiyeucau);
        }
    }

    addnewTrangThaiYeuCau(trangthaiyeucau?: TrangThaiYeuCau) {
        return this.trangthaiyeucauEndpoint.addnewTrangThaiYeuCau<TrangThaiYeuCau>(trangthaiyeucau);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteTrangThaiYeuCau(id: number) {
        return this.trangthaiyeucauEndpoint.deleteTrangThaiYeuCau(id);
    }
    
}