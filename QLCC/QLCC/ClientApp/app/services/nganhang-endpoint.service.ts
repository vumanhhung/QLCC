import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class NganHangEndpoint extends EndpointFactory {
    private readonly _nganhangUrl = "/api/NganHangs";
    get nganhangUrl() { return this.configurations.baseUrl + this._nganhangUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.nganhangUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllNganHang<T>(): Observable<T> {
        return this.http.get(this.nganhangUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllNganHang());
            });
    }
    
    getNganHangByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.nganhangUrl}/${Id}` : this.nganhangUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNganHangByID(Id));
            });
    }
    
    addnewNganHang<T>(nganhangObject?: any): Observable<T> {
        let body = JSON.stringify(nganhangObject);
        return this.http.post(this.nganhangUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewNganHang(nganhangObject));
        });
    }
    
    updateNganHang<T>(id?: number, nganhangObject?: any): Observable<T> {
        let endpointUrl = `${this.nganhangUrl}/${id}`;
        let body = JSON.stringify(nganhangObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateNganHang(id, nganhangObject));
        });
    }
    
    deleteNganHang<T>(id: number): Observable<T> {
        let endpointUrl = `${this.nganhangUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteNganHang(id));
            });
    }
}