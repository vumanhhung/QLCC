export class DichVuNuoc {
		public dichVuNuocId: number;
		public matBangId: number;
		public khachHangId: number;
		public tuNgay: Date;
		public denNgay: Date;
		public chiSoCu: number;
		public chiSoMoi: number;
		public soTieuThu: number;
		public thanhTien: number;
		public tyLeVAT: number;
		public tienVAT: number;
		public tyLeBVMT: number;
		public tienBVMT: number;
		public ngayThanhToan: Date;
		public tienThanhToan: number;
		public thang: number;
		public nam: number;
		public dienGiai: string;
		public ngayNhap: Date;
		public nguoiNhap: string;
		public ngaySua: Date;
		public nguoiSua: string;
    
    constructor(dichVuNuocId?: number, matBangId?: number, khachHangId?: number, tuNgay?: Date, denNgay?: Date, chiSoCu?: number, chiSoMoi?: number, soTieuThu?: number, thanhTien?: number, tyLeVAT?: number, tienVAT?: number, tyLeBVMT?: number, tienBVMT?: number, ngayThanhToan?: Date, tienThanhToan?: number, thang?: number, nam?: number, dienGiai?: string, ngayNhap?: Date, nguoiNhap?: string, ngaySua?: Date, nguoiSua?: string)
    {
				this.dichVuNuocId = dichVuNuocId;
				this.matBangId = matBangId;
				this.khachHangId = khachHangId;
				this.tuNgay = tuNgay;
				this.denNgay = denNgay;
				this.chiSoCu = chiSoCu;
				this.chiSoMoi = chiSoMoi;
				this.soTieuThu = soTieuThu;
				this.thanhTien = thanhTien;
				this.tyLeVAT = tyLeVAT;
				this.tienVAT = tienVAT;
				this.tyLeBVMT = tyLeBVMT;
				this.tienBVMT = tienBVMT;
				this.ngayThanhToan = ngayThanhToan;
				this.tienThanhToan = tienThanhToan;
				this.thang = thang;
				this.nam = nam;
				this.dienGiai = dienGiai;
				this.ngayNhap = ngayNhap;
				this.nguoiNhap = nguoiNhap;
				this.ngaySua = ngaySua;
				this.nguoiSua = nguoiSua;
    }
}
