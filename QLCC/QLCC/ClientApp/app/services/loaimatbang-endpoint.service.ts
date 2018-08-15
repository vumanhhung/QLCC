import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class LoaiMatBangEndpoint extends EndpointFactory {
    private readonly _loaimatbangUrl = "/api/LoaiMatBangs";
    get loaimatbangUrl() { return this.configurations.baseUrl + this._loaimatbangUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.loaimatbangUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllLoaiMatBang<T>(): Observable<T> {
        return this.http.get(this.loaimatbangUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllLoaiMatBang());
            });
    }
    
    getLoaiMatBangByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.loaimatbangUrl}/${Id}` : this.loaimatbangUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLoaiMatBangByID(Id));
            });
    }
    
    addnewLoaiMatBang<T>(loaimatbangObject?: any): Observable<T> {
        let body = JSON.stringify(loaimatbangObject);
        return this.http.post(this.loaimatbangUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewLoaiMatBang(loaimatbangObject));
        });
    }
    
    updateLoaiMatBang<T>(id?: number, loaimatbangObject?: any): Observable<T> {
        let endpointUrl = `${this.loaimatbangUrl}/${id}`;
        let body = JSON.stringify(loaimatbangObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateLoaiMatBang(id, loaimatbangObject));
        });
    }
    
    deleteLoaiMatBang<T>(id: number): Observable<T> {
        let endpointUrl = `${this.loaimatbangUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteLoaiMatBang(id));
            });
    }
}