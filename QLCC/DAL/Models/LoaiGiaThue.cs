using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class LoaiGiaThue
    {
		public int LoaiGiaThueId { get; set; }
		public string TenLoaiGia { get; set; }
		public decimal? DonGia { get; set; }
		public int? LoaiTienId { get; set; }
		public string DienGiai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
        public LoaiTien loaitien { get; set; }
    }
}
