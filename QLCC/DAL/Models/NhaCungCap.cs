using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class NhaCungCap
    {
		public int NhaCungCapId { get; set; }
		public string TenNhaCungCap { get; set; }
        public string DienGiai { get; set; }
        public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
