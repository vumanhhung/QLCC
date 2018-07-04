using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class TrangThai
    {
		public int TrangThaiId { get; set; }
		public string TenTrangThai { get; set; }
		public string MauNen { get; set; }
		public int? ChoThue { get; set; }
		public string DienGiai { get; set; }
        [JsonIgnore]
        public virtual ICollection<MatBang> matbangs { get; set; }
    }
}
