export class VatTuTaiLieu {
		public vatTutaiLieuId: number;
		public tenTaiLieu: string;
		public uRLTaiLieu: string;
		public dienGiai: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(vatTutaiLieuId?: number, tenTaiLieu?: string, uRLTaiLieu?: string, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.vatTutaiLieuId = vatTutaiLieuId;
				this.tenTaiLieu = tenTaiLieu;
				this.uRLTaiLieu = uRLTaiLieu;
				this.dienGiai = dienGiai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
