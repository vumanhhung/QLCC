import { PhongBan } from "./phongban.model";
import { ToaNha } from "./toanha.model";

export class VatTuPhieuYeuCau {
    public phieuYeuCauVTId: number;
    public nguoiYeuCau: string;
    public phongBanId: number;
    public toaNhaId: number;
    public mucDichSuDung: string;
    public nguoiTiepNhan: string;
    public dienGiai: string;
    public nguoiDuyet: string;
    public trangThai: number;
    public phongbans: PhongBan;
    public toanhas: ToaNha;

    constructor(phieuYeuCauVTId?: number, nguoiYeuCau?: string, phongBanId?: number, toaNhaId?: number, mucDichSuDung?: string, nguoiTiepNhan?: string, dienGiai?: string, nguoiDuyet?: string, trangThai?: number) {
        this.phieuYeuCauVTId = phieuYeuCauVTId;
        this.nguoiYeuCau = nguoiYeuCau;
        this.phongBanId = phongBanId;
        this.toaNhaId = toaNhaId;
        this.mucDichSuDung = mucDichSuDung;
        this.nguoiTiepNhan = nguoiTiepNhan;
        this.dienGiai = dienGiai;
        this.nguoiDuyet = nguoiDuyet;
        this.trangThai = trangThai;
    }
}
