using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class HopDongThanhToan
    {
		public int HopDongThanhToanId { get; set; }
		public int? HopDongId { get; set; }
		public int? LoaiPhiThanhToan { get; set; }
		public int? DotThanhToan { get; set; }
		public DateTime? TuNgay { get; set; }
		public DateTime? DenNgay { get; set; }
		public int? SoThang { get; set; }
		public decimal? SoTien { get; set; }
		public decimal? TienQuyDoi { get; set; }
		public bool? BaoLanh { get; set; }
		public string DienGiai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
