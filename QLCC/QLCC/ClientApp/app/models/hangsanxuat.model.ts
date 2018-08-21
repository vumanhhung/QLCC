export class HangSanXuat {
		public hangSanXuatId: number;
		public tenHangSanXuat: string;
		public kyHieu: string;
		public dienGiai: string;
		public trangThai: boolean;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(hangSanXuatId?: number, tenHangSanXuat?: string, kyHieu?: string, dienGiai?: string, trangThai?: boolean, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.hangSanXuatId = hangSanXuatId;
				this.tenHangSanXuat = tenHangSanXuat;
				this.kyHieu = kyHieu;
				this.dienGiai = dienGiai;
				this.trangThai = trangThai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
