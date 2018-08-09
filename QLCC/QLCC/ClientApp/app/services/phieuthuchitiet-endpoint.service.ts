import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class PhieuThuChiTietEndpoint extends EndpointFactory {
    private readonly _phieuthuchitietUrl = "/api/PhieuThuChiTiets";
    get phieuthuchitietUrl() { return this.configurations.baseUrl + this._phieuthuchitietUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.phieuthuchitietUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllPhieuThuChiTiet<T>(): Observable<T> {
        return this.http.get(this.phieuthuchitietUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllPhieuThuChiTiet());
            });
    }
    
    getPhieuThuChiTietByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.phieuthuchitietUrl}/${Id}` : this.phieuthuchitietUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getPhieuThuChiTietByID(Id));
            });
    }
    
    addnewPhieuThuChiTiet<T>(phieuthuchitietObject?: any): Observable<T> {
        let body = JSON.stringify(phieuthuchitietObject);
        return this.http.post(this.phieuthuchitietUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewPhieuThuChiTiet(phieuthuchitietObject));
        });
    }

    addnewPhieuThuChiTiets<T>(phieuthuchitietObject?: any): Observable<T> {
        let body = JSON.stringify(phieuthuchitietObject);
        return this.http.post(this.phieuthuchitietUrl+"/addlist", body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewPhieuThuChiTiets(phieuthuchitietObject));
        });
    }
    
    updatePhieuThuChiTiet<T>(id?: number, phieuthuchitietObject?: any): Observable<T> {
        let endpointUrl = `${this.phieuthuchitietUrl}/${id}`;
        let body = JSON.stringify(phieuthuchitietObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updatePhieuThuChiTiet(id, phieuthuchitietObject));
        });
    }
    
    deletePhieuThuChiTiet<T>(id: number): Observable<T> {
        let endpointUrl = `${this.phieuthuchitietUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deletePhieuThuChiTiet(id));
            });
    }
}