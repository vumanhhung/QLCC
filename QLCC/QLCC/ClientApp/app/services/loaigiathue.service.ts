import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { LoaiGiaThueEndpoint } from "./loaigiathue-endpoint.service";
import { LoaiGiaThue } from "../models/loaigiathue.model";
import { AuthService } from './auth.service';



@Injectable()
export class LoaiGiaThueService {
    constructor(private router: Router, private http: HttpClient, private loaigiathueEndpoint: LoaiGiaThueEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.loaigiathueEndpoint.getItems<LoaiGiaThue[]>(start, count, whereClause, orderBy);
    }
    
    getAllLoaiGiaThue() {
        return this.loaigiathueEndpoint.getAllLoaiGiaThue<LoaiGiaThue[]>();
    }
    getLoaiGiaThueByLoaiTien(loaitien:number) {
        return this.loaigiathueEndpoint.getLoaiGiaThueByLoaiTien<LoaiGiaThue[]>(loaitien);
    }
    getLoaiGiaThueByID(id?: number) {
        return this.loaigiathueEndpoint.getLoaiGiaThueByID<LoaiGiaThue>(id);
    }

    updateLoaiGiaThue(id?: number, loaigiathue?: LoaiGiaThue) {
        if (loaigiathue.loaiGiaThueId) {
            return this.loaigiathueEndpoint.updateLoaiGiaThue(loaigiathue.loaiGiaThueId, loaigiathue);
        }
    }

    addnewLoaiGiaThue(loaigiathue?: LoaiGiaThue) {
        return this.loaigiathueEndpoint.addnewLoaiGiaThue<LoaiGiaThue>(loaigiathue);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteLoaiGiaThue(id: number) {
        return this.loaigiathueEndpoint.deleteLoaiGiaThue(id);
    }
    
}