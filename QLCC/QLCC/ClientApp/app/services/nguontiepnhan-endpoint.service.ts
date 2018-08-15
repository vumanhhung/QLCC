import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class NguonTiepNhanEndpoint extends EndpointFactory {
    private readonly _nguontiepnhanUrl = "/api/NguonTiepNhans";
    get nguontiepnhanUrl() { return this.configurations.baseUrl + this._nguontiepnhanUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.nguontiepnhanUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllNguonTiepNhan<T>(): Observable<T> {
        return this.http.get(this.nguontiepnhanUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllNguonTiepNhan());
            });
    }
    
    getNguonTiepNhanByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.nguontiepnhanUrl}/${Id}` : this.nguontiepnhanUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNguonTiepNhanByID(Id));
            });
    }
    
    addnewNguonTiepNhan<T>(nguontiepnhanObject?: any): Observable<T> {
        let body = JSON.stringify(nguontiepnhanObject);
        return this.http.post(this.nguontiepnhanUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewNguonTiepNhan(nguontiepnhanObject));
        });
    }
    
    updateNguonTiepNhan<T>(id?: number, nguontiepnhanObject?: any): Observable<T> {
        let endpointUrl = `${this.nguontiepnhanUrl}/${id}`;
        let body = JSON.stringify(nguontiepnhanObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateNguonTiepNhan(id, nguontiepnhanObject));
        });
    }
    
    deleteNguonTiepNhan<T>(id: number): Observable<T> {
        let endpointUrl = `${this.nguontiepnhanUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteNguonTiepNhan(id));
            });
    }
}