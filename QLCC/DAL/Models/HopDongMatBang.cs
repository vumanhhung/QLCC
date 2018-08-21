using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class HopDongMatBang
    {
		public int HopDongMatBangId { get; set; }
		public int? MatBangId { get; set; }
		public int? HopDongId { get; set; }
		public int? LoaiGiaThue { get; set; }
		public double? DienTich { get; set; }
		public decimal? GiaThue { get; set; }
		public decimal? PhiDichVu { get; set; }
		public decimal? ThanhTien { get; set; }
		public double? TyleVAT { get; set; }
		public decimal? TienVAT { get; set; }
		public double? TyLeCK { get; set; }
		public decimal? TienCK { get; set; }
		public decimal? TongTien { get; set; }
		public decimal? PhiSuaChua { get; set; }
		public string DienGiai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
