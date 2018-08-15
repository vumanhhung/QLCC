import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { QuocTichEndpoint } from "./quoctich-endpoint.service";
import { QuocTich } from "../models/quoctich.model";
import { AuthService } from './auth.service';



@Injectable()
export class QuocTichService {
    constructor(private router: Router, private http: HttpClient, private quoctichEndpoint: QuocTichEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.quoctichEndpoint.getItems<QuocTich[]>(start, count, whereClause, orderBy);
    }
    
    getAllQuocTich() {
        return this.quoctichEndpoint.getAllQuocTich<QuocTich[]>();
    }

    getQuocTichByID(id?: number) {
        return this.quoctichEndpoint.getQuocTichByID<QuocTich>(id);
    }

    updateQuocTich(id?: number, quoctich?: QuocTich) {
        if (quoctich.quocTichId) {
            return this.quoctichEndpoint.updateQuocTich(quoctich.quocTichId, quoctich);
        }
    }

    addnewQuocTich(quoctich?: QuocTich) {
        return this.quoctichEndpoint.addnewQuocTich<QuocTich>(quoctich);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteQuocTich(id: number) {
        return this.quoctichEndpoint.deleteQuocTich(id);
    }
    
}