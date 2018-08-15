import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class NhomKhachHangEndpoint extends EndpointFactory {
    private readonly _nhomkhachhangUrl = "/api/NhomKhachHangs";
    get nhomkhachhangUrl() { return this.configurations.baseUrl + this._nhomkhachhangUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.nhomkhachhangUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllNhomKhachHang<T>(): Observable<T> {
        return this.http.get(this.nhomkhachhangUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllNhomKhachHang());
            });
    }
    
    getNhomKhachHangByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.nhomkhachhangUrl}/${Id}` : this.nhomkhachhangUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNhomKhachHangByID(Id));
            });
    }
    
    addnewNhomKhachHang<T>(nhomkhachhangObject?: any): Observable<T> {
        let body = JSON.stringify(nhomkhachhangObject);
        return this.http.post(this.nhomkhachhangUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewNhomKhachHang(nhomkhachhangObject));
        });
    }
    
    updateNhomKhachHang<T>(id?: number, nhomkhachhangObject?: any): Observable<T> {
        let endpointUrl = `${this.nhomkhachhangUrl}/${id}`;
        let body = JSON.stringify(nhomkhachhangObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateNhomKhachHang(id, nhomkhachhangObject));
        });
    }
    
    deleteNhomKhachHang<T>(id: number): Observable<T> {
        let endpointUrl = `${this.nhomkhachhangUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteNhomKhachHang(id));
            });
    }
}