using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class BangGiaDichVuCoBan
    {
        public int BangGiaDichVuCoBanId { get; set; }
        public int? LoaiDichVuId { get; set; }
        public int? LoaiTienId { get; set; }
        public int? DonViTinhId { get; set; }
        public int? ToaNhaId { get; set; }
        public decimal? DonGia { get; set; }
        public string DienGiai { get; set; }
        public string NguoiNhap { get; set; }
        public DateTime? NgayNhap { get; set; }
        public string NguoiSua { get; set; }
        public DateTime? NgaySua { get; set; }
        public LoaiDichVu LoaiDichVu { get; set; }
        public LoaiTien LoaiTien { get; set; }
        public DonViTinh DonViTinh { get; set; }
    }
}
