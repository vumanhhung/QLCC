import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class LoaiXeEndpoint extends EndpointFactory {
    private readonly _loadxeURl = "api/LoaiXes";
    get loadxeURL() {
        return this.configurations.baseUrl + this._loadxeURl;
    }

    constructor(http: HttpClient, configuration: ConfigurationService, injector: Injector) {
        super(http, configuration, injector);
    }

    getItem<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.loadxeURL}/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItem(start, count, whereClause, orderBy));
            })
    }

    getAllLoaixe<T>(): Observable<T> {
        return this.http.get(this.loadxeURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllLoaixe());
            })
    }

    getLoaiXeByID<T>(Id?: number) {
        let urlGet = Id ? `${this.loadxeURL}/${Id}` : this.loadxeURL;
        return this.http.get(urlGet, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLoaiXeByID(Id));
            })
    }

    addnewLoaiXe<T>(loaixeObject?: any) {
        let body = JSON.stringify(loaixeObject);
        return this.http.post(this.loadxeURL, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.addnewLoaiXe(loaixeObject));
            })
    }

    updateLoaiXe<T>(Id?: number, loaixeObject?: any) {
        let urlPut = Id ? `${this.loadxeURL}/${Id}` : this.loadxeURL;
        let body = JSON.stringify(loaixeObject);
        return this.http.put(urlPut, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.updateLoaiXe(Id, loaixeObject));
            })
    }

    deleteLoaiXe<T>(Id?: number) {
        let urlDel = Id ? `${this.loadxeURL}/${Id}` : this.loadxeURL;
        return this.http.delete(urlDel, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteLoaiXe(Id));

            })
    }
}