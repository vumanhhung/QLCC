using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class HopDongPhuLuc
    {
		public int HopDongPhuLucId { get; set; }
		public int? HopDongId { get; set; }
		public string SoPhuLuc { get; set; }
		public int? KhachHangId { get; set; }
		public int? LoaiTienId { get; set; }
		public double? TyGia { get; set; }
		public decimal? GiaThue { get; set; }
		public int? KyThanhToan { get; set; }
		public decimal? ThanhTien { get; set; }
		public decimal? TienQuyDoi { get; set; }
		public DateTime? NgayThanhToan { get; set; }
		public DateTime? NgayKy { get; set; }
		public int? ThoiHan { get; set; }
		public DateTime? NgayHetHan { get; set; }
		public DateTime? NgayBanGiao { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
