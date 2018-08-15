using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class PhongBan
    {
		public int PhongBanId { get; set; }
		public string TenPhongBan { get; set; }
		public int? ToaNhaId { get; set; }
		public string DienGiai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
        public ToaNha toanha { get; set; }
    }
}
