using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class LoaiTien
    {
		public int LoaiTienId { get; set; }
		public string TenLoaiTien { get; set; }
		public string KyHieu { get; set; }
		public decimal? TyGia { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNgap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
        [JsonIgnore]
        public virtual ICollection<LoaiGiaThue> loaigiathues { get; set; }
    }
}
