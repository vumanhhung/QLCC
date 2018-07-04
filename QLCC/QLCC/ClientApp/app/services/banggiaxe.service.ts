import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { BangGiaXeEndpoint } from "./banggiaxe-endpoint.service";
import { BangGiaXe } from "../models/banggiaxe.model";
import { AuthService } from './auth.service';



@Injectable()
export class BangGiaXeService {
    constructor(private router: Router, private http: HttpClient, private banggiaxeEndpoint: BangGiaXeEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.banggiaxeEndpoint.getItems<BangGiaXe[]>(start, count, whereClause, orderBy);
    }
    
    getAllBangGiaXe() {
        return this.banggiaxeEndpoint.getAllBangGiaXe<BangGiaXe[]>();
    }

    getBangGiaXeByID(id?: number) {
        return this.banggiaxeEndpoint.getBangGiaXeByID<BangGiaXe>(id);
    }

    updateBangGiaXe(id?: number, banggiaxe?: BangGiaXe) {
        if (banggiaxe.bangGiaXeId) {
            return this.banggiaxeEndpoint.updateBangGiaXe(banggiaxe.bangGiaXeId, banggiaxe);
        }
    }

    addnewBangGiaXe(banggiaxe?: BangGiaXe) {
        return this.banggiaxeEndpoint.addnewBangGiaXe<BangGiaXe>(banggiaxe);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteBangGiaXe(id: number) {
        return this.banggiaxeEndpoint.deleteBangGiaXe(id);
    }
    
}