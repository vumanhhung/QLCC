import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class VatTuPhieuYeuCauEndpoint extends EndpointFactory {
    private readonly _vattuphieuyeucauUrl = "/api/VatTuPhieuYeuCaus";
    get vattuphieuyeucauUrl() { return this.configurations.baseUrl + this._vattuphieuyeucauUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.vattuphieuyeucauUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllVatTuPhieuYeuCau<T>(): Observable<T> {
        return this.http.get(this.vattuphieuyeucauUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllVatTuPhieuYeuCau());
            });
    }
    
    getVatTuPhieuYeuCauByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.vattuphieuyeucauUrl}/${Id}` : this.vattuphieuyeucauUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getVatTuPhieuYeuCauByID(Id));
            });
    }
    
    addnewVatTuPhieuYeuCau<T>(vattuphieuyeucauObject?: any): Observable<T> {
        let body = JSON.stringify(vattuphieuyeucauObject);
        return this.http.post(this.vattuphieuyeucauUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewVatTuPhieuYeuCau(vattuphieuyeucauObject));
        });
    }
    
    updateVatTuPhieuYeuCau<T>(id?: number, vattuphieuyeucauObject?: any): Observable<T> {
        let endpointUrl = `${this.vattuphieuyeucauUrl}/${id}`;
        let body = JSON.stringify(vattuphieuyeucauObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateVatTuPhieuYeuCau(id, vattuphieuyeucauObject));
        });
    }
    
    deleteVatTuPhieuYeuCau<T>(id: number): Observable<T> {
        let endpointUrl = `${this.vattuphieuyeucauUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteVatTuPhieuYeuCau(id));
            });
    }
}