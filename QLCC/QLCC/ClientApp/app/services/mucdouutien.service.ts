import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { MucDoUuTienEndpoint } from "./mucdouutien-endpoint.service";
import { MucDoUuTien } from "../models/mucdouutien.model";
import { AuthService } from './auth.service';



@Injectable()
export class MucDoUuTienService {
    constructor(private router: Router, private http: HttpClient, private mucdouutienEndpoint: MucDoUuTienEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.mucdouutienEndpoint.getItems<MucDoUuTien[]>(start, count, whereClause, orderBy);
    }
    
    getAllMucDoUuTien() {
        return this.mucdouutienEndpoint.getAllMucDoUuTien<MucDoUuTien[]>();
    }

    getMucDoUuTienByID(id?: number) {
        return this.mucdouutienEndpoint.getMucDoUuTienByID<MucDoUuTien>(id);
    }

    updateMucDoUuTien(id?: number, mucdouutien?: MucDoUuTien) {
        if (mucdouutien.mucDoUuTienId) {
            return this.mucdouutienEndpoint.updateMucDoUuTien(mucdouutien.mucDoUuTienId, mucdouutien);
        }
    }

    addnewMucDoUuTien(mucdouutien?: MucDoUuTien) {
        return this.mucdouutienEndpoint.addnewMucDoUuTien<MucDoUuTien>(mucdouutien);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteMucDoUuTien(id: number) {
        return this.mucdouutienEndpoint.deleteMucDoUuTien(id);
    }
    
}