import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class HopDongEndpoint extends EndpointFactory {
    private readonly _hopdongUrl = "/api/HopDongs";
    get hopdongUrl() { return this.configurations.baseUrl + this._hopdongUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.hopdongUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllHopDong<T>(): Observable<T> {
        return this.http.get(this.hopdongUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllHopDong());
            });
    }
    
    getHopDongByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.hopdongUrl}/${Id}` : this.hopdongUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHopDongByID(Id));
            });
    }
    
    addnewHopDong<T>(hopdongObject?: any): Observable<T> {
        let body = JSON.stringify(hopdongObject);
        return this.http.post(this.hopdongUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewHopDong(hopdongObject));
        });
    }
    
    updateHopDong<T>(id?: number, hopdongObject?: any): Observable<T> {
        let endpointUrl = `${this.hopdongUrl}/${id}`;
        let body = JSON.stringify(hopdongObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateHopDong(id, hopdongObject));
        });
    }
    
    deleteHopDong<T>(id: number): Observable<T> {
        let endpointUrl = `${this.hopdongUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteHopDong(id));
            });
    }
}