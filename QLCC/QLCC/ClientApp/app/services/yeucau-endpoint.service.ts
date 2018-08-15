import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class YeuCauEndpoint extends EndpointFactory {
    private readonly _yeucauUrl = "/api/YeuCaus";
    get yeucauUrl() { return this.configurations.baseUrl + this._yeucauUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.yeucauUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllYeuCau<T>(): Observable<T> {
        return this.http.get(this.yeucauUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllYeuCau());
            });
    }
    
    getYeuCauByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.yeucauUrl}/${Id}` : this.yeucauUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getYeuCauByID(Id));
            });
    }
    
    addnewYeuCau<T>(yeucauObject?: any): Observable<T> {
        let body = JSON.stringify(yeucauObject);
        return this.http.post(this.yeucauUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewYeuCau(yeucauObject));
        });
    }
    
    updateYeuCau<T>(id?: number, yeucauObject?: any): Observable<T> {
        let endpointUrl = `${this.yeucauUrl}/${id}`;
        let body = JSON.stringify(yeucauObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateYeuCau(id, yeucauObject));
        });
    }
    
    deleteYeuCau<T>(id: number): Observable<T> {
        let endpointUrl = `${this.yeucauUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteYeuCau(id));
            });
    }
}