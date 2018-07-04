using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class TaiKhoanNganHang
    {
		public int TaiKhoanNganHangId { get; set; }
		public string ChuTaiKhoan { get; set; }
		public string SoTaiKhoan { get; set; }
		public int? NganHangId { get; set; }
		public string DienGiai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
        public NganHang nganhang { get; set; }

    }
}
