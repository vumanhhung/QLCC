import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class DinhMucNuocEndpoint extends EndpointFactory {
    private readonly _dinhmucnuocUrl = "/api/DinhMucNuocs";
    get dinhmucnuocUrl() { return this.configurations.baseUrl + this._dinhmucnuocUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.dinhmucnuocUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllDinhMucNuoc<T>(id?: number): Observable<T> {
        let enpointUrl = id ? `${this.dinhmucnuocUrl}/List/${id}` : this.dinhmucnuocUrl;
        return this.http.get(enpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllDinhMucNuoc());
            });
    }
    
    getDinhMucNuocByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.dinhmucnuocUrl}/${Id}` : this.dinhmucnuocUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDinhMucNuocByID(Id));
            });
    }
    
    addnewDinhMucNuoc<T>(dinhmucnuocObject?: any): Observable<T> {
        let body = JSON.stringify(dinhmucnuocObject);
        return this.http.post(this.dinhmucnuocUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewDinhMucNuoc(dinhmucnuocObject));
        });
    }
    
    updateDinhMucNuoc<T>(id?: number, dinhmucnuocObject?: any): Observable<T> {
        let endpointUrl = `${this.dinhmucnuocUrl}/${id}`;
        let body = JSON.stringify(dinhmucnuocObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateDinhMucNuoc(id, dinhmucnuocObject));
        });
    }
    
    deleteDinhMucNuoc<T>(id: number): Observable<T> {
        let endpointUrl = `${this.dinhmucnuocUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteDinhMucNuoc(id));
            });
    }

    getMax<T>(): Observable<T> {
        let endpointUrl = `${this.dinhmucnuocUrl}/Max`;
        return this.http.get(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getMax());
            })
    }
}