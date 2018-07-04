// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

using QLCC.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QLCC.ViewModels
{
    public class RoleViewModel
    {
        public string Id { get; set; }

        [Required(ErrorMessage = "Tên vai trò là bắt buộc"), StringLength(200, MinimumLength = 2, ErrorMessage = "Tên vai trò phải có từ 2 đến 200 ký tự")]
        public string Name { get; set; }

        public string Description { get; set; }

        public int UsersCount { get; set; }

        public PermissionViewModel[] Permissions { get; set; }
    }
}
