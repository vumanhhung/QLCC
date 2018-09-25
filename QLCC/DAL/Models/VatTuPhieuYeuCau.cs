using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class VatTuPhieuYeuCau
    {
		public int PhieuYeuCauVTId { get; set; }
		public string NguoiYeuCau { get; set; }
		public int? PhongBanId { get; set; }
		public int? ToaNhaId { get; set; }
		public string MucDichSuDung { get; set; }
		public string NguoiTiepNhan { get; set; }
		public string DienGiai { get; set; }
		public string NguoiDuyet { get; set; }
		public int? TrangThai { get; set; }
    }
}
