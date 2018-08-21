export class HopDongMatBang {
		public hopDongMatBangId: number;
		public matBangId: number;
		public hopDongId: number;
		public loaiGiaThue: number;
		public dienTich: number;
		public giaThue: number;
		public phiDichVu: number;
		public thanhTien: number;
		public tyleVAT: number;
		public tienVAT: number;
		public tyLeCK: number;
		public tienCK: number;
		public tongTien: number;
		public phiSuaChua: number;
		public dienGiai: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(hopDongMatBangId?: number, matBangId?: number, hopDongId?: number, loaiGiaThue?: number, dienTich?: number, giaThue?: number, phiDichVu?: number, thanhTien?: number, tyleVAT?: number, tienVAT?: number, tyLeCK?: number, tienCK?: number, tongTien?: number, phiSuaChua?: number, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.hopDongMatBangId = hopDongMatBangId;
				this.matBangId = matBangId;
				this.hopDongId = hopDongId;
				this.loaiGiaThue = loaiGiaThue;
				this.dienTich = dienTich;
				this.giaThue = giaThue;
				this.phiDichVu = phiDichVu;
				this.thanhTien = thanhTien;
				this.tyleVAT = tyleVAT;
				this.tienVAT = tienVAT;
				this.tyLeCK = tyLeCK;
				this.tienCK = tienCK;
				this.tongTien = tongTien;
				this.phiSuaChua = phiSuaChua;
				this.dienGiai = dienGiai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
