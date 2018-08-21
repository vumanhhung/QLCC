import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class DichVuNuocEndpoint extends EndpointFactory {
    private readonly _dichvunuocUrl = "/api/DichVuNuocs";
    get dichvunuocUrl() { return this.configurations.baseUrl + this._dichvunuocUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.dichvunuocUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllDichVuNuoc<T>(): Observable<T> {
        return this.http.get(this.dichvunuocUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllDichVuNuoc());
            });
    }
    
    getDichVuNuocByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.dichvunuocUrl}/${Id}` : this.dichvunuocUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDichVuNuocByID(Id));
            });
    }
    
    addnewDichVuNuoc<T>(dichvunuocObject?: any): Observable<T> {
        let body = JSON.stringify(dichvunuocObject);
        return this.http.post(this.dichvunuocUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewDichVuNuoc(dichvunuocObject));
        });
    }
    
    updateDichVuNuoc<T>(id?: number, dichvunuocObject?: any): Observable<T> {
        let endpointUrl = `${this.dichvunuocUrl}/${id}`;
        let body = JSON.stringify(dichvunuocObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateDichVuNuoc(id, dichvunuocObject));
        });
    }
    
    deleteDichVuNuoc<T>(id: number): Observable<T> {
        let endpointUrl = `${this.dichvunuocUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteDichVuNuoc(id));
            });
    }
}