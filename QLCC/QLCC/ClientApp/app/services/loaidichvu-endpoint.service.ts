﻿import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class LoaiDichVuEndpoint extends EndpointFactory {
    private readonly _loaidichvuUrl = "/api/LoaiDichVus";
    get loaidichvuUrl() { return this.configurations.baseUrl + this._loaidichvuUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.loaidichvuUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllLoaiDichVu<T>(): Observable<T> {
        return this.http.get(this.loaidichvuUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllLoaiDichVu());
            });
    }
    
    getLoaiDichVuByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.loaidichvuUrl}/${Id}` : this.loaidichvuUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLoaiDichVuByID(Id));
            });
    }
    
    addnewLoaiDichVu<T>(loaidichvuObject?: any): Observable<T> {
        let body = JSON.stringify(loaidichvuObject);
        return this.http.post(this.loaidichvuUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewLoaiDichVu(loaidichvuObject));
        });
    }
    
    updateLoaiDichVu<T>(id?: number, loaidichvuObject?: any): Observable<T> {
        let endpointUrl = `${this.loaidichvuUrl}/${id}`;
        let body = JSON.stringify(loaidichvuObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateLoaiDichVu(id, loaidichvuObject));
        });
    }
    
    deleteLoaiDichVu<T>(id: number): Observable<T> {
        let endpointUrl = `${this.loaidichvuUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteLoaiDichVu(id));
            });
    }
}