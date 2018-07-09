import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class LoaiXeEndpoint extends EndpointFactory {
    private readonly _loaixeUrl = "/api/LoaiXes";
    get loaixeUrl() { return this.configurations.baseUrl + this._loaixeUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.loaixeUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }

    getAllLoaiXe<T>(): Observable<T> {
        return this.http.get(this.loaixeUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllLoaiXe());
            });
    }

    getLoaiXeByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.loaixeUrl}/${Id}` : this.loaixeUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLoaiXeByID(Id));
            });
    }

    addnewLoaiXe<T>(loaixeObject?: any): Observable<T> {
        let body = JSON.stringify(loaixeObject);
        return this.http.post(this.loaixeUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewLoaiXe(loaixeObject));
        });
    }

    updateLoaiXe<T>(id?: number, loaixeObject?: any): Observable<T> {
        let endpointUrl = `${this.loaixeUrl}/${id}`;
        let body = JSON.stringify(loaixeObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateLoaiXe(id, loaixeObject));
        });
    }

    deleteLoaiXe<T>(id: number): Observable<T> {
        let endpointUrl = `${this.loaixeUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteLoaiXe(id));
            });
    }

    getName<T>(loaixeObject?: any): Observable<T> {
        let url = `${this.loaixeUrl}/GetName`
        return this.http.get(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getName(loaixeObject));
            });
    }
}