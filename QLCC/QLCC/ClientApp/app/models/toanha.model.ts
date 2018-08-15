import { CumToaNha } from "./cumtoanha.model";

export class ToaNha {
    public toaNhaId: number;
    public cumToaNhaId: number;
    public tenKhoiNha: string;
    public tenVietTat: string;
    public maKhoiNha: string;
    public dienGiai: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;
    public cumtoanhas: CumToaNha;

    constructor(toaNhaId?: number, cumToaNhaId?: number, tenKhoiNha?: string, tenVietTat?: string, maKhoiNha?: string, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.toaNhaId = toaNhaId;
        this.cumToaNhaId = cumToaNhaId;
        this.tenKhoiNha = tenKhoiNha;
        this.tenVietTat = tenVietTat;
        this.maKhoiNha = maKhoiNha;
        this.dienGiai = dienGiai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
