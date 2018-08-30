using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class VatTuHinhAnh
    {
		public int VatTuHinhAnhId { get; set; }
		public int VatTuId { get; set; }
		public string TenHinhAnh { get; set; }
		public string URLHinhAnh { get; set; }
		public string DienGiai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
