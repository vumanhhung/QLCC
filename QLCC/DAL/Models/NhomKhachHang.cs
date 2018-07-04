using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class NhomKhachHang
    {
		public int NhomKhachHangId { get; set; }
		public string TenNhomKhachHang { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
