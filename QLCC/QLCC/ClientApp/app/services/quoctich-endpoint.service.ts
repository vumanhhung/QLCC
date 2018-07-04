import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class QuocTichEndpoint extends EndpointFactory {
    private readonly _quoctichUrl = "/api/QuocTichs";
    get quoctichUrl() { return this.configurations.baseUrl + this._quoctichUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.quoctichUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllQuocTich<T>(): Observable<T> {
        return this.http.get(this.quoctichUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllQuocTich());
            });
    }
    
    getQuocTichByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.quoctichUrl}/${Id}` : this.quoctichUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getQuocTichByID(Id));
            });
    }
    
    addnewQuocTich<T>(quoctichObject?: any): Observable<T> {
        let body = JSON.stringify(quoctichObject);
        return this.http.post(this.quoctichUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewQuocTich(quoctichObject));
        });
    }
    
    updateQuocTich<T>(id?: number, quoctichObject?: any): Observable<T> {
        let endpointUrl = `${this.quoctichUrl}/${id}`;
        let body = JSON.stringify(quoctichObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateQuocTich(id, quoctichObject));
        });
    }
    
    deleteQuocTich<T>(id: number): Observable<T> {
        let endpointUrl = `${this.quoctichUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteQuocTich(id));
            });
    }
}