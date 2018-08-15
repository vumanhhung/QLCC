using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class LoaiMatBang
    {
		public int LoaiMatBangId { get; set; }
		public string TenLoaiMatBang { get; set; }
        public string DienGiai { get; set; }
        public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
        [JsonIgnore]
        public virtual ICollection<MatBang> matbang { get; set; }
    }
}
