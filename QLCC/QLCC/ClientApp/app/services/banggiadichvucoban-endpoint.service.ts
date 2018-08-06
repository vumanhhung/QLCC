import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class BangGiaDichVuCoBanEndpoint extends EndpointFactory {
    private readonly _banggiadichvucobanUrl = "/api/BangGiaDichVuCoBans";
    get banggiadichvucobanUrl() { return this.configurations.baseUrl + this._banggiadichvucobanUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.banggiadichvucobanUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllBangGiaDichVuCoBan<T>(): Observable<T> {
        return this.http.get(this.banggiadichvucobanUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllBangGiaDichVuCoBan());
            });
    }
    
    getBangGiaDichVuCoBanByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.banggiadichvucobanUrl}/${Id}` : this.banggiadichvucobanUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getBangGiaDichVuCoBanByID(Id));
            });
    }
    
    addnewBangGiaDichVuCoBan<T>(banggiadichvucobanObject?: any): Observable<T> {
        let body = JSON.stringify(banggiadichvucobanObject);
        return this.http.post(this.banggiadichvucobanUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewBangGiaDichVuCoBan(banggiadichvucobanObject));
        });
    }
    
    updateBangGiaDichVuCoBan<T>(id?: number, banggiadichvucobanObject?: any): Observable<T> {
        let endpointUrl = `${this.banggiadichvucobanUrl}/${id}`;
        let body = JSON.stringify(banggiadichvucobanObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateBangGiaDichVuCoBan(id, banggiadichvucobanObject));
        });
    }
    
    deleteBangGiaDichVuCoBan<T>(id: number): Observable<T> {
        let endpointUrl = `${this.banggiadichvucobanUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteBangGiaDichVuCoBan(id));
            });
    }

    getBangGiaDichVuCoBanByLoaiDichVuID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.banggiadichvucobanUrl}/GetLoaiDichVu/${Id}` : this.banggiadichvucobanUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getBangGiaDichVuCoBanByLoaiDichVuID(Id));
            });
    }
}