export class LoaiDichVu {
		public loaiDichVuId: number;
		public tenLoaiDichVu: string;
		public moTa: string;
		public viTri: number;
		public maLoaiDichVuCha: number;
        public dichVuCoBan: boolean;
        public trangThai: number;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;

        constructor(loaiDichVuId?: number, tenLoaiDichVu?: string, moTa?: string, viTri?: number, maLoaiDichVuCha?: number, dichVuCoBan?: boolean, trangThai?: number, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.loaiDichVuId = loaiDichVuId;
				this.tenLoaiDichVu = tenLoaiDichVu;
				this.moTa = moTa;
				this.viTri = viTri;
				this.maLoaiDichVuCha = maLoaiDichVuCha;
				this.dichVuCoBan = dichVuCoBan;
				this.trangThai = trangThai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
