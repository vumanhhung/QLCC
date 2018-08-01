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



@Injectable()
export class LoaiXeService {
    constructor(private router: Router, private http: HttpClient, private loaixeEndpoint: LoaiXeEndpoint, private authService: AuthService) {

    }

    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.loaixeEndpoint.getItems<LoaiXe[]>(start, count, whereClause, orderBy);
    }

    getAllLoaiXe() {
        return this.loaixeEndpoint.getAllLoaiXe<LoaiXe[]>();
    }

    getLoaiXeByID(id?: number) {
        return this.loaixeEndpoint.getLoaiXeByID<LoaiXe>(id);
    }

    updateLoaiXe(id?: number, loaixe?: LoaiXe) {
        if (loaixe.loaiXeId) {
            return this.loaixeEndpoint.updateLoaiXe(loaixe.loaiXeId, loaixe);
        }
    }

    addnewLoaiXe(loaixe?: LoaiXe) {
        return this.loaixeEndpoint.addnewLoaiXe<LoaiXe>(loaixe);
    }

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteLoaiXe(id: number) {
        return this.loaixeEndpoint.deleteLoaiXe(id);
    }

    getName(tenloaixe?: LoaiXe) {
        return this.loaixeEndpoint.getName<LoaiXe>(tenloaixe);
    }

}