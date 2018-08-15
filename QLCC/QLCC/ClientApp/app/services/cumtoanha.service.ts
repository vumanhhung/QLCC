import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { CumToaNhaEndpoint } from "./cumtoanha-endpoint.service";
import { CumToaNha } from "../models/cumtoanha.model";
import { AuthService } from './auth.service';



@Injectable()
export class CumToaNhaService {
    constructor(private router: Router, private http: HttpClient, private cumtoanhaEndpoint: CumToaNhaEndpoint, private authService: AuthService) {

    }
    
    getAllCumToaNha() {
        return this.cumtoanhaEndpoint.getAllCumToaNha<CumToaNha[]>();
    }

    getCumToaNhaByID(id?: number) {
        return this.cumtoanhaEndpoint.getCumToaNhaByID<CumToaNha>(id);
    }

    updateCumToaNha(id?: number, cumtoanha?: CumToaNha) {
        if (cumtoanha.cumToaNhaId) {
            return this.cumtoanhaEndpoint.updateCumToaNha(cumtoanha.cumToaNhaId, cumtoanha);
        }
    }

    addnewCumToaNha(cumtoanha?: CumToaNha) {
        return this.cumtoanhaEndpoint.addnewCumToaNha<CumToaNha>(cumtoanha);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteCumToaNha(id: number) {
        return this.cumtoanhaEndpoint.deleteCumToaNha(id);
    }
    
}