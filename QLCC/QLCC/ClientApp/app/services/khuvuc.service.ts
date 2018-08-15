import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { KhuVucEndpoint } from "./khuvuc-endpoint.service";
import { KhuVuc } from "../models/khuvuc.model";
import { AuthService } from './auth.service';



@Injectable()
export class KhuVucService {
    constructor(private router: Router, private http: HttpClient, private khuvucEndpoint: KhuVucEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.khuvucEndpoint.getItems<KhuVuc[]>(start, count, whereClause, orderBy);
    }
    
    getAllKhuVuc() {
        return this.khuvucEndpoint.getAllKhuVuc<KhuVuc[]>();
    }

    getKhuVucByID(id?: number) {
        return this.khuvucEndpoint.getKhuVucByID<KhuVuc>(id);
    }

    updateKhuVuc(id?: number, khuvuc?: KhuVuc) {
        if (khuvuc.khuVucId) {
            return this.khuvucEndpoint.updateKhuVuc(khuvuc.khuVucId, khuvuc);
        }
    }

    addnewKhuVuc(khuvuc?: KhuVuc) {
        return this.khuvucEndpoint.addnewKhuVuc<KhuVuc>(khuvuc);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteKhuVuc(id: number) {
        return this.khuvucEndpoint.deleteKhuVuc(id);
    }
    
}