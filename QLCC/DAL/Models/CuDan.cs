using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class CuDan
    {
		public long CuDanId { get; set; }
		public string HoTen { get; set; }
		public DateTime? NgaySinh { get; set; }
		public int? GioiTinh { get; set; }
		public string QueQuan { get; set; }
		public string QuocTich { get; set; }
		public string Cmt { get; set; }
		public string TonGiao { get; set; }
		public string NgheNghiep { get; set; }
		public string SoViSa { get; set; }
		public DateTime? NgayHetHanViSa { get; set; }
		public int? MatBangId { get; set; }
		public string ChuHo { get; set; }
		public int? QuanHeChuHoId { get; set; }
		public string SoHoKhau { get; set; }
		public DateTime? NgayCapHoKhau { get; set; }
		public string NoiCapHoKhau { get; set; }
		public DateTime? NgayChuyenDen { get; set; }
		public DateTime? NgayDi { get; set; }
		public string DienThoai { get; set; }
		public string Email { get; set; }
		public int? TrangThaiTamTru { get; set; }
		public DateTime? NgayDkTamTru { get; set; }
		public DateTime? NgayHetHanTamTru { get; set; }
		public int? TrangThaiCuDanId { get; set; }
		public string GhiChu { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }

        public MatBang matbangs { get; set; }
        public QuanHeChuHo quanhechuhos { get; set; }
        public TrangThaiCuDan trangthaicudans { get; set; }
    }
}
