using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class QuanHeChuHo
    {
		public int QuanHeChuHoId { get; set; }
		public string TenQuanHeChuHo { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
        [JsonIgnore]
        public virtual ICollection<CuDan> cudans { get; set; }
    }
}
