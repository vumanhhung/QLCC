import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { TrangThai } from "../models/trangthai.model";
import { TrangThaiEndpoint } from './trangthai-endpoint.service';
import { AuthService } from './auth.service';



@Injectable()
export class TrangThaiService {
    constructor(private router: Router, private http: HttpClient, private trangthaiEndpoint: TrangThaiEndpoint, private authService: AuthService) {

    }
    
    getAllTrangThai() {
        return this.trangthaiEndpoint.getAllTrangThai<TrangThai[]>();
    }

    getTrangThaiByID(id?: number) {
        return this.trangthaiEndpoint.getTrangThaiByID<TrangThai>(id);
    }

    updateTrangThai(id?: number, trangthai?: TrangThai) {
        if (trangthai.trangThaiId) {
            return this.trangthaiEndpoint.updateTrangThai(trangthai.trangThaiId, trangthai);
        }
    }

    addnewTrangThai(trangthai?: TrangThai) {
        return this.trangthaiEndpoint.addnewTrangThai<TrangThai>(trangthai);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteTrangThai(id: number) {
        return this.trangthaiEndpoint.deleteTrangThai(id);
    }
    
}