export class LoaiYeuCau {
    public loaiYeuCauId: number;
    public tenLoaiYeuCau: string;
    public kyHieu: string;
    public dienGiai: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;

    constructor(loaiYeuCauId?: number, tenLoaiYeuCau?: string, kyHieu?: string, dienGiai? : string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.loaiYeuCauId = loaiYeuCauId;
        this.tenLoaiYeuCau = tenLoaiYeuCau;
        this.kyHieu = kyHieu;
        this.dienGiai = dienGiai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
