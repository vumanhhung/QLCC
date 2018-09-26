import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { VatTuPhieuYeuCauEndpoint } from "./vattuphieuyeucau-endpoint.service";
import { VatTuPhieuYeuCau } from "../models/vattuphieuyeucau.model";
import { AuthService } from './auth.service';



@Injectable()
export class VatTuPhieuYeuCauService {
    constructor(private router: Router, private http: HttpClient, private vattuphieuyeucauEndpoint: VatTuPhieuYeuCauEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.vattuphieuyeucauEndpoint.getItems<VatTuPhieuYeuCau[]>(start, count, whereClause, orderBy);
    }
    
    getAllVatTuPhieuYeuCau() {
        return this.vattuphieuyeucauEndpoint.getAllVatTuPhieuYeuCau<VatTuPhieuYeuCau[]>();
    }

    getVatTuPhieuYeuCauByID(id?: number) {
        return this.vattuphieuyeucauEndpoint.getVatTuPhieuYeuCauByID<VatTuPhieuYeuCau>(id);
    }

    updateVatTuPhieuYeuCau(id?: number, vattuphieuyeucau?: VatTuPhieuYeuCau) {
        if (vattuphieuyeucau.phieuYeuCauVTId) {
            return this.vattuphieuyeucauEndpoint.updateVatTuPhieuYeuCau(vattuphieuyeucau.phieuYeuCauVTId, vattuphieuyeucau);
        }
    }

    addnewVatTuPhieuYeuCau(vattuphieuyeucau?: VatTuPhieuYeuCau) {
        return this.vattuphieuyeucauEndpoint.addnewVatTuPhieuYeuCau<VatTuPhieuYeuCau>(vattuphieuyeucau);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteVatTuPhieuYeuCau(id: number) {
        return this.vattuphieuyeucauEndpoint.deleteVatTuPhieuYeuCau(id);
    }
    
}