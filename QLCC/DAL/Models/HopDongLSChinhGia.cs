using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class HopDongLSChinhGia
    {
		public int HopDongLSChinhGiaId { get; set; }
		public int? HopDongId { get; set; }
		public DateTime? NgayDieuChinh { get; set; }
		public string HangMucDieuChinh { get; set; }
		public decimal? GiaCu { get; set; }
		public double? Tyle { get; set; }
		public decimal? GiaMoi { get; set; }
		public string DienGiai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
    }
}
