using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class TangLau
    {
		public int TangLauId { get; set; }
		public int? ToaNhaId { get; set; }
		public string TenTangLau { get; set; }
		public string DienGiai { get; set; }
        public string NguoiNhap { get; set; }
        public DateTime? NgayNhap { get; set; }
        public string NguoiSua { get; set; }
        public DateTime? NgaySua { get; set; }
        public ToaNha toanhas { get; set; }
    }
}
