using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class NguonTiepNhan
    {
		public int NguonTiepNhanId { get; set; }
		public string TenNguonTiepNhan { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
