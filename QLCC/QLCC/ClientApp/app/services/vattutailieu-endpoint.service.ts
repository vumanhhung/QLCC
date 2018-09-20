import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class VatTuTaiLieuEndpoint extends EndpointFactory {
    private readonly _vattutailieuUrl = "/api/VatTuTaiLieus";
    get vattutailieuUrl() { return this.configurations.baseUrl + this._vattutailieuUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.vattutailieuUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllVatTuTaiLieu<T>(): Observable<T> {
        return this.http.get(this.vattutailieuUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllVatTuTaiLieu());
            });
    }
    
    getVatTuTaiLieuByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.vattutailieuUrl}/${Id}` : this.vattutailieuUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getVatTuTaiLieuByID(Id));
            });
    }
    
    addnewVatTuTaiLieu<T>(vattutailieuObject?: any): Observable<T> {
        let body = JSON.stringify(vattutailieuObject);
        return this.http.post(this.vattutailieuUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewVatTuTaiLieu(vattutailieuObject));
        });
    }
    
    updateVatTuTaiLieu<T>(id?: number, vattutailieuObject?: any): Observable<T> {
        let endpointUrl = `${this.vattutailieuUrl}/${id}`;
        let body = JSON.stringify(vattutailieuObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateVatTuTaiLieu(id, vattutailieuObject));
        });
    }
    
    deleteVatTuTaiLieu<T>(id: number): Observable<T> {
        let endpointUrl = `${this.vattutailieuUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteVatTuTaiLieu(id));
            });
    }

    deleteAllVatTuTaiLieu<T>(id: number): Observable<T> {
        let endpointUrl = `${this.vattutailieuUrl}/DelAll/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteAllVatTuTaiLieu(id));
            });
    }

    getExist<T>(name?: string): Observable<T> {
        let endpointUrl = `${this.vattutailieuUrl}/CheckExist/${name}`;
        return this.http.get(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getExist(name));
            });
    }

    getFilter<T>(value?: number): Observable<T> {
        let endpointUrl = `${this.vattutailieuUrl}/Filter/${value}`;
        return this.http.get(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getFilter(value));
            });
    }
}