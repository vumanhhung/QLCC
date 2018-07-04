using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class ToaNha
    {
		public int ToaNhaId { get; set; }
		public int? CumToaNhaId { get; set; }
		public string TenKhoiNha { get; set; }
		public string TenVietTat { get; set; }
		public string MaKhoiNha { get; set; }
		public string DienGiai { get; set; }
        public string NguoiNhap { get; set; }
        public DateTime? NgayNhap { get; set; }
        public string NguoiSua { get; set; }
        public DateTime? NgaySua { get; set; }
        public CumToaNha cumtoanhas { get; set; }
        [JsonIgnore]
        public virtual ICollection<MatBang> matbangs { get; set; }
        [JsonIgnore]
        public virtual ICollection<TangLau> tanglaus { get; set; }
    }
}
