import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { DinhMucNuocEndpoint } from "./dinhmucnuoc-endpoint.service";
import { DinhMucNuoc } from "../models/dinhmucnuoc.model";
import { AuthService } from './auth.service';



@Injectable()
export class DinhMucNuocService {
    constructor(private router: Router, private http: HttpClient, private dinhmucnuocEndpoint: DinhMucNuocEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.dinhmucnuocEndpoint.getItems<DinhMucNuoc[]>(start, count, whereClause, orderBy);
    }

    getAllDinhMucNuoc(id?: number) {
        return this.dinhmucnuocEndpoint.getAllDinhMucNuoc<DinhMucNuoc[]>(id);
    }

    getDinhMucNuocByID(id?: number) {
        return this.dinhmucnuocEndpoint.getDinhMucNuocByID<DinhMucNuoc>(id);
    }

    updateDinhMucNuoc(id?: number, dinhmucnuoc?: DinhMucNuoc) {
        if (dinhmucnuoc.dinhMucNuocId) {
            return this.dinhmucnuocEndpoint.updateDinhMucNuoc(dinhmucnuoc.dinhMucNuocId, dinhmucnuoc);
        }
    }

    addnewDinhMucNuoc(dinhmucnuoc?: DinhMucNuoc) {
        return this.dinhmucnuocEndpoint.addnewDinhMucNuoc<DinhMucNuoc>(dinhmucnuoc);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteDinhMucNuoc(id: number) {
        return this.dinhmucnuocEndpoint.deleteDinhMucNuoc(id);
    }

    getMax() {
        return this.dinhmucnuocEndpoint.getMax<number>();
    }
}