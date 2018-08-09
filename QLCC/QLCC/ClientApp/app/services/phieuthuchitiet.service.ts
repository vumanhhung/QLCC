import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { PhieuThuChiTietEndpoint } from "./phieuthuchitiet-endpoint.service";
import { PhieuThuChiTiet } from "../models/phieuthuchitiet.model";
import { AuthService } from './auth.service';



@Injectable()
export class PhieuThuChiTietService {
    constructor(private router: Router, private http: HttpClient, private phieuthuchitietEndpoint: PhieuThuChiTietEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.phieuthuchitietEndpoint.getItems<PhieuThuChiTiet[]>(start, count, whereClause, orderBy);
    }
    
    getAllPhieuThuChiTiet() {
        return this.phieuthuchitietEndpoint.getAllPhieuThuChiTiet<PhieuThuChiTiet[]>();
    }

    getPhieuThuChiTietByID(id?: number) {
        return this.phieuthuchitietEndpoint.getPhieuThuChiTietByID<PhieuThuChiTiet>(id);
    }

    updatePhieuThuChiTiet(id?: number, phieuthuchitiet?: PhieuThuChiTiet) {
        if (phieuthuchitiet.phieuThuChiTietId) {
            return this.phieuthuchitietEndpoint.updatePhieuThuChiTiet(phieuthuchitiet.phieuThuChiTietId, phieuthuchitiet);
        }
    }

    addnewPhieuThuChiTiet(phieuthuchitiet?: PhieuThuChiTiet) {
        return this.phieuthuchitietEndpoint.addnewPhieuThuChiTiet<PhieuThuChiTiet>(phieuthuchitiet);
    }    

    addnewPhieuThuChiTiets(phieuthuchitiets?: PhieuThuChiTiet[]) {
        return this.phieuthuchitietEndpoint.addnewPhieuThuChiTiets<PhieuThuChiTiet[]>(phieuthuchitiets);
    }

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deletePhieuThuChiTiet(id: number) {
        return this.phieuthuchitietEndpoint.deletePhieuThuChiTiet(id);
    }
    
}