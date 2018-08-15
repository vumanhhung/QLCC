import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { TangLauEndpoint } from "./tanglau-endpoint.service";
import { TangLau } from "../models/tanglau.model";
import { AuthService } from './auth.service';



@Injectable()
export class TangLauService {
    constructor(private router: Router, private http: HttpClient, private tanglauEndpoint: TangLauEndpoint, private authService: AuthService) {

    }
    
    getAllTangLau() {
        return this.tanglauEndpoint.getAllTangLau<TangLau[]>();
    }

    getTangLauByToaNha(toaNhaId: number, cumToaNha: number) {
        return this.tanglauEndpoint.getTangLauByToaNha<TangLau[]>(toaNhaId, cumToaNha);
    }

    getTangLauByID(id?: number) {
        return this.tanglauEndpoint.getTangLauByID<TangLau>(id);
    }

    updateTangLau(id?: number, tanglau?: TangLau) {
        if (tanglau.tangLauId) {
            return this.tanglauEndpoint.updateTangLau(tanglau.tangLauId, tanglau);
        }
    }

    addnewTangLau(tanglau?: TangLau) {
        return this.tanglauEndpoint.addnewTangLau<TangLau>(tanglau);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteTangLau(id: number) {
        return this.tanglauEndpoint.deleteTangLau(id);
    }
    
}