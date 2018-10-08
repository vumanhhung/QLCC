using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DAL.Models
{   
    public class VatTuPhieuDiChuyen
    {
        [Key]
        public int PhieuDiChuyenId { get; set; }
		public int? PhieuYeuCauVTId { get; set; }
		public int? DonViQLTS { get; set; }
		public DateTime? NgayYeuCau { get; set; }
		public string NguoiYeuCau { get; set; }
		public int? DonViYeuCau { get; set; }
		public string DaiDienDVYC { get; set; }
		public int? DonViNhan { get; set; }
		public string DaiDienDVN { get; set; }
		public string NoiDung { get; set; }
		public string GhiChu { get; set; }
		public int? TrangThai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
