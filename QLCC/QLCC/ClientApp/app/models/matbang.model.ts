import { ToaNha } from "./toanha.model";
import { CumToaNha } from "./cumtoanha.model";
import { TrangThai } from "./trangthai.model";
import { TangLau } from "./tanglau.model";
import { LoaiMatBang } from "./loaimatbang.model";
import { KhachHang } from "./khachhang.model";


export class MatBang {
    public matBangId: number;
    public cumToaNhaId: number;
    public toaNhaId: number;
    public tangLauId: number;
    public trangThaiId: number;
    public loaiMatBangId: number;
    public maMatBang: string;
    public tenMatBang: string;
    public dienTich: number;
    public giaThue: number;
    public loaiTien: string;
    public caNhan: number;
    public giaoChiaKhoa: number;
    public ngaybanGiao: Date;
    public dienGiai: string;
    public khachHangId: number;
    public khachThue: number;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;
    public toanha: ToaNha;
    public cumtoanha: CumToaNha;
    public trangthai: TrangThai;
    public tanglau: TangLau;
    public loaimatbang: LoaiMatBang;
    public khacHangs: KhachHang;

    constructor(matBangId?: number, cumToaNhaId?: number, toaNhaId?: number, tangLauId?: number, trangThaiId?: number, loaiMatBangId?: number, maMatBang?: string, tenMatBang?: string, dienTich?: number, giaThue?: number, loaiTien?: string, caNhan?: number, giaoChiaKhoa?: number, ngaybanGiao?: Date, dienGiai?: string, khachHangId?: number, khachThue?: number, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.matBangId = matBangId;
        this.cumToaNhaId = cumToaNhaId;
        this.toaNhaId = toaNhaId;
        this.tangLauId = tangLauId;
        this.trangThaiId = trangThaiId;
        this.loaiMatBangId = loaiMatBangId;
        this.maMatBang = maMatBang;
        this.tenMatBang = tenMatBang;
        this.dienTich = dienTich;
        this.giaThue = giaThue;
        this.loaiTien = loaiTien;
        this.caNhan = caNhan;
        this.giaoChiaKhoa = giaoChiaKhoa;
        this.ngaybanGiao = ngaybanGiao;
        this.dienGiai = dienGiai;
        this.khachHangId = khachHangId;
        this.khachThue = khachThue;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
