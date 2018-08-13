using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class TheXe
    {
		public int TheXeId { get; set; }
		public string MaTheXe { get; set; }
		public int? MatBangId { get; set; }
		public int? KhachHangId { get; set; }
		public int? LoaiXeId { get; set; }
		public decimal? PhiGuiXe { get; set; }
		public string BienSoXe { get; set; }
		public string MauXe { get; set; }
		public string DoiXe { get; set; }
		public DateTime? NgayDangKy { get; set; }
		public string SoHD { get; set; }
		public string DienGiai { get; set; }
		public int? TrangThai { get; set; }
		public DateTime? NgayNgungSuDung { get; set; }
		public int? NgayThanhToan { get; set; }
		public int? KyThanhToan { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgaySua { get; set; }
		public string NguoiSua { get; set; }

        public LoaiXe LoaiXes { get; set; }

        public PhieuThuChiTiet PhieuThuChiTiets { get; set; }
    }
}
