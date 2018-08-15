export class NguonTiepNhan {
		public nguonTiepNhanId: number;
		public tenNguonTiepNhan: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(nguonTiepNhanId?: number, tenNguonTiepNhan?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.nguonTiepNhanId = nguonTiepNhanId;
				this.tenNguonTiepNhan = tenNguonTiepNhan;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
