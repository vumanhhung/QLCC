export class NhomKhachHang {
		public nhomKhachHangId: number;
		public tenNhomKhachHang: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(nhomKhachHangId?: number, tenNhomKhachHang?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.nhomKhachHangId = nhomKhachHangId;
				this.tenNhomKhachHang = tenNhomKhachHang;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
