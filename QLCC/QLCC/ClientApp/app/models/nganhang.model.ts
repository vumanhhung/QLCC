export class NganHang {
		public nganHangId: number;
		public tenNganHang: string;
		public diaChi: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(nganHangId?: number, tenNganHang?: string, diaChi?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.nganHangId = nganHangId;
				this.tenNganHang = tenNganHang;
				this.diaChi = diaChi;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
