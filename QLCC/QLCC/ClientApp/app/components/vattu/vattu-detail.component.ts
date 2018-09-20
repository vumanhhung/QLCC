
import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { VatTu } from "../../models/vattu.model";
import { VatTuService } from "./../../services/vattu.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoaiTien } from '../../models/loaitien.model';
import { QuocTich } from '../../models/quoctich.model';
import { LoaiHang } from '../../models/loaihang.model';
import { HangSanXuat } from '../../models/hangsanxuat.model';
import { NhaCungCap } from '../../models/nhacungcap.model';
import { DonViTinh } from '../../models/donvitinh.model';
import { PhongBan } from '../../models/phongban.model';
import { NguoiDungToaNha } from '../../models/nguoidungtoanha.model';
import { LoaiTienService } from '../../services/loaitien.service';
import { VatTuHinhAnhComponent } from '../vattuhinhanh/vattuhinhanh.component';
import { VatTuHinhAnhInfoComponent } from '../vattuhinhanh/vattuhinhanh-info.component';
import { UploadEvent, SelectEvent, FileInfo, ClearEvent, RemoveEvent, FileRestrictions } from '@progress/kendo-angular-upload';
import { VatTuHinhAnh } from '../../models/vattuhinhanh.model';
import { VatTuHinhAnhService } from '../../services/vattuhinhanh.service';
import { VatTuTaiLieuService } from '../../services/vattutailieu.service';
import { VatTuTaiLieu } from '../../models/vattutailieu.model';
import { serializePath } from '@angular/router/src/url_tree';
import { window } from 'rxjs/operators';
import { FileUploadService } from '../../services/fileupload.service';

@Component({
    selector: "vattu-detail",
    templateUrl: "./vattu-detail.component.html",
    styleUrls: ["./vattu-detail.component.css"]
})

export class VatTuDetailComponent implements OnInit {
    isEdit = false;
    isViewDetails = false

    VTHAs: VatTuHinhAnh[] = [];
    VTTLs: VatTuTaiLieu[] = [];
    vattuEdit: VatTu;
    sourcevattu: VatTu;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    constructor(private alertService: AlertService, private gvService: VatTuService,
        private loaitienService: LoaiTienService,
        private vattuhinhanhService: VatTuHinhAnhService,
        private vattutailieuService: VatTuTaiLieuService,
        private fileuploadService: FileUploadService) {
    }

    ngOnInit() {
        
    }

    private movetoEditForm() {
        this.isViewDetails = false;
        this.isEdit = true;
    }
}
