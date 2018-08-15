import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { NguonTiepNhanEndpoint } from "./nguontiepnhan-endpoint.service";
import { NguonTiepNhan } from "../models/nguontiepnhan.model";
import { AuthService } from './auth.service';



@Injectable()
export class NguonTiepNhanService {
    constructor(private router: Router, private http: HttpClient, private nguontiepnhanEndpoint: NguonTiepNhanEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.nguontiepnhanEndpoint.getItems<NguonTiepNhan[]>(start, count, whereClause, orderBy);
    }
    
    getAllNguonTiepNhan() {
        return this.nguontiepnhanEndpoint.getAllNguonTiepNhan<NguonTiepNhan[]>();
    }

    getNguonTiepNhanByID(id?: number) {
        return this.nguontiepnhanEndpoint.getNguonTiepNhanByID<NguonTiepNhan>(id);
    }

    updateNguonTiepNhan(id?: number, nguontiepnhan?: NguonTiepNhan) {
        if (nguontiepnhan.nguonTiepNhanId) {
            return this.nguontiepnhanEndpoint.updateNguonTiepNhan(nguontiepnhan.nguonTiepNhanId, nguontiepnhan);
        }
    }

    addnewNguonTiepNhan(nguontiepnhan?: NguonTiepNhan) {
        return this.nguontiepnhanEndpoint.addnewNguonTiepNhan<NguonTiepNhan>(nguontiepnhan);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteNguonTiepNhan(id: number) {
        return this.nguontiepnhanEndpoint.deleteNguonTiepNhan(id);
    }
    
}