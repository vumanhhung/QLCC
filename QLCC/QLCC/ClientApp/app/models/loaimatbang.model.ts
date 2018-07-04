export class LoaiMatBang {
    public loaiMatBangId: number;
    public tenLoaiMatBang: string;
    public dienGiai: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;

    constructor(loaiMatBangId?: number, tenLoaiMatBang?: string, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.loaiMatBangId = loaiMatBangId;
        this.tenLoaiMatBang = tenLoaiMatBang;
        this.dienGiai = dienGiai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
