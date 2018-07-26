using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class DinhMucNuoc
    {
		public int DinhMucNuocId { get; set; }
		public int? CongThucNuocId { get; set; }
		public string TenDinhMucNuoc { get; set; }
		public int? SoDau { get; set; }
		public int? SoCuoi { get; set; }
		public decimal? Gia { get; set; }
		public string DienGiai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
