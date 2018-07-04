import { ToaNha } from "./toanha.model";

export class PhongBan {
    public phongBanId: number;
    public tenPhongBan: string;
    public toaNhaId: number;
    public dienGiai: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;
    public toanha: ToaNha;

    constructor(phongBanId?: number, tenPhongBan?: string, toaNhaId?: number, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.phongBanId = phongBanId;
        this.tenPhongBan = tenPhongBan;
        this.toaNhaId = toaNhaId;
        this.dienGiai = dienGiai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
