import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class TrangThaiYeuCauEndpoint extends EndpointFactory {
    private readonly _trangthaiyeucauUrl = "/api/TrangThaiYeuCaus";
    get trangthaiyeucauUrl() { return this.configurations.baseUrl + this._trangthaiyeucauUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.trangthaiyeucauUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllTrangThaiYeuCau<T>(): Observable<T> {
        return this.http.get(this.trangthaiyeucauUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllTrangThaiYeuCau());
            });
    }
    
    getTrangThaiYeuCauByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.trangthaiyeucauUrl}/${Id}` : this.trangthaiyeucauUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTrangThaiYeuCauByID(Id));
            });
    }
    
    addnewTrangThaiYeuCau<T>(trangthaiyeucauObject?: any): Observable<T> {
        let body = JSON.stringify(trangthaiyeucauObject);
        return this.http.post(this.trangthaiyeucauUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewTrangThaiYeuCau(trangthaiyeucauObject));
        });
    }
    
    updateTrangThaiYeuCau<T>(id?: number, trangthaiyeucauObject?: any): Observable<T> {
        let endpointUrl = `${this.trangthaiyeucauUrl}/${id}`;
        let body = JSON.stringify(trangthaiyeucauObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateTrangThaiYeuCau(id, trangthaiyeucauObject));
        });
    }
    
    deleteTrangThaiYeuCau<T>(id: number): Observable<T> {
        let endpointUrl = `${this.trangthaiyeucauUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteTrangThaiYeuCau(id));
            });
    }
}