import { LoaiXe } from "./loaixe.model";

export class BangGiaXe {
    public bangGiaXeId: number;
    public toaNhaId: number;
    public loaiXeId: number;    
    public dinhMuc: number;
    public giaThang: number;
    public giaNgay: number;
    public dienGiai: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;
    public LoaiXe: LoaiXe;

    constructor(bangGiaXeId?: number, toaNhaId?: number, loaiXeId?: number, dinhMuc?: number, giaThang?: number, giaNgay?: number, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.bangGiaXeId = bangGiaXeId;
        this.toaNhaId = toaNhaId;
        this.loaiXeId = loaiXeId;
        this.dinhMuc = dinhMuc;
        this.giaThang = giaThang;
        this.giaNgay = giaNgay;
        this.dienGiai = dienGiai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
