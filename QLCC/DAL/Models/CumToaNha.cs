using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class CumToaNha
    {
		public int CumToaNhaId { get; set; }
		public string TenCumToaNha { get; set; }
		public string TenVietTat { get; set; }
		public string MST { get; set; }
		public string SDT { get; set; }
		public string Fax { get; set; }
		public string Email { get; set; }
		public string DiaChi { get; set; }
		public string NguoiQuanLy { get; set; }
		public string STK { get; set; }
		public string NganHang { get; set; }
		public string Logo { get; set; }
		public string TenNguoiNhan { get; set; }
        public string NguoiNhap { get; set; }
        public DateTime? NgayNhap { get; set; }
        public string NguoiSua { get; set; }
        public DateTime? NgaySua { get; set; }
        [JsonIgnore]
        public virtual ICollection<MatBang> matbangs { get; set; }
        [JsonIgnore]
        public virtual ICollection<ToaNha> toanhas { get; set; }
    }
}
