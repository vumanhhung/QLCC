import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { DonViTinhEndpoint } from "./donvitinh-endpoint.service";
import { DonViTinh } from "../models/donvitinh.model";
import { AuthService } from './auth.service';



@Injectable()
export class DonViTinhService {
    constructor(private router: Router, private http: HttpClient, private donvitinhEndpoint: DonViTinhEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.donvitinhEndpoint.getItems<DonViTinh[]>(start, count, whereClause, orderBy);
    }
    
    getAllDonViTinh() {
        return this.donvitinhEndpoint.getAllDonViTinh<DonViTinh[]>();
    }

    getDonViTinhByID(id?: number) {
        return this.donvitinhEndpoint.getDonViTinhByID<DonViTinh>(id);
    }

    updateDonViTinh(id?: number, donvitinh?: DonViTinh) {
        if (donvitinh.donViTinhId) {
            return this.donvitinhEndpoint.updateDonViTinh(donvitinh.donViTinhId, donvitinh);
        }
    }

    addnewDonViTinh(donvitinh?: DonViTinh) {
        return this.donvitinhEndpoint.addnewDonViTinh<DonViTinh>(donvitinh);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteDonViTinh(id: number) {
        return this.donvitinhEndpoint.deleteDonViTinh(id);
    }
    
}