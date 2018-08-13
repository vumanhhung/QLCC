import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { TheXeEndpoint } from "./thexe-endpoint.service";
import { TheXe } from "../models/thexe.model";
import { AuthService } from './auth.service';



@Injectable()
export class TheXeService {
    constructor(private router: Router, private http: HttpClient, private thexeEndpoint: TheXeEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.thexeEndpoint.getItems<TheXe[]>(start, count, whereClause, orderBy);
    }
    
    getAllTheXe() {
        return this.thexeEndpoint.getAllTheXe<TheXe[]>();
    }

    getTheXeByID(id?: number) {
        return this.thexeEndpoint.getTheXeByID<TheXe>(id);
    }

    updateTheXe(id?: number, thexe?: TheXe) {
        if (thexe.theXeId) {
            return this.thexeEndpoint.updateTheXe(thexe.theXeId, thexe);
        }
    }

    updateTheXes(thexe?: TheXe[]) {
        return this.thexeEndpoint.updateTheXes(thexe);
    }

    addnewTheXe(thexe?: TheXe) {
        return this.thexeEndpoint.addnewTheXe<TheXe>(thexe);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteTheXe(id: number) {
        return this.thexeEndpoint.deleteTheXe(id);
    }

    deleteTheXes(thexe?: TheXe[]) {
        return this.thexeEndpoint.deleteTheXes(thexe);
    }
}