using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class VatTuDiChuyen
    {
		public int VatTuDiChuyenId { get; set; }
		public int? PhieuDiChuyenId { get; set; }
		public int? VatTuId { get; set; }
		public int? DonViTinhId { get; set; }
		public int? QuocTichId { get; set; }
		public int? SoLuong { get; set; }
		public string GhiChu { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }

        public VatTuPhieuDiChuyen vattuphieudichuyens { get; set; }
        public VatTu vattus { get; set; }
        public DonViTinh donvitinhs { get; set; }
        public QuocTich quoctichs { get; set; }
    }
}
