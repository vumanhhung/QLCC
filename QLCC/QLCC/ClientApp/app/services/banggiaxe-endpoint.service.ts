import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class BangGiaXeEndpoint extends EndpointFactory {
    private readonly _banggiaxeUrl = "/api/BangGiaXes";
    get banggiaxeUrl() { return this.configurations.baseUrl + this._banggiaxeUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.banggiaxeUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllBangGiaXe<T>(): Observable<T> {
        return this.http.get(this.banggiaxeUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllBangGiaXe());
            });
    }
    
    getBangGiaXeByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.banggiaxeUrl}/${Id}` : this.banggiaxeUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getBangGiaXeByID(Id));
            });
    }
    
    addnewBangGiaXe<T>(banggiaxeObject?: any): Observable<T> {
        let body = JSON.stringify(banggiaxeObject);
        return this.http.post(this.banggiaxeUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewBangGiaXe(banggiaxeObject));
        });
    }
    
    updateBangGiaXe<T>(id?: number, banggiaxeObject?: any): Observable<T> {
        let endpointUrl = `${this.banggiaxeUrl}/${id}`;
        let body = JSON.stringify(banggiaxeObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateBangGiaXe(id, banggiaxeObject));
        });
    }
    
    deleteBangGiaXe<T>(id: number): Observable<T> {
        let endpointUrl = `${this.banggiaxeUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteBangGiaXe(id));
            });
    }
}