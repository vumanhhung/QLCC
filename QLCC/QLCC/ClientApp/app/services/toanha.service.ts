import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { ToaNhaEndpoint } from "./toanha-endpoint.service";
import { ToaNha } from "../models/toanha.model";
import { AuthService } from './auth.service';



@Injectable()
export class ToaNhaService {
    constructor(private router: Router, private http: HttpClient, private toanhaEndpoint: ToaNhaEndpoint, private authService: AuthService) {

    }
    
    getAllToaNha() {
        return this.toanhaEndpoint.getAllToaNha<ToaNha[]>();
    }

    getToaNhaByCum(cumToaNhaId: number) {
        return this.toanhaEndpoint.getToaNhaByCum<ToaNha[]>(cumToaNhaId);
    }

    getToaNhaByID(id?: number) {
        return this.toanhaEndpoint.getToaNhaByID<ToaNha>(id);
    }

    updateToaNha(id?: number, toanha?: ToaNha) {
        if (toanha.toaNhaId) {
            return this.toanhaEndpoint.updateToaNha(toanha.toaNhaId, toanha);
        }
    }

    addnewToaNha(toanha?: ToaNha) {
        return this.toanhaEndpoint.addnewToaNha<ToaNha>(toanha);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteToaNha(id: number) {
        return this.toanhaEndpoint.deleteToaNha(id);
    }
    
}