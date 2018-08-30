import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class VatTuEndpoint extends EndpointFactory {
    private readonly _vattuUrl = "/api/VatTus";
    get vattuUrl() { return this.configurations.baseUrl + this._vattuUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.vattuUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllVatTu<T>(): Observable<T> {
        return this.http.get(this.vattuUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllVatTu());
            });
    }
    
    getVatTuByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.vattuUrl}/${Id}` : this.vattuUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getVatTuByID(Id));
            });
    }
    
    addnewVatTu<T>(vattuObject?: any): Observable<T> {
        let body = JSON.stringify(vattuObject);
        return this.http.post(this.vattuUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewVatTu(vattuObject));
        });
    }
    
    updateVatTu<T>(id?: number, vattuObject?: any): Observable<T> {
        let endpointUrl = `${this.vattuUrl}/${id}`;
        let body = JSON.stringify(vattuObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateVatTu(id, vattuObject));
        });
    }
    
    deleteVatTu<T>(id: number): Observable<T> {
        let endpointUrl = `${this.vattuUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteVatTu(id));
            });
    }

    getLastRecord<T>(): Observable<T> {
        let endpointUrl = `${this.vattuUrl}/LastRecord`;
        return this.http.get(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLastRecord());
            });
    }

    //getLoaiHang<T>(): Observable<T> {
    //    let endpointUrl = `${this.vattuUrl}/GetLoaiHang`;
    //    return this.http.get(endpointUrl, this.getRequestHeaders())
    //        .catch(error => {
    //            return this.handleError(error, () => this.getLoaiHang());
    //        });
    //}

    //getHangSX<T>(): Observable<T> {
    //    let endpointUrl = `${this.vattuUrl}/GetHangSX`;
    //    return this.http.get(endpointUrl, this.getRequestHeaders())
    //        .catch(error => {
    //            return this.handleError(error, () => this.getHangSX());
    //        });
    //}
}