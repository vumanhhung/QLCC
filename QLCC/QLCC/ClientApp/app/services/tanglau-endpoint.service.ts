import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class TangLauEndpoint extends EndpointFactory {
    private readonly _tanglauUrl = "/api/TangLaus";
    get tanglauUrl() { return this.configurations.baseUrl + this._tanglauUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getAllTangLau<T>(): Observable<T> {
        return this.http.get(this.tanglauUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllTangLau());
            });
    }

    getTangLauByToaNha<T>(toaNhaId: number, cumToaNhaId: number): Observable<T> {
        let endpointUrl = (toaNhaId != 0 || toaNhaId == 0 && cumToaNhaId != 0) ? `${this.tanglauUrl}/getTangLauByToaNha/${toaNhaId}/${cumToaNhaId}` : this.tanglauUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTangLauByToaNha(toaNhaId,cumToaNhaId));
            });
    }
    
    getTangLauByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.tanglauUrl}/${Id}` : this.tanglauUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTangLauByID(Id));
            });
    }
    
    addnewTangLau<T>(tanglauObject?: any): Observable<T> {
        let body = JSON.stringify(tanglauObject);
        return this.http.post(this.tanglauUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewTangLau(tanglauObject));
        });
    }
    
    updateTangLau<T>(id?: number, tanglauObject?: any): Observable<T> {
        let endpointUrl = `${this.tanglauUrl}/${id}`;
        let body = JSON.stringify(tanglauObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateTangLau(id, tanglauObject));
        });
    }
    
    deleteTangLau<T>(id: number): Observable<T> {
        let endpointUrl = `${this.tanglauUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteTangLau(id));
            });
    }
}