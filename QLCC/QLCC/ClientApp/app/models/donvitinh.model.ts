export class DonViTinh {
		public donViTinhId: number;
		public tenDonViTinh: string;
		public dienGiai: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(donViTinhId?: number, tenDonViTinh?: string, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.donViTinhId = donViTinhId;
				this.tenDonViTinh = tenDonViTinh;
				this.dienGiai = dienGiai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
