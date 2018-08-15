export class MucDoUuTien {
		public mucDoUuTienId: number;
		public tenMucDoUuTien: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(mucDoUuTienId?: number, tenMucDoUuTien?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.mucDoUuTienId = mucDoUuTienId;
				this.tenMucDoUuTien = tenMucDoUuTien;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
