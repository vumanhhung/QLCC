import { LoaiTien } from "./loaitien.model";

export class LoaiGiaThue {
    public loaiGiaThueId: number;
    public tenLoaiGia: string;
    public donGia: number;
    public loaiTienId: number;
    public dienGiai: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;
    public loaitien: LoaiTien;

    constructor(loaiGiaThueId?: number, tenLoaiGia?: string, donGia?: number, loaiTienId?: number, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.loaiGiaThueId = loaiGiaThueId;
        this.tenLoaiGia = tenLoaiGia;
        this.donGia = donGia;
        this.loaiTienId = loaiTienId;
        this.dienGiai = dienGiai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
