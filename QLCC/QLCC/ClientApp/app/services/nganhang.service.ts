import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { NganHangEndpoint } from "./nganhang-endpoint.service";
import { NganHang } from "../models/nganhang.model";
import { AuthService } from './auth.service';



@Injectable()
export class NganHangService {
    constructor(private router: Router, private http: HttpClient, private nganhangEndpoint: NganHangEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.nganhangEndpoint.getItems<NganHang[]>(start, count, whereClause, orderBy);
    }
    
    getAllNganHang() {
        return this.nganhangEndpoint.getAllNganHang<NganHang[]>();
    }

    getNganHangByID(id?: number) {
        return this.nganhangEndpoint.getNganHangByID<NganHang>(id);
    }

    updateNganHang(id?: number, nganhang?: NganHang) {
        if (nganhang.nganHangId) {
            return this.nganhangEndpoint.updateNganHang(nganhang.nganHangId, nganhang);
        }
    }

    addnewNganHang(nganhang?: NganHang) {
        return this.nganhangEndpoint.addnewNganHang<NganHang>(nganhang);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteNganHang(id: number) {
        return this.nganhangEndpoint.deleteNganHang(id);
    }
    
}