import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { FileInfo } from '@progress/kendo-angular-upload';
import { LoaiDichVuEndpoint } from './loaidichvu-endpoint.service';
import { FileUploadEndpoint } from './fileupload-endpoint.service';
import { AuthService } from './auth.service';

@Injectable()
export class FileUploadService {
    constructor(private router: Router, private http: HttpClient, private fileUploadEndpoint: FileUploadEndpoint, private authService: AuthService) {

    }

    uploadFile(stringRandom?: string, urlServer?: string, file?: FileInfo[]) {
        return this.fileUploadEndpoint.uploadFile(stringRandom, urlServer, file);
    }
}