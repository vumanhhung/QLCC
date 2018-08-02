using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class MatBang
    {
		public int MatBangId { get; set; }
		public int? CumToaNhaId { get; set; }
		public int? ToaNhaId { get; set; }
		public int? TangLauId { get; set; }
		public int? TrangThaiId { get; set; }
		public int? LoaiMatBangId { get; set; }
		public string MaMatBang { get; set; }
		public string TenMatBang { get; set; }
		public double? DienTich { get; set; }
		public decimal? GiaThue { get; set; }
		public string LoaiTien { get; set; }
		public int? CaNhan { get; set; }
		public int? GiaoChiaKhoa { get; set; }
		public DateTime? NgaybanGiao { get; set; }
		public string DienGiai { get; set; }
		public int? ChuSoHuu { get; set; }
		public int? KhachThue { get; set; }
        public string NguoiNhap { get; set; }
        public DateTime? NgayNhap { get; set; }
        public string NguoiSua { get; set; }
        public DateTime? NgaySua { get; set; }
        public ToaNha toanha { get; set; }
        public TangLau tanglau { get; set; }
        public CumToaNha cumtoanha { get; set; }
        public TrangThai trangthai { get; set; }
        public LoaiMatBang loaimatbang { get; set; }
        [JsonIgnore]
        public virtual ICollection<CuDan> cudans { get; set; }
    }
}
