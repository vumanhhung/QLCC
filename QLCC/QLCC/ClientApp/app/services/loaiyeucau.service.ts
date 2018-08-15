import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { LoaiYeuCauEndpoint } from "./loaiyeucau-endpoint.service";
import { LoaiYeuCau } from "../models/loaiyeucau.model";
import { AuthService } from './auth.service';



@Injectable()
export class LoaiYeuCauService {
    constructor(private router: Router, private http: HttpClient, private loaiyeucauEndpoint: LoaiYeuCauEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.loaiyeucauEndpoint.getItems<LoaiYeuCau[]>(start, count, whereClause, orderBy);
    }
    
    getAllLoaiYeuCau() {
        return this.loaiyeucauEndpoint.getAllLoaiYeuCau<LoaiYeuCau[]>();
    }

    getLoaiYeuCauByID(id?: number) {
        return this.loaiyeucauEndpoint.getLoaiYeuCauByID<LoaiYeuCau>(id);
    }

    updateLoaiYeuCau(id?: number, loaiyeucau?: LoaiYeuCau) {
        if (loaiyeucau.loaiYeuCauId) {
            return this.loaiyeucauEndpoint.updateLoaiYeuCau(loaiyeucau.loaiYeuCauId, loaiyeucau);
        }
    }

    addnewLoaiYeuCau(loaiyeucau?: LoaiYeuCau) {
        return this.loaiyeucauEndpoint.addnewLoaiYeuCau<LoaiYeuCau>(loaiyeucau);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteLoaiYeuCau(id: number) {
        return this.loaiyeucauEndpoint.deleteLoaiYeuCau(id);
    }
    
}