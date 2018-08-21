using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class HopDong
    {
		public int HopDongId { get; set; }
		public string TenHopDong { get; set; }
		public string SoHopDong { get; set; }
		public int? LoaiHopDong { get; set; }
		public string MauHopDong { get; set; }
		public int? KhachHangId { get; set; }
		public DateTime? NgayKy { get; set; }
		public DateTime? NgayHieuLuc { get; set; }
		public string ThoiHan { get; set; }
		public string KyThanhToan { get; set; }
		public string HanThanhToan { get; set; }
		public DateTime? NgayBanGiao { get; set; }
		public double? TyleDCGT { get; set; }
		public int? SoNamDCGT { get; set; }
		public double? MucDCGT { get; set; }
		public int? LoaiTienId { get; set; }
		public double? TyGia { get; set; }
		public decimal? GiaThue { get; set; }
		public decimal? TienCoc { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
