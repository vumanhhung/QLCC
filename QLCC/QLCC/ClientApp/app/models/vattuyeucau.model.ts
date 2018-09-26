import { VatTu } from "./vattu.model";

export class VatTuYeuCau {
    public yeuCauvatTuId: number;
    public phieuYeuCauVTId: number;
    public vatTuId: number;
    public donViTinhId: number;
    public quocTichId: number;
    public soLuong: number;
    public ghiChu: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;
    public vattus: VatTu;

    constructor(yeuCauvatTuId?: number, phieuYeuCauVTId?: number, vatTuId?: number, donViTinhId?: number, quocTichId?: number, soLuong?: number, ghiChu?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.yeuCauvatTuId = yeuCauvatTuId;
        this.phieuYeuCauVTId = phieuYeuCauVTId;
        this.vatTuId = vatTuId;
        this.donViTinhId = donViTinhId;
        this.quocTichId = quocTichId;
        this.soLuong = soLuong;
        this.ghiChu = ghiChu;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
