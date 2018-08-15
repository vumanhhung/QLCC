using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class YeuCau
    {
        public int YeuCauId { get; set; }
        public string SoYeuCau { get; set; }
        public int? MatBangId { get; set; }
        public string NguoiGui { get; set; }
        public string SoDienThoai { get; set; }
        public string NoiDung { get; set; }
        public DateTime? ThoiGianHen { get; set; }
        public int? MucDoUuTienId { get; set; }
        public int? NguonTiepNhanId { get; set; }
        public string TieuDe { get; set; }
        public int? PhongBanId { get; set; }
        public int? TrangThaiYeuCauId { get; set; }
        public long? CuDanId { get; set; }
        public int? LoaiYeuCauId { get; set; }
        public MatBang MatBang { get; set; }
        public CuDan CuDan { get; set; }
        public MucDoUuTien MucDoUuTien { get; set; }
        public PhongBan PhongBan { get; set; }
        public TrangThaiYeuCau TrangThaiYeuCau { get; set; }
        public LoaiYeuCau LoaiYeuCau { get; set; }
        public NguonTiepNhan NguonTiepNhan { get; set; }
    }
}
