import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { BangGiaDichVuCoBanEndpoint } from "./banggiadichvucoban-endpoint.service";
import { BangGiaDichVuCoBan } from "../models/banggiadichvucoban.model";
import { AuthService } from './auth.service';



@Injectable()
export class BangGiaDichVuCoBanService {
    constructor(private router: Router, private http: HttpClient, private banggiadichvucobanEndpoint: BangGiaDichVuCoBanEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.banggiadichvucobanEndpoint.getItems<BangGiaDichVuCoBan[]>(start, count, whereClause, orderBy);
    }
    
    getAllBangGiaDichVuCoBan() {
        return this.banggiadichvucobanEndpoint.getAllBangGiaDichVuCoBan<BangGiaDichVuCoBan[]>();
    }

    getBangGiaDichVuCoBanByID(id?: number) {
        return this.banggiadichvucobanEndpoint.getBangGiaDichVuCoBanByID<BangGiaDichVuCoBan>(id);
    }

    updateBangGiaDichVuCoBan(id?: number, banggiadichvucoban?: BangGiaDichVuCoBan) {
        if (banggiadichvucoban.bangGiaDichVuCoBanId) {
            return this.banggiadichvucobanEndpoint.updateBangGiaDichVuCoBan(banggiadichvucoban.bangGiaDichVuCoBanId, banggiadichvucoban);
        }
    }

    addnewBangGiaDichVuCoBan(banggiadichvucoban?: BangGiaDichVuCoBan) {
        return this.banggiadichvucobanEndpoint.addnewBangGiaDichVuCoBan<BangGiaDichVuCoBan>(banggiadichvucoban);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteBangGiaDichVuCoBan(id: number) {
        return this.banggiadichvucobanEndpoint.deleteBangGiaDichVuCoBan(id);
    }
    
}