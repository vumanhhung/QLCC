import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class LoaiGiaThueEndpoint extends EndpointFactory {
    private readonly _loaigiathueUrl = "/api/LoaiGiaThues";
    get loaigiathueUrl() { return this.configurations.baseUrl + this._loaigiathueUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.loaigiathueUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllLoaiGiaThue<T>(): Observable<T> {
        return this.http.get(this.loaigiathueUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllLoaiGiaThue());
            });
    }

    getLoaiGiaThueByLoaiTien<T>(loaitien: number): Observable<T> {
        let endpointUrl = loaitien != 0 ? `${this.loaigiathueUrl}/getLoaiGiaThueByLoaiTien/${loaitien}` : this.loaigiathueUrl;
        return this.http.get(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLoaiGiaThueByLoaiTien(loaitien));
            });
    }

    getLoaiGiaThueByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.loaigiathueUrl}/${Id}` : this.loaigiathueUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLoaiGiaThueByID(Id));
            });
    }
    
    addnewLoaiGiaThue<T>(loaigiathueObject?: any): Observable<T> {
        let body = JSON.stringify(loaigiathueObject);
        return this.http.post(this.loaigiathueUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewLoaiGiaThue(loaigiathueObject));
        });
    }
    
    updateLoaiGiaThue<T>(id?: number, loaigiathueObject?: any): Observable<T> {
        let endpointUrl = `${this.loaigiathueUrl}/${id}`;
        let body = JSON.stringify(loaigiathueObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateLoaiGiaThue(id, loaigiathueObject));
        });
    }
    
    deleteLoaiGiaThue<T>(id: number): Observable<T> {
        let endpointUrl = `${this.loaigiathueUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteLoaiGiaThue(id));
            });
    }
}