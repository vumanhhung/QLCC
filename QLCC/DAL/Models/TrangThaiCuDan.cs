using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class TrangThaiCuDan
    {
		public int TrangThaiCuDanId { get; set; }
		public string TenTrangThaiCuDan { get; set; }
		public string MauNen { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
        [JsonIgnore]
        public virtual ICollection<CuDan> cudans { get; set; }
    }
}
