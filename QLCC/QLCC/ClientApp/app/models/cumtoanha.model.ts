import { NganHang } from "./nganhang.model";

export class CumToaNha {
    public cumToaNhaId: number;
    public tenCumToaNha: string;
    public tenVietTat: string;
    public mST: string;
    public sDT: string;
    public fax: string;
    public email: string;
    public diaChi: string;
    public nguoiQuanLy: string;
    public nganHangId: number;
    public sTK: string;
    public nganHang: NganHang;
    public logo: string;
    public tenNguoiNhan: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;

    constructor(cumToaNhaId?: number, tenCumToaNha?: string, tenVietTat?: string, mST?: string, sDT?: string, fax?: string, email?: string, diaChi?: string, nguoiQuanLy?: string, sTK?: string, nganHangId?: number, logo?: string, tenNguoiNhan?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.cumToaNhaId = cumToaNhaId;
        this.tenCumToaNha = tenCumToaNha;
        this.tenVietTat = tenVietTat;
        this.mST = mST;
        this.sDT = sDT;
        this.fax = fax;
        this.email = email;
        this.diaChi = diaChi;
        this.nguoiQuanLy = nguoiQuanLy;
        this.sTK = sTK;
        this.nganHangId = nganHangId;
        this.logo = logo;
        this.tenNguoiNhan = tenNguoiNhan;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
