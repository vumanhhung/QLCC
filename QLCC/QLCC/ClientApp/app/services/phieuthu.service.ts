import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { PhieuThuEndpoint } from "./phieuthu-endpoint.service";
import { PhieuThu } from "../models/phieuthu.model";
import { AuthService } from './auth.service';



@Injectable()
export class PhieuThuService {
    constructor(private router: Router, private http: HttpClient, private phieuthuEndpoint: PhieuThuEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.phieuthuEndpoint.getItems<PhieuThu[]>(start, count, whereClause, orderBy);
    }
    
    getAllPhieuThu() {
        return this.phieuthuEndpoint.getAllPhieuThu<PhieuThu[]>();
    }

    getPhieuThuByID(id?: number) {
        return this.phieuthuEndpoint.getPhieuThuByID<PhieuThu>(id);
    }

    updatePhieuThu(id?: number, phieuthu?: PhieuThu) {
        if (phieuthu.phieuThuId) {
            return this.phieuthuEndpoint.updatePhieuThu(phieuthu.phieuThuId, phieuthu);
        }
    }

    addnewPhieuThu(phieuthu?: PhieuThu) {
        return this.phieuthuEndpoint.addnewPhieuThu<PhieuThu>(phieuthu);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deletePhieuThu(id: number) {
        return this.phieuthuEndpoint.deletePhieuThu(id);
    }
    
}