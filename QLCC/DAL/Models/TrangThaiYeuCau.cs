using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class TrangThaiYeuCau
    {
		public int TrangThaiYeuCauId { get; set; }
		public string TenTrangThaiYeuCau { get; set; }
		public string MauNen { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
