import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { NguoiDungToaNhaEndpoint } from "./nguoidungtoanha-endpoint.service";
import { NguoiDungToaNha } from "../models/nguoidungtoanha.model";
import { AuthService } from './auth.service';



@Injectable()
export class NguoiDungToaNhaService {
    constructor(private router: Router, private http: HttpClient, private nguoidungtoanhaEndpoint: NguoiDungToaNhaEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.nguoidungtoanhaEndpoint.getItems<NguoiDungToaNha[]>(start, count, whereClause, orderBy);
    }
    
    getAllNguoiDungToaNha() {
        return this.nguoidungtoanhaEndpoint.getAllNguoiDungToaNha<NguoiDungToaNha[]>();
    }

    getNguoiDungToaNhaByID(id?: number) {
        return this.nguoidungtoanhaEndpoint.getNguoiDungToaNhaByID<NguoiDungToaNha>(id);
    }

    updateNguoiDungToaNha(id?: number, nguoidungtoanha?: NguoiDungToaNha) {
        if (nguoidungtoanha.nguoiDungToaNhaId) {
            return this.nguoidungtoanhaEndpoint.updateNguoiDungToaNha(nguoidungtoanha.nguoiDungToaNhaId, nguoidungtoanha);
        }
    }

    addnewNguoiDungToaNha(nguoidungtoanha?: NguoiDungToaNha) {
        return this.nguoidungtoanhaEndpoint.addnewNguoiDungToaNha<NguoiDungToaNha>(nguoidungtoanha);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteNguoiDungToaNha(id: number) {
        return this.nguoidungtoanhaEndpoint.deleteNguoiDungToaNha(id);
    }
    
}