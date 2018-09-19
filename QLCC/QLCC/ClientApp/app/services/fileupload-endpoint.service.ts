import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { FileInfo } from '@progress/kendo-angular-upload';
import { VatTuHinhAnh } from '../models/vattuhinhanh.model';

@Injectable()
export class FileUploadEndpoint extends EndpointFactory {
    private readonly _fileuploadUrl = "/api/FileUploads";
    get fileuploadUrl() { return this.configurations.baseUrl + this._fileuploadUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    uploadFile(file?: any,stringRandom?: string, urlServer?: string) {
        let endpointUrl = `${this._fileuploadUrl}/UploadFile`;
        let body = JSON.stringify(file);
        return this.http.post(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.uploadFile(file, stringRandom, urlServer));
        });
    }

    deleteFileByPath(file?: string[], path?: string) {
        let endpointUrl = `${this._fileuploadUrl}/DelFileByPath/${path}`;
        let body = JSON.stringify(file);
        return this.http.post(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.deleteFileByPath(file, path));
        });
    }

    deleteEachFileByPath(file?: string, path?: string) {
        let endpointUrl = `${this._fileuploadUrl}/DelEachFileByPath/${file}/${path}`;
        return this.http.post(endpointUrl, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.deleteEachFileByPath(file, path));
        });
    }
}