import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { LoaiXeEndpoint } from "./loaixe-endpoint.service";
import { LoaiXe } from "../models/loaixe.model";
import { AuthService } from './auth.service';
import { Route } from '@angular/compiler/src/core';



@Injectable()
export class LoaiXeService {
    constructor(private http: HttpClient, private router: Router, private endpointService: LoaiXeEndpoint, private authService: AuthService) {
    }

    getItem(start: number, count: number, whereClause: string, orderBy: string) {
        return this.endpointService.getItem<LoaiXe[]>(start, count, whereClause, orderBy);
    }

    getAllLoaiXe() {
        return this.endpointService.getAllLoaixe<LoaiXe[]>();
    }

    getLoaixeByID(id?: number) {
        return this.endpointService.getLoaiXeByID<LoaiXe>(id);
    }

    addnewLoaixe(loaixe?: LoaiXe) {
        return this.endpointService.addnewLoaiXe<LoaiXe>(loaixe);
    }

    updateLoaixe(id?: number, loaixe?: LoaiXe) {
        if (loaixe.loaiXeId) {
            return this.endpointService.updateLoaiXe<LoaiXe>(loaixe.loaiXeId, loaixe);
        }
    }

    deleteLoaixe(id?: number) {
        return this.endpointService.deleteLoaiXe<LoaiXe>(id);
    }

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }
}