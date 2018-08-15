import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { LoaiTienEndpoint } from "./loaitien-endpoint.service";
import { LoaiTien } from "../models/loaitien.model";
import { AuthService } from './auth.service';



@Injectable()
export class LoaiTienService {
    constructor(private router: Router, private http: HttpClient, private loaitienEndpoint: LoaiTienEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.loaitienEndpoint.getItems<LoaiTien[]>(start, count, whereClause, orderBy);
    }
    
    getAllLoaiTien() {
        return this.loaitienEndpoint.getAllLoaiTien<LoaiTien[]>();
    }

    getLoaiTienByID(id?: number) {
        return this.loaitienEndpoint.getLoaiTienByID<LoaiTien>(id);
    }

    updateLoaiTien(id?: number, loaitien?: LoaiTien) {
        if (loaitien.loaiTienId) {
            return this.loaitienEndpoint.updateLoaiTien(loaitien.loaiTienId, loaitien);
        }
    }

    addnewLoaiTien(loaitien?: LoaiTien) {
        return this.loaitienEndpoint.addnewLoaiTien<LoaiTien>(loaitien);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteLoaiTien(id: number) {
        return this.loaitienEndpoint.deleteLoaiTien(id);
    }
    
}