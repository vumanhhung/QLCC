import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class DichVuCoBanEndpoint extends EndpointFactory {
    private readonly _dichvucobanUrl = "/api/DichVuCoBans";
    get dichvucobanUrl() { return this.configurations.baseUrl + this._dichvucobanUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.dichvucobanUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllDichVuCoBan<T>(): Observable<T> {
        return this.http.get(this.dichvucobanUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllDichVuCoBan());
            });
    }
    
    getDichVuCoBanByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.dichvucobanUrl}/${Id}` : this.dichvucobanUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDichVuCoBanByID(Id));
            });
    }
    
    addnewDichVuCoBan<T>(dichvucobanObject?: any): Observable<T> {
        let body = JSON.stringify(dichvucobanObject);
        return this.http.post(this.dichvucobanUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewDichVuCoBan(dichvucobanObject));
        });
    }
    
    updateDichVuCoBan<T>(id?: number, dichvucobanObject?: any): Observable<T> {
        let endpointUrl = `${this.dichvucobanUrl}/${id}`;
        let body = JSON.stringify(dichvucobanObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateDichVuCoBan(id, dichvucobanObject));
        });
    }
    
    deleteDichVuCoBan<T>(id: number): Observable<T> {
        let endpointUrl = `${this.dichvucobanUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteDichVuCoBan(id));
            });
    }

    checkExpire<T>(): Observable<T> {
        let endpointUrl = `${this.dichvucobanUrl}/CheckExpire/`;
        return this.http.get(endpointUrl, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.checkExpire());
        });
    }

    importDVCB<T>(dichvucobanObject?: any, khachHangId?: number, matBangId?: number, loaiDichVuId?: number, donViTinhId?: number, loaiTienId?: number): Observable<T> {
        let body = JSON.stringify(dichvucobanObject);
        let endpointUrl = `${this.dichvucobanUrl}/importDichVuCoBan/${khachHangId}/${matBangId}/${loaiDichVuId}/${donViTinhId}/${loaiTienId}`;
        return this.http.post(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.importDVCB(dichvucobanObject));
        });
    }
}