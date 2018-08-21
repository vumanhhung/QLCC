using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class PhieuThuChiTiet
    {
		public int PhieuThuChiTietId { get; set; }
		public int? PhieuThuId { get; set; }
		public int? MatBangId { get; set; }
		public int? LoaiDichVu { get; set; }
		public int? TheXeId { get; set; }
		public decimal? TongSoTien { get; set; }
		public DateTime? NgayNop { get; set; }
		public DateTime? HanTuNgay { get; set; }
		public DateTime? HanDenNgay { get; set; }
		public string GhiChu { get; set; }
		public int? Thang { get; set; }
		public int? Nam { get; set; }
		public string NguoiLap { get; set; }
		public DateTime? NgayLap { get; set; }
        public bool? KyCuoi { get; set; }
        public PhieuThu PhieuThu { get; set; }
    }
}
