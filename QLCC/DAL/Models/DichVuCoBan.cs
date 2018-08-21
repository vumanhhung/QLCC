using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class DichVuCoBan
    {
		public int DichVuCoBanId { get; set; }
		public string SoChungTu { get; set; }
		public DateTime? NgayChungTu { get; set; }
		public int? MatBangId { get; set; }
		public int? KhachHangId { get; set; }
		public int? LoaiDichVuId { get; set; }
		public int? DonViTinhId { get; set; }
		public decimal? DonGia { get; set; }
		public double? SoLuong { get; set; }
		public decimal? ThanhTien { get; set; }
		public DateTime? NgayThanhToan { get; set; }
		public int? KyThanhToan { get; set; }
		public decimal? TienThanhToan { get; set; }
		public decimal? TienTTQuyDoi { get; set; }
		public int? LoaiTienId { get; set; }
		public decimal? TyGia { get; set; }
		public DateTime? TuNgay { get; set; }
		public DateTime? DenNgay { get; set; }
		public string DienGiai { get; set; }
		public bool? LapLai { get; set; }
		public int? TrangThai { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgaySua { get; set; }
		public string NguoiSua { get; set; }
        public MatBang matBangs { get; set; }
        public KhachHang khachHangs { get; set; }
        public LoaiDichVu loaiDichVus { get; set; }
        public LoaiTien loaiTiens { get; set; }
        public DonViTinh donViTinhs { get; set; }
    }
}
