import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class NhaCungCapEndpoint extends EndpointFactory {
    private readonly _nhacungcapUrl = "/api/NhaCungCaps";
    get nhacungcapUrl() { return this.configurations.baseUrl + this._nhacungcapUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.nhacungcapUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllNhaCungCap<T>(): Observable<T> {
        return this.http.get(this.nhacungcapUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllNhaCungCap());
            });
    }
    
    getNhaCungCapByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.nhacungcapUrl}/${Id}` : this.nhacungcapUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNhaCungCapByID(Id));
            });
    }
    
    addnewNhaCungCap<T>(nhacungcapObject?: any): Observable<T> {
        let body = JSON.stringify(nhacungcapObject);
        return this.http.post(this.nhacungcapUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewNhaCungCap(nhacungcapObject));
        });
    }
    
    updateNhaCungCap<T>(id?: number, nhacungcapObject?: any): Observable<T> {
        let endpointUrl = `${this.nhacungcapUrl}/${id}`;
        let body = JSON.stringify(nhacungcapObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateNhaCungCap(id, nhacungcapObject));
        });
    }
    
    deleteNhaCungCap<T>(id: number): Observable<T> {
        let endpointUrl = `${this.nhacungcapUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteNhaCungCap(id));
            });
    }
}