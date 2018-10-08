import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { VatTuDiChuyenEndpoint } from "./vattudichuyen-endpoint.service";
import { VatTuDiChuyen } from "../models/vattudichuyen.model";
import { AuthService } from './auth.service';



@Injectable()
export class VatTuDiChuyenService {
    constructor(private router: Router, private http: HttpClient, private vattudichuyenEndpoint: VatTuDiChuyenEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.vattudichuyenEndpoint.getItems<VatTuDiChuyen[]>(start, count, whereClause, orderBy);
    }
    
    getAllVatTuDiChuyen() {
        return this.vattudichuyenEndpoint.getAllVatTuDiChuyen<VatTuDiChuyen[]>();
    }

    getVatTuDiChuyenByID(id?: number) {
        return this.vattudichuyenEndpoint.getVatTuDiChuyenByID<VatTuDiChuyen>(id);
    }

    updateVatTuDiChuyen(id?: number, vattudichuyen?: VatTuDiChuyen) {
        if (vattudichuyen.vatTuDiChuyenId) {
            return this.vattudichuyenEndpoint.updateVatTuDiChuyen(vattudichuyen.vatTuDiChuyenId, vattudichuyen);
        }
    }

    addnewVatTuDiChuyen(vattudichuyen?: VatTuDiChuyen) {
        return this.vattudichuyenEndpoint.addnewVatTuDiChuyen<VatTuDiChuyen>(vattudichuyen);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteVatTuDiChuyen(id: number) {
        return this.vattudichuyenEndpoint.deleteVatTuDiChuyen(id);
    }
    
}