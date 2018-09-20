import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { VatTuHinhAnhEndpoint } from "./vattuhinhanh-endpoint.service";
import { VatTuHinhAnh } from "../models/vattuhinhanh.model";
import { AuthService } from './auth.service';



@Injectable()
export class VatTuHinhAnhService {
    constructor(private router: Router, private http: HttpClient, private vattuhinhanhEndpoint: VatTuHinhAnhEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.vattuhinhanhEndpoint.getItems<VatTuHinhAnh[]>(start, count, whereClause, orderBy);
    }
    
    getAllVatTuHinhAnh() {
        return this.vattuhinhanhEndpoint.getAllVatTuHinhAnh<VatTuHinhAnh[]>();
    }

    getVatTuHinhAnhByID(id?: number) {
        return this.vattuhinhanhEndpoint.getVatTuHinhAnhByID<VatTuHinhAnh[]>(id);
    }

    updateVatTuHinhAnh(id?: number, vattuhinhanh?: VatTuHinhAnh) {
        if (vattuhinhanh.vatTuHinhAnhId) {
            return this.vattuhinhanhEndpoint.updateVatTuHinhAnh(vattuhinhanh.vatTuHinhAnhId, vattuhinhanh);
        }
    }

    addnewVatTuHinhAnh(vattuhinhanh?: VatTuHinhAnh) {
        return this.vattuhinhanhEndpoint.addnewVatTuHinhAnh<VatTuHinhAnh>(vattuhinhanh);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteVatTuHinhAnh(id: number) {
        return this.vattuhinhanhEndpoint.deleteVatTuHinhAnh(id);
    }

    deleteAllVatTuHinhAnh(id: number) {
        return this.vattuhinhanhEndpoint.deleteAllVatTuHinhAnh(id);
    }

    getCount(id?: number) {
        return this.vattuhinhanhEndpoint.getCount<VatTuHinhAnh[]>(id);
    }

    getFilter(value?: number) {
        return this.vattuhinhanhEndpoint.getFilter<VatTuHinhAnh[]>(value);
    }
}