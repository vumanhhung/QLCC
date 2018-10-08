import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class VatTuPhieuDiChuyenEndpoint extends EndpointFactory {
    private readonly _vattuphieudichuyenUrl = "/api/VatTuPhieuDiChuyens";
    get vattuphieudichuyenUrl() { return this.configurations.baseUrl + this._vattuphieudichuyenUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.vattuphieudichuyenUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllVatTuPhieuDiChuyen<T>(): Observable<T> {
        return this.http.get(this.vattuphieudichuyenUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllVatTuPhieuDiChuyen());
            });
    }
    
    getVatTuPhieuDiChuyenByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.vattuphieudichuyenUrl}/${Id}` : this.vattuphieudichuyenUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getVatTuPhieuDiChuyenByID(Id));
            });
    }
    
    addnewVatTuPhieuDiChuyen<T>(vattuphieudichuyenObject?: any): Observable<T> {
        let body = JSON.stringify(vattuphieudichuyenObject);
        return this.http.post(this.vattuphieudichuyenUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewVatTuPhieuDiChuyen(vattuphieudichuyenObject));
        });
    }
    
    updateVatTuPhieuDiChuyen<T>(id?: number, vattuphieudichuyenObject?: any): Observable<T> {
        let endpointUrl = `${this.vattuphieudichuyenUrl}/${id}`;
        let body = JSON.stringify(vattuphieudichuyenObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateVatTuPhieuDiChuyen(id, vattuphieudichuyenObject));
        });
    }
    
    deleteVatTuPhieuDiChuyen<T>(id: number): Observable<T> {
        let endpointUrl = `${this.vattuphieudichuyenUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteVatTuPhieuDiChuyen(id));
            });
    }
}