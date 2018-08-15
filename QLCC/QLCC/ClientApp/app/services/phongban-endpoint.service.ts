import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class PhongBanEndpoint extends EndpointFactory {
    private readonly _phongbanUrl = "/api/PhongBans";
    get phongbanUrl() { return this.configurations.baseUrl + this._phongbanUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.phongbanUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllPhongBan<T>(): Observable<T> {
        return this.http.get(this.phongbanUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllPhongBan());
            });
    }

    getPhongBanByToaNha<T>(toanhaId: number, cumtoanhId: number): Observable<T> {
        let endpointUrl = (toanhaId != 0 || toanhaId == 0 && cumtoanhId != 0) ? `${this.phongbanUrl}/getPhongBanByToaNha/${toanhaId}/${cumtoanhId}` : this.phongbanUrl;
        return this.http.get(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getPhongBanByToaNha(toanhaId, cumtoanhId));
            });
    }

    getPhongBanByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.phongbanUrl}/${Id}` : this.phongbanUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getPhongBanByID(Id));
            });
    }
    
    addnewPhongBan<T>(phongbanObject?: any): Observable<T> {
        let body = JSON.stringify(phongbanObject);
        return this.http.post(this.phongbanUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewPhongBan(phongbanObject));
        });
    }
    
    updatePhongBan<T>(id?: number, phongbanObject?: any): Observable<T> {
        let endpointUrl = `${this.phongbanUrl}/${id}`;
        let body = JSON.stringify(phongbanObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updatePhongBan(id, phongbanObject));
        });
    }
    
    deletePhongBan<T>(id: number): Observable<T> {
        let endpointUrl = `${this.phongbanUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deletePhongBan(id));
            });
    }
}