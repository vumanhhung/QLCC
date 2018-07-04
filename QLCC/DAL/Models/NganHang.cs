using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class NganHang
    {
		public int NganHangId { get; set; }
		public string TenNganHang { get; set; }
		public string DiaChi { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
        [JsonIgnore]
        public virtual ICollection<TaiKhoanNganHang> taikhoannganhangs { get; set; }

    }
}
