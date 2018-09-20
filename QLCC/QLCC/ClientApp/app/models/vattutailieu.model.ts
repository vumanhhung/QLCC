export class VatTuTaiLieu {
    public vatTutaiLieuId: number;
    public vatTuId: number;
    public tenTaiLieu: string;
    public urlTaiLieu: string;
    public dienGiai: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;

    constructor(vatTutaiLieuId?: number, vatTuId?: number, tenTaiLieu?: string, urlTaiLieu?: string, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.vatTutaiLieuId = vatTutaiLieuId;
        this.vatTuId = vatTuId;
        this.tenTaiLieu = tenTaiLieu;
        this.urlTaiLieu = urlTaiLieu;
        this.dienGiai = dienGiai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
