
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
import { VatTuHinhAnh } from '../../models/vattuhinhanh.model';
import { VatTuHinhAnhService } from '../../services/vattuhinhanh.service';
import { VatTuTaiLieuService } from '../../services/vattutailieu.service';
import { VatTuTaiLieu } from '../../models/vattutailieu.model';
import { FileUploadService } from '../../services/fileupload.service';
import { VatTuInfoComponent } from './vattu-info.component';

@Component({
    selector: "vattu-detail",
    templateUrl: "./vattu-detail.component.html",
    styleUrls: ["./vattu-detail.component.css"]
})

export class VatTuDetailComponent implements OnInit {
    isEdit = false;
    isViewDetails = false;
    formResetToggle = false;

    VTHAs: VatTuHinhAnh[] = [];
    VTTLs: VatTuTaiLieu[] = [];
    quoctichs: QuocTich[] = [];
    loaihangs: LoaiHang[] = [];
    hangSX: HangSanXuat[] = [];
    nhaCC: NhaCungCap[] = [];
    donvitinhs: DonViTinh[] = [];
    phongbans: PhongBan[] = [];
    loaitiens: LoaiTien[] = [];
    NDTN: NguoiDungToaNha[] = [];
    vattuCha: VatTu[] = [];

    vattuEdit: VatTu;
    sourcevattu: VatTu;

    @Input()
    isViewOnly: boolean;

    @ViewChild('f')
    private form;

    @ViewChild('editorModal1')
    editorModal1: ModalDirective;

    @ViewChild('vattuEditor')
    vattuEditor: VatTuInfoComponent;

    constructor() {
    }

    ngOnInit() {
    }

    private movetoEditForm() {        
        this.isViewDetails = false;
        this.vattuEditor.editorModal.show();
    }

    onEditorModalHidden() {
        this.resetForm(true);
    }

    resetForm(replace = false) {
        if (!replace) {
            this.form.reset();
        }
        else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }

    formatPrice(price: string) {
        if (price) {
            var pN = Number(price);
            var fm = Utilities.formatNumber(pN);
            return fm;
        }
    }

    closeModal() {
        this.editorModal1.hide();
    }
}
