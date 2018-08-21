using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class HopDongDichVu
    {
		public int HopDongDichVuId { get; set; }
		public int? HopDongId { get; set; }
		public int? LoaiDichVuId { get; set; }
		public decimal? DonGia { get; set; }
		public int? LoaiTienId { get; set; }
		public int? DonViTinhId { get; set; }
		public bool? MienPhi { get; set; }
		public string DienGiai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
