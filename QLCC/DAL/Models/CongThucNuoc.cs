using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class CongThucNuoc
    {
		public int CongThucNuocId { get; set; }
		public string TenCongThucNuoc { get; set; }
		public string DienGiai { get; set; }
		public bool? Status { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
