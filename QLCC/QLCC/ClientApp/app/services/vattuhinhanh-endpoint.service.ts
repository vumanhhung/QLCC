import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class VatTuHinhAnhEndpoint extends EndpointFactory {
    private readonly _vattuhinhanhUrl = "/api/VatTuHinhAnhs";
    get vattuhinhanhUrl() { return this.configurations.baseUrl + this._vattuhinhanhUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.vattuhinhanhUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllVatTuHinhAnh<T>(): Observable<T> {
        return this.http.get(this.vattuhinhanhUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllVatTuHinhAnh());
            });
    }
    
    getVatTuHinhAnhByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.vattuhinhanhUrl}/${Id}` : this.vattuhinhanhUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getVatTuHinhAnhByID(Id));
            });
    }

    addnewVatTuHinhAnh<T>(vattuhinhanhObject?: any): Observable<T> {
        let body = JSON.stringify(vattuhinhanhObject);
        return this.http.post(this.vattuhinhanhUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewVatTuHinhAnh(vattuhinhanhObject));
        });
    }
    
    updateVatTuHinhAnh<T>(id?: number, vattuhinhanhObject?: any): Observable<T> {
        let endpointUrl = `${this.vattuhinhanhUrl}/${id}`;
        let body = JSON.stringify(vattuhinhanhObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateVatTuHinhAnh(id, vattuhinhanhObject));
        });
    }
    
    deleteVatTuHinhAnh<T>(id: number): Observable<T> {
        let endpointUrl = `${this.vattuhinhanhUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteVatTuHinhAnh(id));
            });
    }

    deleteAllVatTuHinhAnh<T>(id: number): Observable<T> {
        let endpointUrl = `${this.vattuhinhanhUrl}/DelAll/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteAllVatTuHinhAnh(id));
            });
    }

    getCount<T>(id?: number): Observable<T> {
        let endpointUrl = `${this.vattuhinhanhUrl}/Count/${id}`;
        return this.http.get(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getCount(id));
            });
    }

    getFilter<T>(value?: number): Observable<T> {
        let endpointUrl = `${this.vattuhinhanhUrl}/Filter/${value}`;
        return this.http.get(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getFilter(value));
            });
    }
}