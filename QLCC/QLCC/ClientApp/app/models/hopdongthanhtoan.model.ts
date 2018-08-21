export class HopDongThanhToan {
		public hopDongThanhToanId: number;
		public hopDongId: number;
		public loaiPhiThanhToan: number;
		public dotThanhToan: number;
		public tuNgay: Date;
		public denNgay: Date;
		public soThang: number;
		public soTien: number;
		public tienQuyDoi: number;
		public baoLanh: boolean;
		public dienGiai: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(hopDongThanhToanId?: number, hopDongId?: number, loaiPhiThanhToan?: number, dotThanhToan?: number, tuNgay?: Date, denNgay?: Date, soThang?: number, soTien?: number, tienQuyDoi?: number, baoLanh?: boolean, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.hopDongThanhToanId = hopDongThanhToanId;
				this.hopDongId = hopDongId;
				this.loaiPhiThanhToan = loaiPhiThanhToan;
				this.dotThanhToan = dotThanhToan;
				this.tuNgay = tuNgay;
				this.denNgay = denNgay;
				this.soThang = soThang;
				this.soTien = soTien;
				this.tienQuyDoi = tienQuyDoi;
				this.baoLanh = baoLanh;
				this.dienGiai = dienGiai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
