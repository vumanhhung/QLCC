using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class PhieuThu
    {
        public int PhieuThuId { get; set; }
        public string MaPhieuThu { get; set; }
        public int? MatBangId { get; set; }
        public int? LoaiDichVu { get; set; }
        public decimal? TongSoTien { get; set; }
        public int? TrangThai { get; set; }
        public string GhiChu { get; set; }
        public int? SoLanInHoaDon { get; set; }
        public string NguoiLap { get; set; }
        public DateTime? NgayLap { get; set; }
        public string MaBarcode { get; set; }
        public string MaQRCode { get; set; }
    }
}
