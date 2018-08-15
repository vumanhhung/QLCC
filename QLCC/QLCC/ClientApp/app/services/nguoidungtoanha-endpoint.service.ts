import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class NguoiDungToaNhaEndpoint extends EndpointFactory {
    private readonly _nguoidungtoanhaUrl = "/api/NguoiDungToaNhas";
    get nguoidungtoanhaUrl() { return this.configurations.baseUrl + this._nguoidungtoanhaUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.nguoidungtoanhaUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllNguoiDungToaNha<T>(): Observable<T> {
        return this.http.get(this.nguoidungtoanhaUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllNguoiDungToaNha());
            });
    }
    
    getNguoiDungToaNhaByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.nguoidungtoanhaUrl}/${Id}` : this.nguoidungtoanhaUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNguoiDungToaNhaByID(Id));
            });
    }
    
    addnewNguoiDungToaNha<T>(nguoidungtoanhaObject?: any): Observable<T> {
        let body = JSON.stringify(nguoidungtoanhaObject);
        return this.http.post(this.nguoidungtoanhaUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewNguoiDungToaNha(nguoidungtoanhaObject));
        });
    }
    
    updateNguoiDungToaNha<T>(id?: number, nguoidungtoanhaObject?: any): Observable<T> {
        let endpointUrl = `${this.nguoidungtoanhaUrl}/${id}`;
        let body = JSON.stringify(nguoidungtoanhaObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateNguoiDungToaNha(id, nguoidungtoanhaObject));
        });
    }
    
    deleteNguoiDungToaNha<T>(id: number): Observable<T> {
        let endpointUrl = `${this.nguoidungtoanhaUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteNguoiDungToaNha(id));
            });
    }
}