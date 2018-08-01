import { LoaiDichVu } from "./loaidichvu.model";
import { LoaiTien } from "./loaitien.model";
import { DonViTinh } from "./donvitinh.model";

export class BangGiaDichVuCoBan {
    public bangGiaDichVuCoBanId: number;
    public loaiDichVuId: number;
    public loaiTienId: number;
    public donViTinhId: number;
    public toaNhaId: number;
    public donGia: number;
    public dienGiai: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;
    public loaiDichVu: LoaiDichVu;
    public loaiTien: LoaiTien;
    public donViTinh: DonViTinh;

    constructor(bangGiaDichVuCoBanId?: number, loaiDichVuId?: number, loaiTienId?: number, donViTinhId?: number, toaNhaId?: number, donGia?: number, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.bangGiaDichVuCoBanId = bangGiaDichVuCoBanId;
        this.loaiDichVuId = loaiDichVuId;
        this.loaiTienId = loaiTienId;
        this.donViTinhId = donViTinhId;
        this.toaNhaId = toaNhaId;
        this.donGia = donGia;
        this.dienGiai = dienGiai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
