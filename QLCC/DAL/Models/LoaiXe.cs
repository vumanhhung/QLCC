using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class LoaiXe
    {
		public int LoaiXeId { get; set; }
		public string TenLoaiXe { get; set; }
		public string KyHieu { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }

        public TheXe thexes { get; set; }
    }
}
