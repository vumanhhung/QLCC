import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class KhachHangEndpoint extends EndpointFactory {
    private readonly _khachhangUrl = "/api/KhachHangs";
    get khachhangUrl() { return this.configurations.baseUrl + this._khachhangUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.khachhangUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllKhachHang<T>(): Observable<T> {
        let url = `${this.khachhangUrl}/getcanhan`;
        return this.http.get(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllKhachHang());
            });
    }
    getAllKhachHangDoanhNghiep<T>(): Observable<T> {
        let url = `${this.khachhangUrl}/getdoanhnghiep`;
        return this.http.get(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllKhachHangDoanhNghiep());
            });
    }
    getKhachHangByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.khachhangUrl}/${Id}` : this.khachhangUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getKhachHangByID(Id));
            });
    }
    
    addnewKhachHang<T>(khachhangObject?: any): Observable<T> {
        let body = JSON.stringify(khachhangObject);
        return this.http.post(this.khachhangUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewKhachHang(khachhangObject));
        });
    }
    
    updateKhachHang<T>(id?: number, khachhangObject?: any): Observable<T> {
        let endpointUrl = `${this.khachhangUrl}/${id}`;
        let body = JSON.stringify(khachhangObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateKhachHang(id, khachhangObject));
        });
    }
    
    deleteKhachHang<T>(id: number): Observable<T> {
        let endpointUrl = `${this.khachhangUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteKhachHang(id));
            });
    }
}