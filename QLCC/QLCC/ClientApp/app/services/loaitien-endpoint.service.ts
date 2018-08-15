import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class LoaiTienEndpoint extends EndpointFactory {
    private readonly _loaitienUrl = "/api/LoaiTiens";
    get loaitienUrl() { return this.configurations.baseUrl + this._loaitienUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.loaitienUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllLoaiTien<T>(): Observable<T> {
        return this.http.get(this.loaitienUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllLoaiTien());
            });
    }
    
    getLoaiTienByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.loaitienUrl}/${Id}` : this.loaitienUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLoaiTienByID(Id));
            });
    }
    
    addnewLoaiTien<T>(loaitienObject?: any): Observable<T> {
        let body = JSON.stringify(loaitienObject);
        return this.http.post(this.loaitienUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewLoaiTien(loaitienObject));
        });
    }
    
    updateLoaiTien<T>(id?: number, loaitienObject?: any): Observable<T> {
        let endpointUrl = `${this.loaitienUrl}/${id}`;
        let body = JSON.stringify(loaitienObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateLoaiTien(id, loaitienObject));
        });
    }
    
    deleteLoaiTien<T>(id: number): Observable<T> {
        let endpointUrl = `${this.loaitienUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteLoaiTien(id));
            });
    }
}