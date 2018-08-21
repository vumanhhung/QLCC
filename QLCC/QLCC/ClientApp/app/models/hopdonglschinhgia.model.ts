export class HopDongLSChinhGia {
		public hopDongLSChinhGiaId: number;
		public hopDongId: number;
		public ngayDieuChinh: Date;
		public hangMucDieuChinh: string;
		public giaCu: number;
		public tyle: number;
		public giaMoi: number;
		public dienGiai: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
    
    constructor(hopDongLSChinhGiaId?: number, hopDongId?: number, ngayDieuChinh?: Date, hangMucDieuChinh?: string, giaCu?: number, tyle?: number, giaMoi?: number, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date)
    {
				this.hopDongLSChinhGiaId = hopDongLSChinhGiaId;
				this.hopDongId = hopDongId;
				this.ngayDieuChinh = ngayDieuChinh;
				this.hangMucDieuChinh = hangMucDieuChinh;
				this.giaCu = giaCu;
				this.tyle = tyle;
				this.giaMoi = giaMoi;
				this.dienGiai = dienGiai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
    }
}
