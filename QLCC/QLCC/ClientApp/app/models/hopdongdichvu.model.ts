export class HopDongDichVu {
		public hopDongDichVuId: number;
		public hopDongId: number;
		public loaiDichVuId: number;
		public donGia: number;
		public loaiTienId: number;
		public donViTinhId: number;
		public mienPhi: boolean;
		public dienGiai: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(hopDongDichVuId?: number, hopDongId?: number, loaiDichVuId?: number, donGia?: number, loaiTienId?: number, donViTinhId?: number, mienPhi?: boolean, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.hopDongDichVuId = hopDongDichVuId;
				this.hopDongId = hopDongId;
				this.loaiDichVuId = loaiDichVuId;
				this.donGia = donGia;
				this.loaiTienId = loaiTienId;
				this.donViTinhId = donViTinhId;
				this.mienPhi = mienPhi;
				this.dienGiai = dienGiai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
