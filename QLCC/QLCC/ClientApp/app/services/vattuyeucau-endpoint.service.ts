import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class VatTuYeuCauEndpoint extends EndpointFactory {
    private readonly _vattuyeucauUrl = "/api/VatTuYeuCaus";
    get vattuyeucauUrl() { return this.configurations.baseUrl + this._vattuyeucauUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.vattuyeucauUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllVatTuYeuCau<T>(): Observable<T> {
        return this.http.get(this.vattuyeucauUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllVatTuYeuCau());
            });
    }
    
    getVatTuYeuCauByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.vattuyeucauUrl}/${Id}` : this.vattuyeucauUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getVatTuYeuCauByID(Id));
            });
    }
    
    addnewVatTuYeuCau<T>(vattuyeucauObject?: any): Observable<T> {
        let body = JSON.stringify(vattuyeucauObject);
        return this.http.post(this.vattuyeucauUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewVatTuYeuCau(vattuyeucauObject));
        });
    }
    
    updateVatTuYeuCau<T>(id?: number, vattuyeucauObject?: any): Observable<T> {
        let endpointUrl = `${this.vattuyeucauUrl}/${id}`;
        let body = JSON.stringify(vattuyeucauObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateVatTuYeuCau(id, vattuyeucauObject));
        });
    }
    
    deleteVatTuYeuCau<T>(id: number): Observable<T> {
        let endpointUrl = `${this.vattuyeucauUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteVatTuYeuCau(id));
            });
    }
}