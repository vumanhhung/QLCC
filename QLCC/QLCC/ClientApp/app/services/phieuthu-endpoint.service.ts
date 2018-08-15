import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class PhieuThuEndpoint extends EndpointFactory {
    private readonly _phieuthuUrl = "/api/PhieuThus";
    get phieuthuUrl() { return this.configurations.baseUrl + this._phieuthuUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.phieuthuUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllPhieuThu<T>(): Observable<T> {
        return this.http.get(this.phieuthuUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllPhieuThu());
            });
    }
    
    getPhieuThuByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.phieuthuUrl}/${Id}` : this.phieuthuUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getPhieuThuByID(Id));
            });
    }
    
    addnewPhieuThu<T>(phieuthuObject?: any): Observable<T> {
        let body = JSON.stringify(phieuthuObject);
        return this.http.post(this.phieuthuUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewPhieuThu(phieuthuObject));
        });
    }
    
    updatePhieuThu<T>(id?: number, phieuthuObject?: any): Observable<T> {
        let endpointUrl = `${this.phieuthuUrl}/${id}`;
        let body = JSON.stringify(phieuthuObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updatePhieuThu(id, phieuthuObject));
        });
    }
    
    deletePhieuThu<T>(id: number): Observable<T> {
        let endpointUrl = `${this.phieuthuUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deletePhieuThu(id));
            });
    }
}