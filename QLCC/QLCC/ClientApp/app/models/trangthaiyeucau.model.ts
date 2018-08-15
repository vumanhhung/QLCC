export class TrangThaiYeuCau {
		public trangThaiYeuCauId: number;
		public tenTrangThaiYeuCau: string;
		public mauNen: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(trangThaiYeuCauId?: number, tenTrangThaiYeuCau?: string, mauNen?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.trangThaiYeuCauId = trangThaiYeuCauId;
				this.tenTrangThaiYeuCau = tenTrangThaiYeuCau;
				this.mauNen = mauNen;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
