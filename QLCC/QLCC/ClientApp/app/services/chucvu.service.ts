import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { ChucVuEndpoint } from "./chucvu-endpoint.service";
import { ChucVu } from "../models/chucvu.model";
import { AuthService } from './auth.service';



@Injectable()
export class ChucVuService {
    constructor(private router: Router, private http: HttpClient, private chucvuEndpoint: ChucVuEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.chucvuEndpoint.getItems<ChucVu[]>(start, count, whereClause, orderBy);
    }
    
    getAllChucVu() {
        return this.chucvuEndpoint.getAllChucVu<ChucVu[]>();
    }

    getChucVuByID(id?: number) {
        return this.chucvuEndpoint.getChucVuByID<ChucVu>(id);
    }

    updateChucVu(id?: number, chucvu?: ChucVu) {
        if (chucvu.chucVuId) {
            return this.chucvuEndpoint.updateChucVu(chucvu.chucVuId, chucvu);
        }
    }

    addnewChucVu(chucvu?: ChucVu) {
        return this.chucvuEndpoint.addnewChucVu<ChucVu>(chucvu);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteChucVu(id: number) {
        return this.chucvuEndpoint.deleteChucVu(id);
    }
    
}