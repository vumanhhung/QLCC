export class DinhMucNuoc {
		public dinhMucNuocId: number;
		public congThucNuocId: number;
		public tenDinhMucNuoc: string;
		public soDau: number;
		public soCuoi: number;
		public gia: number;
		public dienGiai: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(dinhMucNuocId?: number, congThucNuocId?: number, tenDinhMucNuoc?: string, soDau?: number, soCuoi?: number, gia?: number, dienGiai?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.dinhMucNuocId = dinhMucNuocId;
				this.congThucNuocId = congThucNuocId;
				this.tenDinhMucNuoc = tenDinhMucNuoc;
				this.soDau = soDau;
				this.soCuoi = soCuoi;
				this.gia = gia;
				this.dienGiai = dienGiai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
