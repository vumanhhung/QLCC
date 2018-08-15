export class QuanHeChuHo {
		public quanHeChuHoId: number;
		public tenQuanHeChuHo: string;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(quanHeChuHoId?: number, tenQuanHeChuHo?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.quanHeChuHoId = quanHeChuHoId;
				this.tenQuanHeChuHo = tenQuanHeChuHo;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
