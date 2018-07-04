import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class QuanHeChuHoEndpoint extends EndpointFactory {
    private readonly _quanhechuhoUrl = "/api/QuanHeChuHos";
    get quanhechuhoUrl() { return this.configurations.baseUrl + this._quanhechuhoUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.quanhechuhoUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllQuanHeChuHo<T>(): Observable<T> {
        return this.http.get(this.quanhechuhoUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllQuanHeChuHo());
            });
    }
    
    getQuanHeChuHoByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.quanhechuhoUrl}/${Id}` : this.quanhechuhoUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getQuanHeChuHoByID(Id));
            });
    }
    
    addnewQuanHeChuHo<T>(quanhechuhoObject?: any): Observable<T> {
        let body = JSON.stringify(quanhechuhoObject);
        return this.http.post(this.quanhechuhoUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewQuanHeChuHo(quanhechuhoObject));
        });
    }
    
    updateQuanHeChuHo<T>(id?: number, quanhechuhoObject?: any): Observable<T> {
        let endpointUrl = `${this.quanhechuhoUrl}/${id}`;
        let body = JSON.stringify(quanhechuhoObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateQuanHeChuHo(id, quanhechuhoObject));
        });
    }
    
    deleteQuanHeChuHo<T>(id: number): Observable<T> {
        let endpointUrl = `${this.quanhechuhoUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteQuanHeChuHo(id));
            });
    }
}