export class HopDongPhuLuc {
		public hopDongPhuLucId: number;
		public hopDongId: number;
		public soPhuLuc: string;
		public khachHangId: number;
		public loaiTienId: number;
		public tyGia: number;
		public giaThue: number;
		public kyThanhToan: number;
		public thanhTien: number;
		public tienQuyDoi: number;
		public ngayThanhToan: Date;
		public ngayKy: Date;
		public thoiHan: number;
		public ngayHetHan: Date;
		public ngayBanGiao: Date;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(hopDongPhuLucId?: number, hopDongId?: number, soPhuLuc?: string, khachHangId?: number, loaiTienId?: number, tyGia?: number, giaThue?: number, kyThanhToan?: number, thanhTien?: number, tienQuyDoi?: number, ngayThanhToan?: Date, ngayKy?: Date, thoiHan?: number, ngayHetHan?: Date, ngayBanGiao?: Date, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.hopDongPhuLucId = hopDongPhuLucId;
				this.hopDongId = hopDongId;
				this.soPhuLuc = soPhuLuc;
				this.khachHangId = khachHangId;
				this.loaiTienId = loaiTienId;
				this.tyGia = tyGia;
				this.giaThue = giaThue;
				this.kyThanhToan = kyThanhToan;
				this.thanhTien = thanhTien;
				this.tienQuyDoi = tienQuyDoi;
				this.ngayThanhToan = ngayThanhToan;
				this.ngayKy = ngayKy;
				this.thoiHan = thoiHan;
				this.ngayHetHan = ngayHetHan;
				this.ngayBanGiao = ngayBanGiao;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
