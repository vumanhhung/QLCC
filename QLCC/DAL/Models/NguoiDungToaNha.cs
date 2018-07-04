using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class NguoiDungToaNha
    {
		public int NguoiDungToaNhaId { get; set; }
		public int? CumToaNhaId { get; set; }
		public int? ToaNhaId { get; set; }
		public string NguoiDungId { get; set; }
		public string UserName { get; set; }
		public string DienGiai { get; set; }
        public ToaNha ToaNha { get; set; }
    }
}
