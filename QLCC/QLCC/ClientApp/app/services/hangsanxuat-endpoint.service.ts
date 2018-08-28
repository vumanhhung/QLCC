import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class HangSanXuatEndpoint extends EndpointFactory {
    private readonly _hangsanxuatUrl = "/api/HangSanXuats";
    get hangsanxuatUrl() { return this.configurations.baseUrl + this._hangsanxuatUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.hangsanxuatUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllHangSanXuat<T>(): Observable<T> {
        return this.http.get(this.hangsanxuatUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllHangSanXuat());
            });
    }
    
    getHangSanXuatByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.hangsanxuatUrl}/${Id}` : this.hangsanxuatUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHangSanXuatByID(Id));
            });
    }
    
    addnewHangSanXuat<T>(hangsanxuatObject?: any): Observable<T> {
        let body = JSON.stringify(hangsanxuatObject);
        return this.http.post(this.hangsanxuatUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewHangSanXuat(hangsanxuatObject));
        });
    }
    
    updateHangSanXuat<T>(id?: number, hangsanxuatObject?: any): Observable<T> {
        let endpointUrl = `${this.hangsanxuatUrl}/${id}`;
        let body = JSON.stringify(hangsanxuatObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateHangSanXuat(id, hangsanxuatObject));
        });
    }
    
    deleteHangSanXuat<T>(id: number): Observable<T> {
        let endpointUrl = `${this.hangsanxuatUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteHangSanXuat(id));
            });
    }

    getFilterStatus<T>(status?: boolean): Observable<T> {
        let endpointUrl = `${this.hangsanxuatUrl}/FilterStatus/${status}`;
        return this.http.get(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getFilterStatus(status));
            })
    }
}