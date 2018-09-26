using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DAL.Models
{   
    public class VatTuYeuCau
    {
        [Key]
		public int YeuCauvatTuId { get; set; }
		public int? PhieuYeuCauVTId { get; set; }
		public int? VatTuId { get; set; }
		public int? DonViTinhId { get; set; }
		public int? QuocTichId { get; set; }
		public int? SoLuong { get; set; }
		public string GhiChu { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
        public VatTu vattus { get; set; }
    }
}
