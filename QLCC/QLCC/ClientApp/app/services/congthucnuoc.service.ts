import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { CongThucNuocEndpoint } from "./congthucnuoc-endpoint.service";
import { CongThucNuoc } from "../models/congthucnuoc.model";
import { AuthService } from './auth.service';



@Injectable()
export class CongThucNuocService {
    constructor(private router: Router, private http: HttpClient, private congthucnuocEndpoint: CongThucNuocEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.congthucnuocEndpoint.getItems<CongThucNuoc[]>(start, count, whereClause, orderBy);
    }
    
    getAllCongThucNuoc() {
        return this.congthucnuocEndpoint.getAllCongThucNuoc<CongThucNuoc[]>();
    }

    getCongThucNuocByID(id?: number) {
        return this.congthucnuocEndpoint.getCongThucNuocByID<CongThucNuoc>(id);
    }

    updateCongThucNuoc(id?: number, congthucnuoc?: CongThucNuoc) {
        if (congthucnuoc.congThucNuocId) {
            return this.congthucnuocEndpoint.updateCongThucNuoc(congthucnuoc.congThucNuocId, congthucnuoc);
        }
    }

    addnewCongThucNuoc(congthucnuoc?: CongThucNuoc) {
        return this.congthucnuocEndpoint.addnewCongThucNuoc<CongThucNuoc>(congthucnuoc);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteCongThucNuoc(id: number) {
        return this.congthucnuocEndpoint.deleteCongThucNuoc(id);
    }

    changeStatus(id: number) {
        return this.congthucnuocEndpoint.changeStatus(id);
    }

    checkStatus() {
        return this.congthucnuocEndpoint.checkstatus();
    }

    filter(status?: boolean) {
        return this.congthucnuocEndpoint.filterStatus<CongThucNuoc[]>(status);
    }
}