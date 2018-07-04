import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { CuDanEndpoint } from "./cudan-endpoint.service";
import { CuDan } from "../models/cudan.model";
import { AuthService } from './auth.service';



@Injectable()
export class CuDanService {
    constructor(private router: Router, private http: HttpClient, private cudanEndpoint: CuDanEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.cudanEndpoint.getItems<CuDan[]>(start, count, whereClause, orderBy);
    }
    getCuDanByMatBang(matbang:number[]) {
        return this.cudanEndpoint.getCuDanByMatBang<CuDan[]>(matbang);
    }
    
    getAllCuDan() {
        return this.cudanEndpoint.getAllCuDan<CuDan[]>();
    }
    getChuHo() {
        return this.cudanEndpoint.getChuHo<CuDan[]>();
    }
    getCuDanByID(id?: number) {
        return this.cudanEndpoint.getCuDanByID<CuDan>(id);
    }

    updateCuDan(id?: number, cudan?: CuDan) {
        if (cudan.cuDanId) {
            return this.cudanEndpoint.updateCuDan(cudan.cuDanId, cudan);
        }
    }

    addnewCuDan(cudan?: CuDan) {
        return this.cudanEndpoint.addnewCuDan<CuDan>(cudan);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteCuDan(id: number) {
        return this.cudanEndpoint.deleteCuDan(id);
    }
}