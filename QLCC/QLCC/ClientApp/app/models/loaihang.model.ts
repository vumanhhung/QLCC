export class LoaiHang {
		public loaiHangId: number;
		public tenLoaiHang: string;
		public kyHieu: string;
		public dienGiai: string;
		public trangThai: boolean;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(loaiHangId?: number, tenLoaiHang?: string, kyHieu?: string, dienGiai?: string, trangThai?: boolean, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.loaiHangId = loaiHangId;
				this.tenLoaiHang = tenLoaiHang;
				this.kyHieu = kyHieu;
				this.dienGiai = dienGiai;
				this.trangThai = trangThai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
