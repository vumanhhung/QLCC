import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class TrangThaiCuDanEndpoint extends EndpointFactory {
    private readonly _trangthaicudanUrl = "/api/TrangThaiCuDans";
    get trangthaicudanUrl() { return this.configurations.baseUrl + this._trangthaicudanUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.trangthaicudanUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllTrangThaiCuDan<T>(): Observable<T> {
        return this.http.get(this.trangthaicudanUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllTrangThaiCuDan());
            });
    }
    
    getTrangThaiCuDanByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.trangthaicudanUrl}/${Id}` : this.trangthaicudanUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTrangThaiCuDanByID(Id));
            });
    }
    
    addnewTrangThaiCuDan<T>(trangthaicudanObject?: any): Observable<T> {
        let body = JSON.stringify(trangthaicudanObject);
        return this.http.post(this.trangthaicudanUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewTrangThaiCuDan(trangthaicudanObject));
        });
    }
    
    updateTrangThaiCuDan<T>(id?: number, trangthaicudanObject?: any): Observable<T> {
        let endpointUrl = `${this.trangthaicudanUrl}/${id}`;
        let body = JSON.stringify(trangthaicudanObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateTrangThaiCuDan(id, trangthaicudanObject));
        });
    }
    
    deleteTrangThaiCuDan<T>(id: number): Observable<T> {
        let endpointUrl = `${this.trangthaicudanUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteTrangThaiCuDan(id));
            });
    }
}