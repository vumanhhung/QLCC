// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { fadeInOut } from '../../../../services/animations';
import { LoaiYeuCau } from '../../../../models/loaiyeucau.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { AppTranslationService } from '../../../../services/app-translation.service';
import { LoaiYeuCauService } from '../../../../services/loaiyeucau.service';
import { Utilities } from '../../../../services/utilities';


@Component({
    selector: 'danhsachyeucau',
    templateUrl: './danhsachyeucau.component.html',
    styleUrls: ['./danhsachyeucau.component.css'],
    animations: [fadeInOut]
})
export class DanhSachYeuCauComponent implements OnInit, OnDestroy {
    public limit: number = 10;
    columns: any[] = [];
    rows: LoaiYeuCau[] = [];
    rowsCache: LoaiYeuCau[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    loaiyeucauEdit: LoaiYeuCau;
    sourceloaiyeucau: LoaiYeuCau;
    editingRowName: { name: string };

    @ViewChild('f')
    private form;

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('nameTemplate')
    nameTemplate: TemplateRef<any>;

    @ViewChild('descriptionTemplate')
    descriptionTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private loaiyeucauService: LoaiYeuCauService) {
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'tenLoaiYeuCau', name: gT('Mã YC') },
            { prop: 'kyHieu', name: gT('Ngày YC') },
            { prop: 'kyHieu', name: gT('Mặt bằng'), width: 50 },
            { prop: 'tenLoaiYeuCau', name: gT('Tiêu đề') },
            { prop: 'kyHieu', name: gT('Trạng thái') },
            { prop: 'dienGiai', name: gT('Độ ưu tiên') },
            { prop: 'tenLoaiYeuCau', name: gT('Bộ phận') },
            { prop: 'kyHieu', name: gT('Cư dân') },
            { prop: 'kyHieu', name: gT('Nhân viên xử lý') },
            { prop: 'kyHieu', name: gT('Nhân viên tiếp nhận') }
        ];

        this.loadData();
    }

    ngOnDestroy() {
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.loaiyeucauService.getAllLoaiYeuCau().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }
    onDataLoadSuccessful(obj: LoaiYeuCau[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        obj.forEach((item, index, obj) => {
            (<any>item).index = index + 1;
        });

        this.rowsCache = [...obj];
        this.rows = obj;
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }
}
