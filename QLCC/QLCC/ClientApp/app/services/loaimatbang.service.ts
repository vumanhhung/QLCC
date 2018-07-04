import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { LoaiMatBangEndpoint } from "./loaimatbang-endpoint.service";
import { LoaiMatBang } from "../models/loaimatbang.model";
import { AuthService } from './auth.service';



@Injectable()
export class LoaiMatBangService {
    constructor(private router: Router, private http: HttpClient, private loaimatbangEndpoint: LoaiMatBangEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.loaimatbangEndpoint.getItems<LoaiMatBang[]>(start, count, whereClause, orderBy);
    }
    
    getAllLoaiMatBang() {
        return this.loaimatbangEndpoint.getAllLoaiMatBang<LoaiMatBang[]>();
    }

    getLoaiMatBangByID(id?: number) {
        return this.loaimatbangEndpoint.getLoaiMatBangByID<LoaiMatBang>(id);
    }

    updateLoaiMatBang(id?: number, loaimatbang?: LoaiMatBang) {
        if (loaimatbang.loaiMatBangId) {
            return this.loaimatbangEndpoint.updateLoaiMatBang(loaimatbang.loaiMatBangId, loaimatbang);
        }
    }

    addnewLoaiMatBang(loaimatbang?: LoaiMatBang) {
        return this.loaimatbangEndpoint.addnewLoaiMatBang<LoaiMatBang>(loaimatbang);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteLoaiMatBang(id: number) {
        return this.loaimatbangEndpoint.deleteLoaiMatBang(id);
    }
    
}