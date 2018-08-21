import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { HopDongEndpoint } from "./hopdong-endpoint.service";
import { HopDong } from "../models/hopdong.model";
import { AuthService } from './auth.service';



@Injectable()
export class HopDongService {
    constructor(private router: Router, private http: HttpClient, private hopdongEndpoint: HopDongEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.hopdongEndpoint.getItems<HopDong[]>(start, count, whereClause, orderBy);
    }
    
    getAllHopDong() {
        return this.hopdongEndpoint.getAllHopDong<HopDong[]>();
    }

    getHopDongByID(id?: number) {
        return this.hopdongEndpoint.getHopDongByID<HopDong>(id);
    }

    updateHopDong(id?: number, hopdong?: HopDong) {
        if (hopdong.hopDongId) {
            return this.hopdongEndpoint.updateHopDong(hopdong.hopDongId, hopdong);
        }
    }

    addnewHopDong(hopdong?: HopDong) {
        return this.hopdongEndpoint.addnewHopDong<HopDong>(hopdong);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteHopDong(id: number) {
        return this.hopdongEndpoint.deleteHopDong(id);
    }
    
}