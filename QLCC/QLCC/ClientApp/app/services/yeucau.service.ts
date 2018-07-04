import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { YeuCauEndpoint } from "./yeucau-endpoint.service";
import { YeuCau } from "../models/yeucau.model";
import { AuthService } from './auth.service';



@Injectable()
export class YeuCauService {
    constructor(private router: Router, private http: HttpClient, private yeucauEndpoint: YeuCauEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.yeucauEndpoint.getItems<YeuCau[]>(start, count, whereClause, orderBy);
    }
    
    getAllYeuCau() {
        return this.yeucauEndpoint.getAllYeuCau<YeuCau[]>();
    }

    getYeuCauByID(id?: number) {
        return this.yeucauEndpoint.getYeuCauByID<YeuCau>(id);
    }

    updateYeuCau(id?: number, yeucau?: YeuCau) {
        if (yeucau.yeuCauId) {
            return this.yeucauEndpoint.updateYeuCau(yeucau.yeuCauId, yeucau);
        }
    }

    addnewYeuCau(yeucau?: YeuCau) {
        return this.yeucauEndpoint.addnewYeuCau<YeuCau>(yeucau);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteYeuCau(id: number) {
        return this.yeucauEndpoint.deleteYeuCau(id);
    }
    
}