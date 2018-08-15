import { LoaiXe } from "./loaixe.model";
import { PhieuThuChiTiet } from "./phieuthuchitiet.model";

export class TheXe {
    public theXeId: number;
    public maTheXe: string;
    public matBangId: number;
    public khachHangId: number;
    public loaiXeId: number;
    public phiGuiXe: number;
    public bienSoXe: string;
    public mauXe: string;
    public doiXe: string;
    public ngayDangKy: Date;
    public soHD: string;
    public dienGiai: string;
    public trangThai: number;
    public ngayNgungSuDung: Date;
    public ngayThanhToan: number;
    public kyThanhToan: number;
    public nguoiNhap: string;
    public ngaySua: Date;
    public nguoiSua: string;
    public loaiXes: LoaiXe;
    public phieuThuChiTiets: PhieuThuChiTiet;

    constructor(theXeId?: number, maTheXe?: string, matBangId?: number, khachHangId?: number, loaiXeId?: number, phiGuiXe?: number, bienSoXe?: string, mauXe?: string, doiXe?: string, ngayDangKy?: Date, soHD?: string, dienGiai?: string, trangThai?: number, ngayNgungSuDung?: Date, ngayThanhToan?: number, kyThanhToan?: number, nguoiNhap?: string, ngaySua?: Date, nguoiSua?: string) {
        this.theXeId = theXeId;
        this.maTheXe = maTheXe;
        this.matBangId = matBangId;
        this.khachHangId = khachHangId;
        this.loaiXeId = loaiXeId;
        this.phiGuiXe = phiGuiXe;
        this.bienSoXe = bienSoXe;
        this.mauXe = mauXe;
        this.doiXe = doiXe;
        this.ngayDangKy = ngayDangKy;
        this.soHD = soHD;
        this.dienGiai = dienGiai;
        this.trangThai = trangThai;
        this.ngayNgungSuDung = ngayNgungSuDung;
        this.ngayThanhToan = ngayThanhToan;
        this.kyThanhToan = kyThanhToan;
        this.nguoiNhap = nguoiNhap;
        this.ngaySua = ngaySua;
        this.nguoiSua = nguoiSua;
    }
}
