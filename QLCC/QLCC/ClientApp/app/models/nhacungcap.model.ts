export class NhaCungCap {
    public nhaCungCapId: number;
    public tenNhaCungCap: string;
    public dienGiai: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;

    constructor(nhaCungCapId?: number, tenNhaCungCap?: string, dienGiai? : string , nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.nhaCungCapId = nhaCungCapId;
        this.tenNhaCungCap = tenNhaCungCap;
        this.dienGiai = dienGiai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
