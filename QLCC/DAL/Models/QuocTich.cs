using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class QuocTich
    {
		public int QuocTichId { get; set; }
		public string TenNuoc { get; set; }
		public string KyHieu { get; set; }
        public string DienGiai { get; set; }
        public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }

    }
}
