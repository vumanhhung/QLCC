using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class DonViTinh
    {
		public int DonViTinhId { get; set; }
		public string TenDonViTinh { get; set; }
		public string DienGiai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
