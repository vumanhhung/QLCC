export class ChucVu {
    public chucVuId: number;
    public tenChucVu: string;
    public kyHieu: string;
    public dienGiai: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;

    constructor(chucVuId?: number, tenChucVu?: string, kyHieu?: string, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.chucVuId = chucVuId;
        this.tenChucVu = tenChucVu;
        this.kyHieu = kyHieu;
        this.dienGiai = dienGiai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
