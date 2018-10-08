import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class VatTuDiChuyenEndpoint extends EndpointFactory {
    private readonly _vattudichuyenUrl = "/api/VatTuDiChuyens";
    get vattudichuyenUrl() { return this.configurations.baseUrl + this._vattudichuyenUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.vattudichuyenUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllVatTuDiChuyen<T>(): Observable<T> {
        return this.http.get(this.vattudichuyenUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllVatTuDiChuyen());
            });
    }
    
    getVatTuDiChuyenByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.vattudichuyenUrl}/${Id}` : this.vattudichuyenUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getVatTuDiChuyenByID(Id));
            });
    }
    
    addnewVatTuDiChuyen<T>(vattudichuyenObject?: any): Observable<T> {
        let body = JSON.stringify(vattudichuyenObject);
        return this.http.post(this.vattudichuyenUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewVatTuDiChuyen(vattudichuyenObject));
        });
    }
    
    updateVatTuDiChuyen<T>(id?: number, vattudichuyenObject?: any): Observable<T> {
        let endpointUrl = `${this.vattudichuyenUrl}/${id}`;
        let body = JSON.stringify(vattudichuyenObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateVatTuDiChuyen(id, vattudichuyenObject));
        });
    }
    
    deleteVatTuDiChuyen<T>(id: number): Observable<T> {
        let endpointUrl = `${this.vattudichuyenUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteVatTuDiChuyen(id));
            });
    }
}