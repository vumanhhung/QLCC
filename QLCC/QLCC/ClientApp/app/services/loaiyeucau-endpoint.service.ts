import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class LoaiYeuCauEndpoint extends EndpointFactory {
    private readonly _loaiyeucauUrl = "/api/LoaiYeuCaus";
    get loaiyeucauUrl() { return this.configurations.baseUrl + this._loaiyeucauUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.loaiyeucauUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllLoaiYeuCau<T>(): Observable<T> {
        return this.http.get(this.loaiyeucauUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllLoaiYeuCau());
            });
    }
    
    getLoaiYeuCauByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.loaiyeucauUrl}/${Id}` : this.loaiyeucauUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLoaiYeuCauByID(Id));
            });
    }
    
    addnewLoaiYeuCau<T>(loaiyeucauObject?: any): Observable<T> {
        let body = JSON.stringify(loaiyeucauObject);
        return this.http.post(this.loaiyeucauUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewLoaiYeuCau(loaiyeucauObject));
        });
    }
    
    updateLoaiYeuCau<T>(id?: number, loaiyeucauObject?: any): Observable<T> {
        let endpointUrl = `${this.loaiyeucauUrl}/${id}`;
        let body = JSON.stringify(loaiyeucauObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateLoaiYeuCau(id, loaiyeucauObject));
        });
    }
    
    deleteLoaiYeuCau<T>(id: number): Observable<T> {
        let endpointUrl = `${this.loaiyeucauUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteLoaiYeuCau(id));
            });
    }
}