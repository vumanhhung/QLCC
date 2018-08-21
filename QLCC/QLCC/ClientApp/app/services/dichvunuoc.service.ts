import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { DichVuNuocEndpoint } from "./dichvunuoc-endpoint.service";
import { DichVuNuoc } from "../models/dichvunuoc.model";
import { AuthService } from './auth.service';



@Injectable()
export class DichVuNuocService {
    constructor(private router: Router, private http: HttpClient, private dichvunuocEndpoint: DichVuNuocEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.dichvunuocEndpoint.getItems<DichVuNuoc[]>(start, count, whereClause, orderBy);
    }
    
    getAllDichVuNuoc() {
        return this.dichvunuocEndpoint.getAllDichVuNuoc<DichVuNuoc[]>();
    }

    getDichVuNuocByID(id?: number) {
        return this.dichvunuocEndpoint.getDichVuNuocByID<DichVuNuoc>(id);
    }

    updateDichVuNuoc(id?: number, dichvunuoc?: DichVuNuoc) {
        if (dichvunuoc.dichVuNuocId) {
            return this.dichvunuocEndpoint.updateDichVuNuoc(dichvunuoc.dichVuNuocId, dichvunuoc);
        }
    }

    addnewDichVuNuoc(dichvunuoc?: DichVuNuoc) {
        return this.dichvunuocEndpoint.addnewDichVuNuoc<DichVuNuoc>(dichvunuoc);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteDichVuNuoc(id: number) {
        return this.dichvunuocEndpoint.deleteDichVuNuoc(id);
    }
    
}