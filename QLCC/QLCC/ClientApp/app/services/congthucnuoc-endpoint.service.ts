import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class CongThucNuocEndpoint extends EndpointFactory {
    private readonly _congthucnuocUrl = "/api/CongThucNuocs";
    get congthucnuocUrl() { return this.configurations.baseUrl + this._congthucnuocUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.congthucnuocUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllCongThucNuoc<T>(): Observable<T> {
        return this.http.get(this.congthucnuocUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllCongThucNuoc());
            });
    }
    
    getCongThucNuocByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.congthucnuocUrl}/${Id}` : this.congthucnuocUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getCongThucNuocByID(Id));
            });
    }
    
    addnewCongThucNuoc<T>(congthucnuocObject?: any): Observable<T> {
        let body = JSON.stringify(congthucnuocObject);
        return this.http.post(this.congthucnuocUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewCongThucNuoc(congthucnuocObject));
        });
    }
    
    updateCongThucNuoc<T>(id?: number, congthucnuocObject?: any): Observable<T> {
        let endpointUrl = `${this.congthucnuocUrl}/${id}`;
        let body = JSON.stringify(congthucnuocObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateCongThucNuoc(id, congthucnuocObject));
        });
    }
    
    deleteCongThucNuoc<T>(id: number): Observable<T> {
        let endpointUrl = `${this.congthucnuocUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteCongThucNuoc(id));
            });
    }

    changeStatus<T>(id: number): Observable<T> {
        let endpointUrl = `${this.congthucnuocUrl}/ChangeStatus/${id}`;
        return this.http.put(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.changeStatus(id));
            });
    }

    checkstatus<T>(): Observable<T> {
        let endpointUrl = `${this.congthucnuocUrl}/CheckStatus`;
        return this.http.get(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.checkstatus());
            });
    }
}