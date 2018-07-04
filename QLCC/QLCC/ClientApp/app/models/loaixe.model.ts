export class LoaiXe {
		public loaiXeId: number;
		public tenLoaiXe: string;
		public kyHieu: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(loaiXeId?: number, tenLoaiXe?: string, kyHieu?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.loaiXeId = loaiXeId;
				this.tenLoaiXe = tenLoaiXe;
				this.kyHieu = kyHieu;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
