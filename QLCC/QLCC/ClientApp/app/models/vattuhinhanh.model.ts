﻿export class VatTuHinhAnh {
    public vatTuHinhAnhId: number;
    public vatTuId: number;
    public tenHinhAnh: string;
    public uRLHinhAnh: string;
    public dienGiai: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;

    constructor(vatTuHinhAnhId?: number, vatTuId?: number, tenHinhAnh?: string, uRLHinhAnh?: string, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.vatTuHinhAnhId = vatTuHinhAnhId;
        this.vatTuId = vatTuId;
        this.tenHinhAnh = tenHinhAnh;
        this.uRLHinhAnh = uRLHinhAnh;
        this.dienGiai = dienGiai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
