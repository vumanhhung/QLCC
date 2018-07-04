export class QuocTich {
    public quocTichId: number;
    public tenNuoc: string;
    public kyHieu: string;
    public dienGiai: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;

    constructor(quocTichId?: number, tenNuoc?: string, kyHieu?: string, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.quocTichId = quocTichId;
        this.tenNuoc = tenNuoc;
        this.kyHieu = kyHieu;
        this.dienGiai = dienGiai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
