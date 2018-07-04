import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { NhaCungCapEndpoint } from "./nhacungcap-endpoint.service";
import { NhaCungCap } from "../models/nhacungcap.model";
import { AuthService } from './auth.service';



@Injectable()
export class NhaCungCapService {
    constructor(private router: Router, private http: HttpClient, private nhacungcapEndpoint: NhaCungCapEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.nhacungcapEndpoint.getItems<NhaCungCap[]>(start, count, whereClause, orderBy);
    }
    
    getAllNhaCungCap() {
        return this.nhacungcapEndpoint.getAllNhaCungCap<NhaCungCap[]>();
    }

    getNhaCungCapByID(id?: number) {
        return this.nhacungcapEndpoint.getNhaCungCapByID<NhaCungCap>(id);
    }

    updateNhaCungCap(id?: number, nhacungcap?: NhaCungCap) {
        if (nhacungcap.nhaCungCapId) {
            return this.nhacungcapEndpoint.updateNhaCungCap(nhacungcap.nhaCungCapId, nhacungcap);
        }
    }

    addnewNhaCungCap(nhacungcap?: NhaCungCap) {
        return this.nhacungcapEndpoint.addnewNhaCungCap<NhaCungCap>(nhacungcap);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteNhaCungCap(id: number) {
        return this.nhacungcapEndpoint.deleteNhaCungCap(id);
    }
    
}