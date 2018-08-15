// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

using DAL.Models;
using FluentValidation;
using QLCC.Helpers;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;


namespace QLCC.ViewModels
{
    public class UserViewModel
    {
        public string Id { get; set; }

        [Required(ErrorMessage = "Tên đăng nhập bắt buộc nhập"), StringLength(200, MinimumLength = 2, ErrorMessage = "Tên đăng nhập phải từ 2 đến 200 ký tự")]
        public string UserName { get; set; }

        public string FullName { get; set; }

        [Required(ErrorMessage = "Email bắt buộc nhập"), StringLength(200, ErrorMessage = "Email phải có tối đa 200 ký tự"), EmailAddress(ErrorMessage = "Địa chỉ email không hợp lệ")]
        public string Email { get; set; }

        public string JobTitle { get; set; }

        public string PhoneNumber { get; set; }

        public string Configuration { get; set; }

        public bool IsEnabled { get; set; }

        public bool IsLockedOut { get; set; }

        [MinimumCount(1, ErrorMessage = "Vai trò không thể để trống")]
        public string[] Roles { get; set; }
    }




    ////Todo: ***Using DataAnnotations for validations until Swashbuckle supports FluentValidation***
    //public class UserViewModelValidator : AbstractValidator<UserViewModel>
    //{
    //    public UserViewModelValidator()
    //    {
    //        //Validation logic here
    //        RuleFor(user => user.UserName).NotEmpty().WithMessage("Username cannot be empty");
    //        RuleFor(user => user.Email).EmailAddress().NotEmpty();
    //        RuleFor(user => user.Password).NotEmpty().WithMessage("Password cannot be empty").Length(4, 20);
    //    }
    //}
}
