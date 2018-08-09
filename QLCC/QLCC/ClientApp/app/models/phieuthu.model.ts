export class PhieuThu {
    public phieuThuId: number;
    public maPhieuThu: string;
    public matBangId: number;
    public loaiDichVu: number;
    public tongSoTien: number;
    public trangThai: number;
    public ghiChu: string;
    public soLanInHoaDon: number;
    public nguoiLap: string;
    public ngayLap: Date;
    public maBarcode: string;
    public maQRCode: string;

    constructor(phieuThuId?: number, maPhieuThu?: string, matBangId?: number, loaiDichVu?: number, tongSoTien?: number, trangThai?: number, ghiChu?: string, soLanInHoaDon?: number, nguoiLap?: string, ngayLap?: Date, maBarcode?: string, maQRCode?: string) {
        this.phieuThuId = phieuThuId;
        this.maPhieuThu = maPhieuThu;
        this.matBangId = matBangId;
        this.loaiDichVu = loaiDichVu;
        this.tongSoTien = tongSoTien;
        this.trangThai = trangThai;
        this.ghiChu = ghiChu;
        this.soLanInHoaDon = soLanInHoaDon;
        this.nguoiLap = nguoiLap;
        this.ngayLap = ngayLap;
        this.maBarcode = maBarcode;
        this.maQRCode = maQRCode;
    }
}
