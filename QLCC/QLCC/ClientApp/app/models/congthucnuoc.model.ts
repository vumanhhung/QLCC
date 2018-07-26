export class CongThucNuoc {
		public congThucNuocId: number;
		public tenCongThucNuoc: string;
		public dienGiai: string;
		public status: boolean;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(congThucNuocId?: number, tenCongThucNuoc?: string, dienGiai?: string, status?: boolean, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.congThucNuocId = congThucNuocId;
				this.tenCongThucNuoc = tenCongThucNuoc;
				this.dienGiai = dienGiai;
				this.status = status;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
