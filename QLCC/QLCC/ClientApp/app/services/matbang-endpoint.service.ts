import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class MatBangEndpoint extends EndpointFactory {
    private readonly _matbangUrl = "/api/MatBangs";
    get matbangUrl() { return this.configurations.baseUrl + this._matbangUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getAllMatBang<T>(): Observable<T> {
        return this.http.get(this.matbangUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllMatBang());
            });
    }

    getMatBangByToaNha<T>(TangLauId: number, ToaNhaId: number, CumToaNhaId: number): Observable<T> {
        let endpointUrl = (TangLauId != 0 || TangLauId == 0 && ToaNhaId != 0 || TangLauId == 0 && ToaNhaId == 0 && CumToaNhaId != 0) ?`${this._matbangUrl}/getMatBangByToaNha/${TangLauId}/${ToaNhaId}/${CumToaNhaId}` : this._matbangUrl;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getMatBangByToaNha(TangLauId, ToaNhaId, CumToaNhaId));
            });

    }

    getMatBangByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.matbangUrl}/${Id}` : this.matbangUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getMatBangByID(Id));
            });
    }
    
    addnewMatBang<T>(matbangObject?: any): Observable<T> {
        let body = JSON.stringify(matbangObject);
        return this.http.post(this.matbangUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewMatBang(matbangObject));
        });
    }

    importMatBang<T>(matbangObject?: any, cumToaNha?: number, toanNha?: number,tangLau?:number): Observable<T> {
        let body = JSON.stringify(matbangObject);
        let endpointURL = `${this._matbangUrl}/importMatBang/${cumToaNha}/${toanNha}/${tangLau}`;
        return this.http.post(endpointURL, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.importMatBang(matbangObject));
        });
    }

    updateMatBang<T>(id?: number, matbangObject?: any): Observable<T> {
        let endpointUrl = `${this.matbangUrl}/${id}`;
        let body = JSON.stringify(matbangObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateMatBang(id, matbangObject));
        });
    }
    
    deleteMatBang<T>(id: number): Observable<T> {
        let endpointUrl = `${this.matbangUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteMatBang(id));
            });
    }
}