import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ChucVuEndpoint extends EndpointFactory {
    private readonly _chucvuUrl = "/api/ChucVus";
    get chucvuUrl() { return this.configurations.baseUrl + this._chucvuUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.chucvuUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllChucVu<T>(): Observable<T> {
        return this.http.get(this.chucvuUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllChucVu());
            });
    }
    
    getChucVuByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.chucvuUrl}/${Id}` : this.chucvuUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getChucVuByID(Id));
            });
    }
    
    addnewChucVu<T>(chucvuObject?: any): Observable<T> {
        let body = JSON.stringify(chucvuObject);
        return this.http.post(this.chucvuUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewChucVu(chucvuObject));
        });
    }
    
    updateChucVu<T>(id?: number, chucvuObject?: any): Observable<T> {
        let endpointUrl = `${this.chucvuUrl}/${id}`;
        let body = JSON.stringify(chucvuObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateChucVu(id, chucvuObject));
        });
    }
    
    deleteChucVu<T>(id: number): Observable<T> {
        let endpointUrl = `${this.chucvuUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteChucVu(id));
            });
    }
}