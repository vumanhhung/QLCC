using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class VatTuTaiLieu
    {
		public int VatTutaiLieuId { get; set; }
		public string TenTaiLieu { get; set; }
		public string URLTaiLieu { get; set; }
		public string DienGiai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
