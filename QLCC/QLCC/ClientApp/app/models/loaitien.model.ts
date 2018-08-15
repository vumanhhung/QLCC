export class LoaiTien {
		public loaiTienId: number;
		public tenLoaiTien: string;
		public kyHieu: string;
		public tyGia: number;
		public nguoiNhap: string;
		public ngayNgap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(loaiTienId?: number, tenLoaiTien?: string, kyHieu?: string, tyGia?: number, nguoiNhap?: string, ngayNgap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.loaiTienId = loaiTienId;
				this.tenLoaiTien = tenLoaiTien;
				this.kyHieu = kyHieu;
				this.tyGia = tyGia;
				this.nguoiNhap = nguoiNhap;
				this.ngayNgap = ngayNgap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
