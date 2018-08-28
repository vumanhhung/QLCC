import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { VatTuEndpoint } from "./vattu-endpoint.service";
import { VatTu } from "../models/vattu.model";
import { AuthService } from './auth.service';
import { LoaiHang } from '../models/loaihang.model';
import { HangSanXuat } from '../models/hangsanxuat.model';



@Injectable()
export class VatTuService {
    constructor(private router: Router, private http: HttpClient, private vattuEndpoint: VatTuEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.vattuEndpoint.getItems<VatTu[]>(start, count, whereClause, orderBy);
    }
    
    getAllVatTu() {
        return this.vattuEndpoint.getAllVatTu<VatTu[]>();
    }

    getVatTuByID(id?: number) {
        return this.vattuEndpoint.getVatTuByID<VatTu>(id);
    }

    updateVatTu(id?: number, vattu?: VatTu) {
        if (vattu.vatTuId) {
            return this.vattuEndpoint.updateVatTu(vattu.vatTuId, vattu);
        }
    }

    addnewVatTu(vattu?: VatTu) {
        return this.vattuEndpoint.addnewVatTu<VatTu>(vattu);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteVatTu(id: number) {
        return this.vattuEndpoint.deleteVatTu(id);
    }

    //getLoaiHang() {
    //    return this.vattuEndpoint.getLoaiHang<LoaiHang[]>();
    //}

    //getHangSX() {
    //    return this.vattuEndpoint.getHangSX<HangSanXuat[]>();
    //}
}