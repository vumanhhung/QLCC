using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class KhachHang
    {
        public int KhachHangId { get; set; }
        public string HoDem { get; set; }
        public string Ten { get; set; }
        public string TenDayDu
        {
            get
            {
                return this.KhDoanhNghiep == true ? this.TenCongTy : this.HoDem + " " + this.Ten;
            }
        }
        public int? GioiTinh { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public string Mst { get; set; }
        public string Cmt { get; set; }
        public DateTime? NgayCap { get; set; }
        public string NoiCap { get; set; }
        public string ThuongTru { get; set; }
        public string DiaChi { get; set; }
        public string TkNganHang { get; set; }
        public string QuocTich { get; set; }
        public bool? KhDoanhNghiep { get; set; }
        public string TenVietTat { get; set; }
        public string TenCongTy { get; set; }
        public string DiaChiCongTy { get; set; }
        public string DienThoaiCongTy { get; set; }
        public string Fax { get; set; }
        public string NguoiDaiDien { get; set; }
        public string ChucVu { get; set; }
        public string MstCongTy { get; set; }
        public string SoDkKinhDoanh { get; set; }
        public DateTime? NgayDkKinhDoanh { get; set; }
        public string NoiDkKinhDoanh { get; set; }
        public string TkNganHangCongTy { get; set; }
        public string NganHang { get; set; }
        public int? NhomKhachHangId { get; set; }
        public NhomKhachHang NhomKhachHang { get; set; }


    }
}
