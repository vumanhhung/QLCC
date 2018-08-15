using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class KhuVuc
    {
		public int KhuVucId { get; set; }
		public string TenKhuVuc { get; set; }
        public string DienGiai { get; set; }
        public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
