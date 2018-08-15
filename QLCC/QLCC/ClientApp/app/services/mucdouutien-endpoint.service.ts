import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class MucDoUuTienEndpoint extends EndpointFactory {
    private readonly _mucdouutienUrl = "/api/MucDoUuTiens";
    get mucdouutienUrl() { return this.configurations.baseUrl + this._mucdouutienUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.mucdouutienUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllMucDoUuTien<T>(): Observable<T> {
        return this.http.get(this.mucdouutienUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllMucDoUuTien());
            });
    }
    
    getMucDoUuTienByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.mucdouutienUrl}/${Id}` : this.mucdouutienUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getMucDoUuTienByID(Id));
            });
    }
    
    addnewMucDoUuTien<T>(mucdouutienObject?: any): Observable<T> {
        let body = JSON.stringify(mucdouutienObject);
        return this.http.post(this.mucdouutienUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewMucDoUuTien(mucdouutienObject));
        });
    }
    
    updateMucDoUuTien<T>(id?: number, mucdouutienObject?: any): Observable<T> {
        let endpointUrl = `${this.mucdouutienUrl}/${id}`;
        let body = JSON.stringify(mucdouutienObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateMucDoUuTien(id, mucdouutienObject));
        });
    }
    
    deleteMucDoUuTien<T>(id: number): Observable<T> {
        let endpointUrl = `${this.mucdouutienUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteMucDoUuTien(id));
            });
    }
}