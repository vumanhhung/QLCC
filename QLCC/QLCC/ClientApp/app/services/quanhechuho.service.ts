import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { QuanHeChuHoEndpoint } from "./quanhechuho-endpoint.service";
import { QuanHeChuHo } from "../models/quanhechuho.model";
import { AuthService } from './auth.service';



@Injectable()
export class QuanHeChuHoService {
    constructor(private router: Router, private http: HttpClient, private quanhechuhoEndpoint: QuanHeChuHoEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.quanhechuhoEndpoint.getItems<QuanHeChuHo[]>(start, count, whereClause, orderBy);
    }
    
    getAllQuanHeChuHo() {
        return this.quanhechuhoEndpoint.getAllQuanHeChuHo<QuanHeChuHo[]>();
    }

    getQuanHeChuHoByID(id?: number) {
        return this.quanhechuhoEndpoint.getQuanHeChuHoByID<QuanHeChuHo>(id);
    }

    updateQuanHeChuHo(id?: number, quanhechuho?: QuanHeChuHo) {
        if (quanhechuho.quanHeChuHoId) {
            return this.quanhechuhoEndpoint.updateQuanHeChuHo(quanhechuho.quanHeChuHoId, quanhechuho);
        }
    }

    addnewQuanHeChuHo(quanhechuho?: QuanHeChuHo) {
        return this.quanhechuhoEndpoint.addnewQuanHeChuHo<QuanHeChuHo>(quanhechuho);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteQuanHeChuHo(id: number) {
        return this.quanhechuhoEndpoint.deleteQuanHeChuHo(id);
    }
    
}