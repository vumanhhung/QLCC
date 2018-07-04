import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class KhuVucEndpoint extends EndpointFactory {
    private readonly _khuvucUrl = "/api/KhuVucs";
    get khuvucUrl() { return this.configurations.baseUrl + this._khuvucUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.khuvucUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllKhuVuc<T>(): Observable<T> {
        return this.http.get(this.khuvucUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllKhuVuc());
            });
    }
    
    getKhuVucByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.khuvucUrl}/${Id}` : this.khuvucUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getKhuVucByID(Id));
            });
    }
    
    addnewKhuVuc<T>(khuvucObject?: any): Observable<T> {
        let body = JSON.stringify(khuvucObject);
        return this.http.post(this.khuvucUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewKhuVuc(khuvucObject));
        });
    }
    
    updateKhuVuc<T>(id?: number, khuvucObject?: any): Observable<T> {
        let endpointUrl = `${this.khuvucUrl}/${id}`;
        let body = JSON.stringify(khuvucObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateKhuVuc(id, khuvucObject));
        });
    }
    
    deleteKhuVuc<T>(id: number): Observable<T> {
        let endpointUrl = `${this.khuvucUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteKhuVuc(id));
            });
    }
}