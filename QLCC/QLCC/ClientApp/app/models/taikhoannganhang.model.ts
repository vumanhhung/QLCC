import { NganHang } from "./nganhang.model";

export class TaiKhoanNganHang {
		public taiKhoanNganHangId: number;
		public chuTaiKhoan: string;
		public soTaiKhoan: string;
		public nganHangId: number;
		public dienGiai: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
    public ngaySua: Date;
    public nganhang: NganHang;
    
    constructor(taiKhoanNganHangId?: number, chuTaiKhoan?: string, soTaiKhoan?: string, nganHangId?: number, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.taiKhoanNganHangId = taiKhoanNganHangId;
				this.chuTaiKhoan = chuTaiKhoan;
				this.soTaiKhoan = soTaiKhoan;
				this.nganHangId = nganHangId;
				this.dienGiai = dienGiai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
