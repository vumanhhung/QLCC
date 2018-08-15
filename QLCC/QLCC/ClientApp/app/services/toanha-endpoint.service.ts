import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ToaNhaEndpoint extends EndpointFactory {
    private readonly _toanhaUrl = "/api/ToaNhas";
    get toanhaUrl() { return this.configurations.baseUrl + this._toanhaUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    getAllToaNha<T>(): Observable<T> {
        return this.http.get(this.toanhaUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllToaNha());
            });
    }

    getToaNhaByCum<T>(cumToaNhaId: number): Observable<T> {        
        let endpointUrl = cumToaNhaId != 0 ? `${this.toanhaUrl}/getToaNhaByCum/${cumToaNhaId}` : this.toanhaUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getToaNhaByCum(cumToaNhaId));
            });
    }

    getToaNhaByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.toanhaUrl}/${Id}` : this.toanhaUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getToaNhaByID(Id));
            });
    }

    addnewToaNha<T>(toanhaObject?: any): Observable<T> {
        let body = JSON.stringify(toanhaObject);
        return this.http.post(this.toanhaUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewToaNha(toanhaObject));
        });
    }

    updateToaNha<T>(id?: number, toanhaObject?: any): Observable<T> {
        let endpointUrl = `${this.toanhaUrl}/${id}`;
        let body = JSON.stringify(toanhaObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateToaNha(id, toanhaObject));
        });
    }

    deleteToaNha<T>(id: number): Observable<T> {
        let endpointUrl = `${this.toanhaUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteToaNha(id));
            });
    }
}