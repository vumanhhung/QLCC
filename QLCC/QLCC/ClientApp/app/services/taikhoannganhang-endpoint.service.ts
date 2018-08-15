import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class TaiKhoanNganHangEndpoint extends EndpointFactory {
    private readonly _taikhoannganhangUrl = "/api/TaiKhoanNganHangs";
    get taikhoannganhangUrl() { return this.configurations.baseUrl + this._taikhoannganhangUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.taikhoannganhangUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllTaiKhoanNganHang<T>(): Observable<T> {
        return this.http.get(this.taikhoannganhangUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllTaiKhoanNganHang());
            });
    }


    getTaiKhoanNganHangByNganHang<T>(nganhang: number): Observable<T> {
        let endpointUrl = nganhang != 0 ? `${this.taikhoannganhangUrl}/getTaiKhoanNganHangByNganHang/${nganhang}` : this.taikhoannganhangUrl;
        return this.http.get(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTaiKhoanNganHangByNganHang(nganhang));
            });
    }


    getTaiKhoanNganHangByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.taikhoannganhangUrl}/${Id}` : this.taikhoannganhangUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTaiKhoanNganHangByID(Id));
            });
    }
    
    addnewTaiKhoanNganHang<T>(taikhoannganhangObject?: any): Observable<T> {
        let body = JSON.stringify(taikhoannganhangObject);
        return this.http.post(this.taikhoannganhangUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewTaiKhoanNganHang(taikhoannganhangObject));
        });
    }
    
    updateTaiKhoanNganHang<T>(id?: number, taikhoannganhangObject?: any): Observable<T> {
        let endpointUrl = `${this.taikhoannganhangUrl}/${id}`;
        let body = JSON.stringify(taikhoannganhangObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateTaiKhoanNganHang(id, taikhoannganhangObject));
        });
    }
    
    deleteTaiKhoanNganHang<T>(id: number): Observable<T> {
        let endpointUrl = `${this.taikhoannganhangUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteTaiKhoanNganHang(id));
            });
    }
}