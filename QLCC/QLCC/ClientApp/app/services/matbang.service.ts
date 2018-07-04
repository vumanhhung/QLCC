import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { MatBangEndpoint } from "./matbang-endpoint.service";
import { MatBang } from "../models/matbang.model";
import { AuthService } from './auth.service';



@Injectable()
export class MatBangService {
    constructor(private router: Router, private http: HttpClient, private matbangEndpoint: MatBangEndpoint, private authService: AuthService) {

    }
    
    getAllMatBang() {
        return this.matbangEndpoint.getAllMatBang<MatBang[]>();
    }
    getMatBangByToaNha(TangLauId:number,ToaNhaId: number, cumToaNhaId: number) {
        return this.matbangEndpoint.getMatBangByToaNha<MatBang[]>(TangLauId,ToaNhaId, cumToaNhaId);
    }
    getMatBangByID(id?: number) {
        return this.matbangEndpoint.getMatBangByID<MatBang>(id);
    }

    updateMatBang(id?: number, matbang?: MatBang) {
        if (matbang.matBangId) {
            return this.matbangEndpoint.updateMatBang(matbang.matBangId, matbang);
        }
    }

    addnewMatBang(matbang?: MatBang) {
        return this.matbangEndpoint.addnewMatBang<MatBang>(matbang);
    }    

    importMatBang(matbang?: any, cumtoanha?: number, toanha?: number, tanglau?: number) {
        return this.matbangEndpoint.importMatBang<any>(matbang, cumtoanha, toanha, tanglau);
    } 

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteMatBang(id: number) {
        return this.matbangEndpoint.deleteMatBang(id);
    }
    
}