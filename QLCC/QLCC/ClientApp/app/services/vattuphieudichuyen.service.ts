import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { VatTuPhieuDiChuyenEndpoint } from "./vattuphieudichuyen-endpoint.service";
import { VatTuPhieuDiChuyen } from "../models/vattuphieudichuyen.model";
import { AuthService } from './auth.service';



@Injectable()
export class VatTuPhieuDiChuyenService {
    constructor(private router: Router, private http: HttpClient, private vattuphieudichuyenEndpoint: VatTuPhieuDiChuyenEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.vattuphieudichuyenEndpoint.getItems<VatTuPhieuDiChuyen[]>(start, count, whereClause, orderBy);
    }
    
    getAllVatTuPhieuDiChuyen() {
        return this.vattuphieudichuyenEndpoint.getAllVatTuPhieuDiChuyen<VatTuPhieuDiChuyen[]>();
    }

    getVatTuPhieuDiChuyenByID(id?: number) {
        return this.vattuphieudichuyenEndpoint.getVatTuPhieuDiChuyenByID<VatTuPhieuDiChuyen>(id);
    }

    updateVatTuPhieuDiChuyen(id?: number, vattuphieudichuyen?: VatTuPhieuDiChuyen) {
        if (vattuphieudichuyen.phieuDiChuyenId) {
            return this.vattuphieudichuyenEndpoint.updateVatTuPhieuDiChuyen(vattuphieudichuyen.phieuDiChuyenId, vattuphieudichuyen);
        }
    }

    addnewVatTuPhieuDiChuyen(vattuphieudichuyen?: VatTuPhieuDiChuyen) {
        return this.vattuphieudichuyenEndpoint.addnewVatTuPhieuDiChuyen<VatTuPhieuDiChuyen>(vattuphieudichuyen);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteVatTuPhieuDiChuyen(id: number) {
        return this.vattuphieudichuyenEndpoint.deleteVatTuPhieuDiChuyen(id);
    }
    
}