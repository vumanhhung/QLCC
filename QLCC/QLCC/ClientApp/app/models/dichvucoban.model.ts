import { MatBang } from "./matbang.model";
import { KhachHang } from "./khachhang.model";
import { LoaiDichVu } from "./loaidichvu.model";
import { LoaiTien } from "./loaitien.model";
import { DonViTinh } from "./donvitinh.model";
import { TangLau } from "./tanglau.model";

export class DichVuCoBan {
    public dichVuCoBanId: number;
    public soChungTu: string;
    public ngayChungTu: Date;
    public matBangId: number;
    public khachHangId: number;
    public loaiDichVuId: number;
    public donViTinhId: number;
    public donGia: number;
    public soLuong: number;
    public thanhTien: number;
    public ngayThanhToan: Date;
    public kyThanhToan: number;
    public tienThanhToan: number;
    public tienTTQuyDoi: number;
    public loaiTienId: number;
    public tyGia: number;
    public tuNgay: Date;
    public denNgay: Date;
    public dienGiai: string;
    public lapLai: boolean;
    public trangThai: number;
    public ngayNhap: Date;
    public nguoiNhap: string;
    public ngaySua: Date;
    public nguoiSua: string;
    public matBangs: MatBang;
    public khachHangs: KhachHang;
    public loaiDichVus: LoaiDichVu;
    public loaiTiens: LoaiTien;
    public donViTinhs: DonViTinh;

    constructor(dichVuCoBanId?: number, soChungTu?: string, ngayChungTu?: Date, matBangId?: number,
        khachHangId?: number, loaiDichVuId?: number, donViTinhId?: number, donGia?: number,
        soLuong?: number, thanhTien?: number, ngayThanhToan?: Date, kyThanhToan?: number,
        tienThanhToan?: number, tienTTQuyDoi?: number, loaiTienId?: number, tyGia?: number,
        tuNgay?: Date, denNgay?: Date, dienGiai?: string, lapLai?: boolean, trangThai?: number, ngayNhap?: Date, nguoiNhap?: string,
        ngaySua?: Date, nguoiSua?: string, matbangs?: MatBang, khachhangs?: KhachHang, loaidichvus?: LoaiDichVu, loaitiens?: LoaiTien, donvitinhs?: DonViTinh) {
        this.dichVuCoBanId = dichVuCoBanId;
        this.soChungTu = soChungTu;
        this.ngayChungTu = ngayChungTu;
        this.matBangId = matBangId;
        this.khachHangId = khachHangId;
        this.loaiDichVuId = loaiDichVuId;
        this.donViTinhId = donViTinhId;
        this.donGia = donGia;
        this.soLuong = soLuong;
        this.thanhTien = thanhTien;
        this.ngayThanhToan = ngayThanhToan;
        this.kyThanhToan = kyThanhToan;
        this.tienThanhToan = tienThanhToan;
        this.tienTTQuyDoi = tienTTQuyDoi;
        this.loaiTienId = loaiTienId;
        this.tyGia = tyGia;
        this.tuNgay = tuNgay;
        this.denNgay = denNgay;
        this.dienGiai = dienGiai;
        this.lapLai = lapLai;
        this.trangThai = trangThai;
        this.ngayNhap = ngayNhap;
        this.nguoiNhap = nguoiNhap;
        this.ngaySua = ngaySua;
        this.nguoiSua = nguoiSua;
        this.matBangs = matbangs;
        this.khachHangs = khachhangs;
        this.loaiDichVus = loaidichvus;
        this.loaiTiens = loaitiens;
        this.donViTinhs = donvitinhs;
    }
}
