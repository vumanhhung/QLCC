export class VatTuPhieuDiChuyen {
		public phieuDiChuyenId: number;
		public phieuYeuCauVTId: number;
		public donViQLTS: number;
		public ngayYeuCau: Date;
		public nguoiYeuCau: string;
		public donViYeuCau: number;
		public daiDienDVYC: string;
		public donViNhan: number;
		public daiDienDVN: string;
		public noiDung: string;
		public ghiChu: string;
		public trangThai: number;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(phieuDiChuyenId?: number, phieuYeuCauVTId?: number, donViQLTS?: number, ngayYeuCau?: Date, nguoiYeuCau?: string, donViYeuCau?: number, daiDienDVYC?: string, donViNhan?: number, daiDienDVN?: string, noiDung?: string, ghiChu?: string, trangThai?: number, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.phieuDiChuyenId = phieuDiChuyenId;
				this.phieuYeuCauVTId = phieuYeuCauVTId;
				this.donViQLTS = donViQLTS;
				this.ngayYeuCau = ngayYeuCau;
				this.nguoiYeuCau = nguoiYeuCau;
				this.donViYeuCau = donViYeuCau;
				this.daiDienDVYC = daiDienDVYC;
				this.donViNhan = donViNhan;
				this.daiDienDVN = daiDienDVN;
				this.noiDung = noiDung;
				this.ghiChu = ghiChu;
				this.trangThai = trangThai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
