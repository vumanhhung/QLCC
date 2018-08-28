using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class VatTu
    {
		public int VatTuId { get; set; }
		public string MaVatTu { get; set; }
		public string TenVatTu { get; set; }
		public int? QuocTichId { get; set; }
		public int? LoaiHangId { get; set; }
		public int? HangSanXuatId { get; set; }
		public int? NhaCungCapId { get; set; }
		public int? DonViTinhId { get; set; }
		public int? PhongBanId { get; set; }
		public int? MaVatTuCha { get; set; }
		public string NguoiQuanLy { get; set; }
		public string MaVachNSX { get; set; }
		public int? LoaiTienId { get; set; }
		public decimal? GiaVatTu { get; set; }
		public string Model { get; set; }
		public string PartNumber { get; set; }
		public string SerialNumber { get; set; }
		public string ThongSoKyThuat { get; set; }
		public DateTime? NgayLap { get; set; }
		public int? NamSD { get; set; }
		public DateTime? NgayHHBaoHanh { get; set; }
		public double? KhauHao { get; set; }
		public string DonViKhauHao { get; set; }
		public int? TrangThai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }

        public QuocTich quocTichs { get; set; }
        public LoaiHang loaiHangs { get; set; }
        public HangSanXuat hangSanXuats { get; set; }
        public NhaCungCap nhaCungCaps { get; set; }
        public DonViTinh donViTinhs { get; set; }
        public PhongBan phongBans { get; set; }
        public LoaiTien loaiTiens { get; set; }
    }
}
