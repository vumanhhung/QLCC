import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class LoaiHangEndpoint extends EndpointFactory {
    private readonly _loaihangUrl = "/api/LoaiHangs";
    get loaihangUrl() { return this.configurations.baseUrl + this._loaihangUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.loaihangUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllLoaiHang<T>(): Observable<T> {
        return this.http.get(this.loaihangUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllLoaiHang());
            });
    }
    
    getLoaiHangByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.loaihangUrl}/${Id}` : this.loaihangUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLoaiHangByID(Id));
            });
    }
    
    addnewLoaiHang<T>(loaihangObject?: any): Observable<T> {
        let body = JSON.stringify(loaihangObject);
        return this.http.post(this.loaihangUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewLoaiHang(loaihangObject));
        });
    }
    
    updateLoaiHang<T>(id?: number, loaihangObject?: any): Observable<T> {
        let endpointUrl = `${this.loaihangUrl}/${id}`;
        let body = JSON.stringify(loaihangObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateLoaiHang(id, loaihangObject));
        });
    }
    
    deleteLoaiHang<T>(id: number): Observable<T> {
        let endpointUrl = `${this.loaihangUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteLoaiHang(id));
            });
    }

    getFilterStatus<T>(status?: boolean): Observable<T> {
        let endpointUrl = `${this.loaihangUrl}/FilterStatus/${status}`;
        return this.http.get(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getFilterStatus(status));
            })
    }
}