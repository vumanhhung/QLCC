import { PhieuThu } from "./phieuthu.model";

export class PhieuThuChiTiet {
    public phieuThuChiTietId: number;
    public phieuThuId: number;
    public matBangId: number;
    public loaiDichVu: number;
    public theXeId: number;
    public tongSoTien: number;
    public ngayNop: Date;
    public hanTuNgay: Date;
    public hanDenNgay: Date;
    public ghiChu: string;
    public thang: number;
    public nam: number;
    public nguoiLap: string;
    public ngayLap: Date;
    public kyCuoi: boolean;
    public phieuThu: PhieuThu;

    constructor(phieuThuChiTietId?: number, phieuThuId?: number, matBangId?: number, loaiDichVu?: number, theXeId?: number, tongSoTien?: number, ngayNop?: Date, hanTuNgay?: Date, hanDenNgay?: Date, ghiChu?: string, thang?: number, nam?: number, nguoiLap?: string, ngayLap?: Date, kyCuoi?: boolean) {
        this.phieuThuChiTietId = phieuThuChiTietId;
        this.phieuThuId = phieuThuId;
        this.matBangId = matBangId;
        this.loaiDichVu = loaiDichVu;
        this.theXeId = theXeId;
        this.tongSoTien = tongSoTien;
        this.ngayNop = ngayNop;
        this.hanTuNgay = hanTuNgay;
        this.hanDenNgay = hanDenNgay;
        this.ghiChu = ghiChu;
        this.thang = thang;
        this.nam = nam;
        this.nguoiLap = nguoiLap;
        this.ngayLap = ngayLap;
        this.kyCuoi = kyCuoi;
    }
}
