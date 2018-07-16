using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class LoaiDichVu
    {
		public int LoaiDichVuId { get; set; }
		public string TenLoaiDichVu { get; set; }
		public string MoTa { get; set; }
		public int? ViTri { get; set; }
		public int? MaLoaiDichVuCha { get; set; }
		public bool? DichVuCoBan { get; set; }
		public byte? TrangThai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
