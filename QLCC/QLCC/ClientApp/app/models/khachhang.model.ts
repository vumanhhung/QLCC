﻿import { QuocTich } from "./quoctich.model";
import { NganHang } from "./nganhang.model";
import { NhomKhachHang } from "./nhomkhachhang.model";

export class KhachHang {
    public khachHangId: number;
    public hoDem: string;
    public ten: string;
    public gioiTinh: number;
    public gioiTinhN: string;
    public ngaySinh: Date;
    public dienThoai: string;
    public email: string;
    public mst: string;
    public cmt: string;
    public ngayCap: Date;
    public noiCap: string;
    public thuongTru: string;
    public diaChi: string;
    public tkNganHang: string;
    public quocTich: string;
    public khDoanhNghiep: boolean;
    public tenVietTat: string;
    public tenCongTy: string;
    public diaChiCongTy: string;
    public dienThoaiCongTy: string;
    public fax: string;
    public nguoiDaiDien: string;
    public chucVu: string;
    public mstCongTy: string;
    public soDkKinhDoanh: string;
    public ngayDkKinhDoanh: Date;
    public noiDkKinhDoanh: string;
    public tkNganHangCongTy: string;
    public nganHang: string;
    public nhomKhachHangId: number;
    public nhomKhachHang: NhomKhachHang;

    constructor(khachHangId?: number, hoDem?: string, ten?: string, gioiTinh?: number, ngaySinh?: Date, dienThoai?: string, email?: string, mst?: string, cmt?: string, ngayCap?: Date, noiCap?: string, thuongTru?: string, diaChi?: string, tkNganHang?: string, quocTich?: string, khDoanhNghiep?: boolean, tenVietTat?: string, tenCongTy?: string, diaChiCongTy?: string, dienThoaiCongTy?: string, fax?: string, nguoiDaiDien?: string, chucVu?: string, mstCongTy?: string, soDkKinhDoanh?: string, ngayDkKinhDoanh?: Date, noiDkKinhDoanh?: string, tkNganHangCongTy?: string, nganHang?: string, nhomKhachHangId?: number) {
        this.khachHangId = khachHangId;
        this.hoDem = hoDem;
        this.ten = ten;
        this.gioiTinh = gioiTinh;
        this.ngaySinh = ngaySinh;
        this.dienThoai = dienThoai;
        this.email = email;
        this.mst = mst;
        this.cmt = cmt;
        this.ngayCap = ngayCap;
        this.noiCap = noiCap;
        this.thuongTru = thuongTru;
        this.diaChi = diaChi;
        this.tkNganHang = tkNganHang;
        this.quocTich = quocTich;
        this.khDoanhNghiep = khDoanhNghiep;
        this.tenVietTat = tenVietTat;
        this.tenCongTy = tenCongTy;
        this.diaChiCongTy = diaChiCongTy;
        this.dienThoaiCongTy = dienThoaiCongTy;
        this.fax = fax;
        this.nguoiDaiDien = nguoiDaiDien;
        this.chucVu = chucVu;
        this.mstCongTy = mstCongTy;
        this.soDkKinhDoanh = soDkKinhDoanh;
        this.ngayDkKinhDoanh = ngayDkKinhDoanh;
        this.noiDkKinhDoanh = noiDkKinhDoanh;
        this.tkNganHangCongTy = tkNganHangCongTy;
        this.nganHang = nganHang;
        this.nhomKhachHangId = nhomKhachHangId;        
    }
}