import { ToaNha } from "./toanha.model";

export class TangLau {
    public tangLauId: number;
    public toaNhaId: number;
    public tenTangLau: string;
    public dienGiai: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;
    public toanhas: ToaNha;

    constructor(tangLauId?: number, toaNhaId?: number, tenTangLau?: string, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.tangLauId = tangLauId;
        this.toaNhaId = toaNhaId;
        this.tenTangLau = tenTangLau;
        this.dienGiai = dienGiai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
