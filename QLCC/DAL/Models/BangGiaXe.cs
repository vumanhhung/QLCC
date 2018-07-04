using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class BangGiaXe
    {
		public int BangGiaXeId { get; set; }
		public int? ToaNhaId { get; set; }
		public int? LoaiXeId { get; set; }
		public int? DinhMuc { get; set; }
		public decimal? GiaThang { get; set; }
		public decimal? GiaNgay { get; set; }
		public string DienGiai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
