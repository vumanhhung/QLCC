import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class TrangThaiEndpoint extends EndpointFactory {
    private readonly _trangthaiUrl = "/api/TrangThais";
    get trangthaiUrl() { return this.configurations.baseUrl + this._trangthaiUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getAllTrangThai<T>(): Observable<T> {
        return this.http.get(this.trangthaiUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllTrangThai());
            });
    }
    
    getTrangThaiByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.trangthaiUrl}/${Id}` : this.trangthaiUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTrangThaiByID(Id));
            });
    }
    
    addnewTrangThai<T>(trangthaiObject?: any): Observable<T> {
        let body = JSON.stringify(trangthaiObject);
        return this.http.post(this.trangthaiUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewTrangThai(trangthaiObject));
        });
    }
    
    updateTrangThai<T>(id?: number, trangthaiObject?: any): Observable<T> {
        let endpointUrl = `${this.trangthaiUrl}/${id}`;
        let body = JSON.stringify(trangthaiObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateTrangThai(id, trangthaiObject));
        });
    }
    
    deleteTrangThai<T>(id: number): Observable<T> {
        let endpointUrl = `${this.trangthaiUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteTrangThai(id));
            });
    }
}