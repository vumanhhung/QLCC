import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class CumToaNhaEndpoint extends EndpointFactory {
    private readonly _cumtoanhaUrl = "/api/CumToaNhas";
    get cumtoanhaUrl() { return this.configurations.baseUrl + this._cumtoanhaUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getAllCumToaNha<T>(): Observable<T> {
        return this.http.get(this.cumtoanhaUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllCumToaNha());
            });
    }
    
    getCumToaNhaByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.cumtoanhaUrl}/${Id}` : this.cumtoanhaUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getCumToaNhaByID(Id));
            });
    }
    
    addnewCumToaNha<T>(cumtoanhaObject?: any): Observable<T> {
        let body = JSON.stringify(cumtoanhaObject);
        return this.http.post(this.cumtoanhaUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewCumToaNha(cumtoanhaObject));
        });
    }
    
    updateCumToaNha<T>(id?: number, cumtoanhaObject?: any): Observable<T> {
        let endpointUrl = `${this.cumtoanhaUrl}/${id}`;
        let body = JSON.stringify(cumtoanhaObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateCumToaNha(id, cumtoanhaObject));
        });
    }
    
    deleteCumToaNha<T>(id: number): Observable<T> {
        let endpointUrl = `${this.cumtoanhaUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteCumToaNha(id));
            });
    }
}