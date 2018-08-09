import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class TheXeEndpoint extends EndpointFactory {
    private readonly _thexeUrl = "/api/TheXes";
    get thexeUrl() { return this.configurations.baseUrl + this._thexeUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.thexeUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }

    getAllTheXe<T>(): Observable<T> {
        return this.http.get(this.thexeUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllTheXe());
            });
    }

    getTheXeByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.thexeUrl}/${Id}` : this.thexeUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTheXeByID(Id));
            });
    }

    addnewTheXe<T>(thexeObject?: any): Observable<T> {
        let body = JSON.stringify(thexeObject);
        return this.http.post(this.thexeUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewTheXe(thexeObject));
        });
    }

    updateTheXe<T>(id?: number, thexeObject?: any): Observable<T> {
        let endpointUrl = `${this.thexeUrl}/${id}`;
        let body = JSON.stringify(thexeObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateTheXe(id, thexeObject));
        });
    }

    updateTheXes<T>(thexeObject?: any): Observable<T> {
        let endpointUrl = `${this.thexeUrl}/updatelist`;
        let body = JSON.stringify(thexeObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateTheXes(thexeObject));
        });
    }

    deleteTheXes<T>(thexes?: any): Observable<T> {
        let endpointUrl = `${this.thexeUrl}/deletelist`;
        let body = JSON.stringify(thexes);
        return this.http.put(endpointUrl, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteTheXes(thexes));
            });
    }

    deleteTheXe<T>(id: number): Observable<T> {
        let endpointUrl = `${this.thexeUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteTheXe(id));
            });
    }
}