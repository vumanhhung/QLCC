import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { LoaiHangEndpoint } from "./loaihang-endpoint.service";
import { LoaiHang } from "../models/loaihang.model";
import { AuthService } from './auth.service';



@Injectable()
export class LoaiHangService {
    constructor(private router: Router, private http: HttpClient, private loaihangEndpoint: LoaiHangEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.loaihangEndpoint.getItems<LoaiHang[]>(start, count, whereClause, orderBy);
    }
    
    getAllLoaiHang() {
        return this.loaihangEndpoint.getAllLoaiHang<LoaiHang[]>();
    }

    getLoaiHangByID(id?: number) {
        return this.loaihangEndpoint.getLoaiHangByID<LoaiHang>(id);
    }

    updateLoaiHang(id?: number, loaihang?: LoaiHang) {
        if (loaihang.loaiHangId) {
            return this.loaihangEndpoint.updateLoaiHang(loaihang.loaiHangId, loaihang);
        }
    }

    addnewLoaiHang(loaihang?: LoaiHang) {
        return this.loaihangEndpoint.addnewLoaiHang<LoaiHang>(loaihang);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteLoaiHang(id: number) {
        return this.loaihangEndpoint.deleteLoaiHang(id);
    }
    
}