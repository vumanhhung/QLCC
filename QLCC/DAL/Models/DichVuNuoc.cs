using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class DichVuNuoc
    {
		public int DichVuNuocId { get; set; }
		public int? MatBangId { get; set; }
		public int? KhachHangId { get; set; }
		public DateTime? TuNgay { get; set; }
		public DateTime? DenNgay { get; set; }
		public int? ChiSoCu { get; set; }
		public int? ChiSoMoi { get; set; }
		public int? SoTieuThu { get; set; }
		public decimal? ThanhTien { get; set; }
		public double? TyLeVAT { get; set; }
		public decimal? TienVAT { get; set; }
		public double? TyLeBVMT { get; set; }
		public decimal? TienBVMT { get; set; }
		public DateTime? NgayThanhToan { get; set; }
		public decimal? TienThanhToan { get; set; }
		public int? Thang { get; set; }
		public int? Nam { get; set; }
		public string DienGiai { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgaySua { get; set; }
		public string NguoiSua { get; set; }
    }
}
