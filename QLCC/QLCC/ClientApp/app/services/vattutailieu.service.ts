import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { VatTuTaiLieuEndpoint } from "./vattutailieu-endpoint.service";
import { VatTuTaiLieu } from "../models/vattutailieu.model";
import { AuthService } from './auth.service';



@Injectable()
export class VatTuTaiLieuService {
    constructor(private router: Router, private http: HttpClient, private vattutailieuEndpoint: VatTuTaiLieuEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.vattutailieuEndpoint.getItems<VatTuTaiLieu[]>(start, count, whereClause, orderBy);
    }
    
    getAllVatTuTaiLieu() {
        return this.vattutailieuEndpoint.getAllVatTuTaiLieu<VatTuTaiLieu[]>();
    }

    getVatTuTaiLieuByID(id?: number) {
        return this.vattutailieuEndpoint.getVatTuTaiLieuByID<VatTuTaiLieu[]>(id);
    }

    updateVatTuTaiLieu(id?: number, vattutailieu?: VatTuTaiLieu) {
        if (vattutailieu.vatTutaiLieuId) {
            return this.vattutailieuEndpoint.updateVatTuTaiLieu(vattutailieu.vatTutaiLieuId, vattutailieu);
        }
    }

    addnewVatTuTaiLieu(vattutailieu?: VatTuTaiLieu) {
        return this.vattutailieuEndpoint.addnewVatTuTaiLieu<VatTuTaiLieu>(vattutailieu);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteVatTuTaiLieu(id: number) {
        return this.vattutailieuEndpoint.deleteVatTuTaiLieu(id);
    }

    deleteAllVatTuTaiLieu(id: number) {
        return this.vattutailieuEndpoint.deleteAllVatTuTaiLieu(id);
    }

    getExist(name?: string) {
        return this.vattutailieuEndpoint.getExist(name);
    }
}