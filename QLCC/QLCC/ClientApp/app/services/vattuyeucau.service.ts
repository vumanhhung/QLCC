import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { VatTuYeuCauEndpoint } from "./vattuyeucau-endpoint.service";
import { VatTuYeuCau } from "../models/vattuyeucau.model";
import { AuthService } from './auth.service';



@Injectable()
export class VatTuYeuCauService {
    constructor(private router: Router, private http: HttpClient, private vattuyeucauEndpoint: VatTuYeuCauEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.vattuyeucauEndpoint.getItems<VatTuYeuCau[]>(start, count, whereClause, orderBy);
    }
    
    getAllVatTuYeuCau() {
        return this.vattuyeucauEndpoint.getAllVatTuYeuCau<VatTuYeuCau[]>();
    }

    getVatTuYeuCauByID(id?: number) {
        return this.vattuyeucauEndpoint.getVatTuYeuCauByID<VatTuYeuCau>(id);
    }

    updateVatTuYeuCau(id?: number, vattuyeucau?: VatTuYeuCau) {
        if (vattuyeucau.yeuCauvatTuId) {
            return this.vattuyeucauEndpoint.updateVatTuYeuCau(vattuyeucau.yeuCauvatTuId, vattuyeucau);
        }
    }

    addnewVatTuYeuCau(vattuyeucau?: VatTuYeuCau) {
        return this.vattuyeucauEndpoint.addnewVatTuYeuCau<VatTuYeuCau>(vattuyeucau);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteVatTuYeuCau(id: number) {
        return this.vattuyeucauEndpoint.deleteVatTuYeuCau(id);
    }

    getByPhieuYeuCau(id: number) {
        return this.vattuyeucauEndpoint.getByPhieuYeuCau<VatTuYeuCau[]>(id);
    }
}