export class TrangThaiCuDan {
		public trangThaiCuDanId: number;
		public tenTrangThaiCuDan: string;
		public mauNen: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(trangThaiCuDanId?: number, tenTrangThaiCuDan?: string, mauNen?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.trangThaiCuDanId = trangThaiCuDanId;
				this.tenTrangThaiCuDan = tenTrangThaiCuDan;
				this.mauNen = mauNen;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
