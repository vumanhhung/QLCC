import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class CuDanEndpoint extends EndpointFactory {
    private readonly _cudanUrl = "/api/CuDans";
    get cudanUrl() { return this.configurations.baseUrl + this._cudanUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.cudanUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }

    getChuHo<T>(): Observable<T> {
        let url = `${this.cudanUrl}/getChuHo`;
        return this.http.get(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getChuHo());
            });
    }
    
    getAllCuDan<T>(): Observable<T> {
        return this.http.get(this.cudanUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllCuDan());
            });
    }


    getCuDanByMatBang<T>(matbang: number[]): Observable<T> {
        let endpointUrl = (matbang.length > 0) ? `${this._cudanUrl}/getCuDanByMatBang` : `${this._cudanUrl}/GetAllData`;
        let body = matbang;
        return this.http.post<T>(endpointUrl,body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getCuDanByMatBang(matbang));
            });

    }


    getCuDanByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.cudanUrl}/${Id}` : this.cudanUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getCuDanByID(Id));
            });
    }
    
    addnewCuDan<T>(cudanObject?: any): Observable<T> {
        let body = JSON.stringify(cudanObject);
        return this.http.post(this.cudanUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewCuDan(cudanObject));
        });
    }
    
    updateCuDan<T>(id?: number, cudanObject?: any): Observable<T> {
        let endpointUrl = `${this.cudanUrl}/${id}`;
        let body = JSON.stringify(cudanObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateCuDan(id, cudanObject));
        });
    }
    
    deleteCuDan<T>(id: number): Observable<T> {
        let endpointUrl = `${this.cudanUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteCuDan(id));
            });
    }
}