import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { PhongBanEndpoint } from "./phongban-endpoint.service";
import { PhongBan } from "../models/phongban.model";
import { AuthService } from './auth.service';



@Injectable()
export class PhongBanService {
    constructor(private router: Router, private http: HttpClient, private phongbanEndpoint: PhongBanEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.phongbanEndpoint.getItems<PhongBan[]>(start, count, whereClause, orderBy);
    }
    
    getAllPhongBan() {
        return this.phongbanEndpoint.getAllPhongBan<PhongBan[]>();
    }

    getPhongBanByToaNha(toanha: number, cumtoanha: number) {
        return this.phongbanEndpoint.getPhongBanByToaNha<PhongBan[]>(toanha,cumtoanha);
    }

    getPhongBanByID(id?: number) {
        return this.phongbanEndpoint.getPhongBanByID<PhongBan>(id);
    }

    updatePhongBan(id?: number, phongban?: PhongBan) {
        if (phongban.phongBanId) {
            return this.phongbanEndpoint.updatePhongBan(phongban.phongBanId, phongban);
        }
    }

    addnewPhongBan(phongban?: PhongBan) {
        return this.phongbanEndpoint.addnewPhongBan<PhongBan>(phongban);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deletePhongBan(id: number) {
        return this.phongbanEndpoint.deletePhongBan(id);
    }
    
}