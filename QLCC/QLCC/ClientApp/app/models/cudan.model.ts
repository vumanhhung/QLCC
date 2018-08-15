import { MatBang } from "./matbang.model";
import { QuanHeChuHo } from "./quanhechuho.model";
import { TrangThaiCuDan } from "./trangthaicudan.model";

export class CuDan {
    public cuDanId: number;
    public hoTen: string;
    public ngaySinh: Date;
    public gioiTinh: number;
    public queQuan: string;
    public quocTich: string;
    public cmt: string;
    public tonGiao: string;
    public ngheNghiep: string;
    public soViSa: string;
    public ngayHetHanViSa: Date;
    public matBangId: number;
    public chuHo: string;
    public quanHeChuHoId: number;
    public soHoKhau: string;
    public ngayCapHoKhau: Date;
    public noiCapHoKhau: string;
    public ngayChuyenDen: Date;
    public ngayDi: Date;
    public dienThoai: string;
    public email: string;
    public trangThaiTamTru: number;
    public ngayDkTamTru: Date;
    public ngayHetHanTamTru: Date;
    public trangThaiCuDanId: number;
    public ghiChu: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;
    public matbang: MatBang;
    public quanhechuho: QuanHeChuHo;
    public trangthaicudan: TrangThaiCuDan;


    constructor(cuDanId?: number, hoTen?: string, ngaySinh?: Date, gioiTinh?: number, queQuan?: string, quocTich?: string, cmt?: string, tonGiao?: string, ngheNghiep?: string, soViSa?: string, ngayHetHanViSa?: Date, matBangId?: number, chuHo?: string, quanHeChuHoId?: number, soHoKhau?: string, ngayCapHoKhau?: Date, noiCapHoKhau?: string, ngayChuyenDen?: Date, ngayDi?: Date, dienThoai?: string, email?: string, trangThaiTamTru?: number, ngayDkTamTru?: Date, ngayHetHanTamTru?: Date, trangThaiCuDanId?: number, ghiChu?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.cuDanId = cuDanId;
        this.hoTen = hoTen;
        this.ngaySinh = ngaySinh;
        this.gioiTinh = gioiTinh;
        this.queQuan = queQuan;
        this.quocTich = quocTich;
        this.cmt = cmt;
        this.tonGiao = tonGiao;
        this.ngheNghiep = ngheNghiep;
        this.soViSa = soViSa;
        this.ngayHetHanViSa = ngayHetHanViSa;
        this.matBangId = matBangId;
        this.chuHo = chuHo;
        this.quanHeChuHoId = quanHeChuHoId;
        this.soHoKhau = soHoKhau;
        this.ngayCapHoKhau = ngayCapHoKhau;
        this.noiCapHoKhau = noiCapHoKhau;
        this.ngayChuyenDen = ngayChuyenDen;
        this.ngayDi = ngayDi;
        this.dienThoai = dienThoai;
        this.email = email;
        this.trangThaiTamTru = trangThaiTamTru;
        this.ngayDkTamTru = ngayDkTamTru;
        this.ngayHetHanTamTru = ngayHetHanTamTru;
        this.trangThaiCuDanId = trangThaiCuDanId;
        this.ghiChu = ghiChu;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
