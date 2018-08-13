import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { LoaiDichVuEndpoint } from "./loaidichvu-endpoint.service";
import { LoaiDichVu } from "../models/loaidichvu.model";
import { AuthService } from './auth.service';



@Injectable()
export class LoaiDichVuService {
    constructor(private router: Router, private http: HttpClient, private loaidichvuEndpoint: LoaiDichVuEndpoint, private authService: AuthService) {

    }

    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.loaidichvuEndpoint.getItems<LoaiDichVu[]>(start, count, whereClause, orderBy);
    }

    getAllLoaiDichVu() {
        return this.loaidichvuEndpoint.getAllLoaiDichVu<LoaiDichVu[]>();
    }

    getLoaiDichVuByID(id?: number) {
        return this.loaidichvuEndpoint.getLoaiDichVuByID<LoaiDichVu>(id);
    }

    updateLoaiDichVu(id?: number, loaidichvu?: LoaiDichVu) {
        if (loaidichvu.loaiDichVuId) {
            return this.loaidichvuEndpoint.updateLoaiDichVu(loaidichvu.loaiDichVuId, loaidichvu);
        }
    }

    addnewLoaiDichVu(loaidichvu?: LoaiDichVu) {
        return this.loaidichvuEndpoint.addnewLoaiDichVu<LoaiDichVu>(loaidichvu);
    }

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteLoaiDichVu(id: number) {
        return this.loaidichvuEndpoint.deleteLoaiDichVu(id);
    }

    dequy() {
        return this.loaidichvuEndpoint.dequy<LoaiDichVu[]>();
    }

    filterStatus(status?: number) {
        return this.loaidichvuEndpoint.filterStatus<LoaiDichVu[]>(status);
    }

    listDV(id?: number) {
        return this.loaidichvuEndpoint.listDV<LoaiDichVu[]>(id);
    }

    listDVCB(id?: number) {
        return this.loaidichvuEndpoint.listDVCB<LoaiDichVu[]>();
    }

    test() {
        return this.loaidichvuEndpoint.test<LoaiDichVu[]>();
    }

    expand(id?: number) {
        return this.loaidichvuEndpoint.expand<LoaiDichVu[]>(id);
    }
}