export class HopDong {
    public hopDongId: number;
    public tenhopDong: string;
    public soHopDong: string;
    public loaiHopDong: number;
    public mauHopDong: string;
    public khachHangId: number;
    public ngayKy: Date;
    public ngayHieuLuc: Date;
    public thoiHan: number;
    public kyThanhToan: number;
    public hanThanhToan: number;
    public ngayBanGiao: Date;
    public tyleDCGT: number;
    public soNamDCGT: number;
    public mucDCGT: number;
    public loaiTienId: number;
    public tyGia: number;
    public giaThue: number;
    public tienCoc: number;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;

    constructor(hopDongId?: number, tenhopDong?: string, soHopDong?: string, loaiHopDong?: number, mauHopDong?: string, khachHangId?: number, ngayKy?: Date, ngayHieuLuc?: Date, thoiHan?: number, kyThanhToan?: number, hanThanhToan?: number, ngayBanGiao?: Date, tyleDCGT?: number, soNamDCGT?: number, mucDCGT?: number, loaiTienId?: number, tyGia?: number, giaThue?: number, tienCoc?: number, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.hopDongId = hopDongId;
        this.tenhopDong = tenhopDong;
        this.soHopDong = soHopDong;
        this.loaiHopDong = loaiHopDong;
        this.mauHopDong = mauHopDong;
        this.khachHangId = khachHangId;
        this.ngayKy = ngayKy;
        this.ngayHieuLuc = ngayHieuLuc;
        this.thoiHan = thoiHan;
        this.kyThanhToan = kyThanhToan;
        this.hanThanhToan = hanThanhToan;
        this.ngayBanGiao = ngayBanGiao;
        this.tyleDCGT = tyleDCGT;
        this.soNamDCGT = soNamDCGT;
        this.mucDCGT = mucDCGT;
        this.loaiTienId = loaiTienId;
        this.tyGia = tyGia;
        this.giaThue = giaThue;
        this.tienCoc = tienCoc;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
