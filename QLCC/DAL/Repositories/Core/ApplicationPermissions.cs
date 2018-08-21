// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.ObjectModel;

namespace DAL.Core
{
    public static class ApplicationPermissions
    {
        public static ReadOnlyCollection<ApplicationPermission> AllPermissions;


        public const string UsersPermissionGroupName = "Quản lý người dùng";
        public static ApplicationPermission ViewUsers = new ApplicationPermission("Danh sách người dùng", "users.view", UsersPermissionGroupName, "Quyền xem danh sách người dùng");
        public static ApplicationPermission ManageUsers = new ApplicationPermission("Thêm, sửa, xóa người dùng", "users.manage", UsersPermissionGroupName, "Quyền thêm mới, chỉnh sửa thông tin, xóa người dùng");

        public const string RolesPermissionGroupName = "Quản lý vai trò";
        public static ApplicationPermission ViewRoles = new ApplicationPermission("Danh sách vai trò", "roles.view", RolesPermissionGroupName, "Quyền xem danh sách vai trò");
        public static ApplicationPermission ManageRoles = new ApplicationPermission("Thêm, sửa, xóa vai trò", "roles.manage", RolesPermissionGroupName, "Quyền thêm mới, chỉnh sửa thông tin, xóa vai trò");
        public static ApplicationPermission AssignRoles = new ApplicationPermission("Gán vai trò người dùng", "roles.assign", RolesPermissionGroupName, "Quyền gán vai trò cho người dùng");

        public const string CumToaNha = "Quản lý cụm tòa nhà";
        public static ApplicationPermission XemCumToaNha = new ApplicationPermission("Danh sách cụm tòa nhà", "cumtoanha.view", CumToaNha, "Quyền xem danh sách cụm tòa nhà");
        public static ApplicationPermission ThemCumToaNha = new ApplicationPermission("Thêm mới cụm toa nhà", "cumtoanha.new", CumToaNha, "Quyền thêm mới cụm tòa nhà");
        public static ApplicationPermission SuaCumToaNha = new ApplicationPermission("Sửa cụm tòa nhà", "cumtoanha.edit", CumToaNha, "Quyền sửa cụm tòa nhà");
        public static ApplicationPermission XoaCumToaNha = new ApplicationPermission("Xóa cụm toa nhà", "cumtoanha.delete", CumToaNha, "Quyền xóa cụm tòa nhà");

        public const string ToaNha = "Quản lý tòa nhà";
        public static ApplicationPermission XemToaNha = new ApplicationPermission("Danh sách tòa nhà", "toanha.view", ToaNha, "Quyền xem danh sách tòa nhà");
        public static ApplicationPermission ThemToaNha = new ApplicationPermission("Thêm mới tòa nhà", "toanha.new", ToaNha, "Quyền thêm mới tòa nhà");
        public static ApplicationPermission SuaToaNha = new ApplicationPermission("Sửa tòa nhà", "toanha.edit", ToaNha, "Quyền sửa tòa nhà");
        public static ApplicationPermission XoaToaNha = new ApplicationPermission("Xóa tòa nhà", "toanha.delete", ToaNha, "Quyền xóa tòa nhà");

        public const string TangLau = "Quản lý tầng lầu";
        public static ApplicationPermission XemTangLau = new ApplicationPermission("Danh sách tầng lầu", "tanglau.view", TangLau, "Quyền xem danh sách tầng lầu");
        public static ApplicationPermission ThemTangLau = new ApplicationPermission("Thêm mới tầng lầu", "tanglau.new", TangLau, "Quyền thêm mới tầng lầu");
        public static ApplicationPermission SuaTangLau = new ApplicationPermission("Sửa tầng lầu", "tanglau.edit", TangLau, "Quyền sửa tầng lầu");
        public static ApplicationPermission XoaTangLau = new ApplicationPermission("Xóa tầng lầu", "tanglau.delete", TangLau, "Quyền xóa tầng lầu");

        public const string TrangThai = "Quản lý trạng thái mặt bằng";
        public static ApplicationPermission XemTrangThai = new ApplicationPermission("Danh sách trạng thái mặt bằng", "trangthai.view", TrangThai, "Quyền xem danh sách trạng thái mặt bằng");
        public static ApplicationPermission ThemTrangThai = new ApplicationPermission("Thêm mới trạng thái mặt bằng", "trangthai.new", TrangThai, "Quyền thêm mới trạng thái mặt bằng");
        public static ApplicationPermission SuaTrangThai = new ApplicationPermission("Sửa trạng thái mặt bằng", "trangthai.edit", TrangThai, "Quyền sửa trạng thái mặt bằng");
        public static ApplicationPermission XoaTrangThai = new ApplicationPermission("Xóa trạng thái mặt bằng", "trangthai.delete", TrangThai, "Quyền xóa trạng thái mặt bằng");

        public const string LoaiMatBang = "Quản lý loại mặt bằng";
        public static ApplicationPermission XemLoaiMatBang = new ApplicationPermission("Danh sách loại mặt bằng", "loaimatbang.view", LoaiMatBang, "Quyền xem danh sách loại mặt bằng");
        public static ApplicationPermission ThemLoaiMatBang = new ApplicationPermission("Thêm mới loại mặt bằng", "loaimatbang.new", LoaiMatBang, "Quyền thêm mới loại mặt bằng");
        public static ApplicationPermission SuaLoaiMatBang = new ApplicationPermission("Sửa loại mặt bằng", "loaimatbang.edit", LoaiMatBang, "Quyền sửa loại mặt bằng");
        public static ApplicationPermission XoaLoaiMatBang = new ApplicationPermission("Xóa loại mặt bằng", "loaimatbang.delete", LoaiMatBang, "Quyền xóa loại mặt bằng");

        public const string KhuVuc = "Quản lý khu vực";
        public static ApplicationPermission XemKhuVuc = new ApplicationPermission("Danh sách khu vực", "khuvuc.view", KhuVuc, "Quyền xem danh sách khu vực");
        public static ApplicationPermission ThemKhuVuc = new ApplicationPermission("Thêm mới khu vực", "khuvuc.new", KhuVuc, "Quyền thêm mới khu vực");
        public static ApplicationPermission SuaKhuVuc = new ApplicationPermission("Sửa khu vực", "khuvuc.edit", KhuVuc, "Quyền sửa khu vực");
        public static ApplicationPermission XoaKhuVuc = new ApplicationPermission("Xóa khu vực", "khuvuc.delete", KhuVuc, "Quyền xóa khu vực");

        public const string NhaCungCap = "Quản lý nhà cung cấp";
        public static ApplicationPermission XemNhaCungCap = new ApplicationPermission("Danh sách nhà cung cấp", "nhacungcap.view", NhaCungCap, "Quyền xem danh sách nhà cung cấp");
        public static ApplicationPermission ThemNhaCungCap = new ApplicationPermission("Thêm mới nhà cung cấp", "nhacungcap.new", NhaCungCap, "Quyền thêm mới nhà cung cấp");
        public static ApplicationPermission SuaNhaCungCap = new ApplicationPermission("Sửa nhà cung cấp", "nhacungcap.edit", NhaCungCap, "Quyền sửa nhà cung cấp");
        public static ApplicationPermission XoaNhaCungCap = new ApplicationPermission("Xóa nhà cung cấp", "nhacungcap.delete", NhaCungCap, "Quyền xóa nhà cung cấp");

        public const string LoaiTien = "Quản lý loại tiền";
        public static ApplicationPermission XemLoaiTien = new ApplicationPermission("Danh sách loại tiền", "loaitien.view", LoaiTien, "Quyền xem danh sách loại tiền");
        public static ApplicationPermission ThemLoaiTien = new ApplicationPermission("Thêm mới loại tiền", "loaitien.new", LoaiTien, "Quyền thêm mới loại tiền");
        public static ApplicationPermission SuaLoaiTien = new ApplicationPermission("Sửa loại tiền", "loaitien.edit", LoaiTien, "Quyền sửa loại tiền");
        public static ApplicationPermission XoaLoaiTien = new ApplicationPermission("Xóa loại tiền", "loaitien.delete", LoaiTien, "Quyền xóa loại tiền");

        public const string LoaiGiaThue = "Quản lý loại giá thuê";
        public static ApplicationPermission XemLoaiGiaThue = new ApplicationPermission("Danh sách loại giá thuê", "loaigiathue.view", LoaiGiaThue, "Quyền xem danh sách loại giá thuê");
        public static ApplicationPermission ThemLoaiGiaThue = new ApplicationPermission("Thêm mới loại giá thuê", "loaigiathue.new", LoaiGiaThue, "Quyền thêm mới loại giá thuê");
        public static ApplicationPermission SuaLoaiGiaThue = new ApplicationPermission("Sửa loại giá thuê", "loaigiathue.edit", LoaiGiaThue, "Quyền sửa loại giá thuê");
        public static ApplicationPermission XoaLoaiGiaThue = new ApplicationPermission("Xóa loại giá thuê", "loaigiathue.delete", LoaiGiaThue, "Quyền xóa loại giá thuê");

        public const string DonViTinh = "Quản lý đơn vị tính";
        public static ApplicationPermission XemDonViTinh = new ApplicationPermission("Danh sách đơn vị tính", "donvitinh.view", DonViTinh, "Quyền xem danh sách đơn vị tính");
        public static ApplicationPermission ThemDonViTinh = new ApplicationPermission("Thêm mới đơn vị tính", "donvitinh.new", DonViTinh, "Quyền thêm mới đơn vị tính");
        public static ApplicationPermission SuaDonViTinh = new ApplicationPermission("Sửa đơn vị tính", "donvitinh.edit", DonViTinh, "Quyền sửa đơn vị tính");
        public static ApplicationPermission XoaDonViTinh = new ApplicationPermission("Xóa đơn vị tính", "donvitinh.delete", DonViTinh, "Quyền xóa đơn vị tính");

        public const string TaiKhoanNganHang = "Quản lý tai khoản ngân hàng";
        public static ApplicationPermission XemTaiKhoanNganHang = new ApplicationPermission("Danh sách tai khoản ngân hàng", "taikhoannganhang.view", TaiKhoanNganHang, "Quyền xem danh sách tai khoản ngân hàng");
        public static ApplicationPermission ThemTaiKhoanNganHang = new ApplicationPermission("Thêm mới tai khoản ngân hàng", "taikhoannganhang.new", TaiKhoanNganHang, "Quyền thêm mới tai khoản ngân hàng");
        public static ApplicationPermission SuaTaiKhoanNganHang = new ApplicationPermission("Sửa tai khoản ngân hàng", "taikhoannganhang.edit", TaiKhoanNganHang, "Quyền sửa tai khoản ngân hàng");
        public static ApplicationPermission XoaTaiKhoanNganHang = new ApplicationPermission("Xóa tai khoản ngân hàng", "taikhoannganhang.delete", TaiKhoanNganHang, "Quyền xóa tai khoản ngân hàng");

        public const string QuocTich = "Quản lý quốc tịch";
        public static ApplicationPermission XemQuocTich = new ApplicationPermission("Danh sách quốc tịch", "quoctich.view", QuocTich, "Quyền xem danh sách quốc tịch");
        public static ApplicationPermission ThemQuocTich = new ApplicationPermission("Thêm mới quốc tịch", "quoctich.new", QuocTich, "Quyền thêm mới quốc tịch");
        public static ApplicationPermission SuaQuocTich = new ApplicationPermission("Sửa quốc tịch", "quoctich.edit", QuocTich, "Quyền sửa quốc tịch");
        public static ApplicationPermission XoaQuocTich = new ApplicationPermission("Xóa quốc tịch", "quoctich.delete", QuocTich, "Quyền xóa quốc tịch");

        public const string NganHang = "Quản lý ngân hàng";
        public static ApplicationPermission XemNganHang = new ApplicationPermission("Danh sách ngân hàng", "nganhang.view", NganHang, "Quyền xem danh sách ngân hàng");
        public static ApplicationPermission ThemNganHang = new ApplicationPermission("Thêm mới ngân hàng", "nganhang.new", NganHang, "Quyền thêm mới ngân hàng");
        public static ApplicationPermission SuaNganHang = new ApplicationPermission("Sửa ngân hàng", "nganhang.edit", NganHang, "Quyền sửa ngân hàng");
        public static ApplicationPermission XoaNganHang = new ApplicationPermission("Xóa ngân hàng", "nganhang.delete", NganHang, "Quyền xóa ngân hàng");

        public const string LoaiYeuCau = "Quản lý loại yêu cầu";
        public static ApplicationPermission XemLoaiYeuCau = new ApplicationPermission("Danh sách loại yêu cầu", "loaiyeucau.view", LoaiYeuCau, "Quyền xem danh sách loại yêu cầu");
        public static ApplicationPermission ThemLoaiYeuCau = new ApplicationPermission("Thêm mới loại yêu cầu", "loaiyeucau.new", LoaiYeuCau, "Quyền thêm mới loại yêu cầu");
        public static ApplicationPermission SuaLoaiYeuCau = new ApplicationPermission("Sửa loại yêu cầu", "loaiyeucau.edit", LoaiYeuCau, "Quyền sửa loại yêu cầu");
        public static ApplicationPermission XoaLoaiYeuCau = new ApplicationPermission("Xóa loại yêu cầu", "loaiyeucau.delete", LoaiYeuCau, "Quyền xóa loại yêu cầu");

        public const string MatBang = "Quản lý mặt bằng";
        public static ApplicationPermission XemMatBang = new ApplicationPermission("Danh sách mặt bằng", "matbang.view", MatBang, "Quyền xem danh sách mặt bằng");
        public static ApplicationPermission ThemMatBang = new ApplicationPermission("Thêm mới mặt bằng", "matbang.new", MatBang, "Quyền thêm mới mặt bằng");
        public static ApplicationPermission SuaMatBang = new ApplicationPermission("Sửa mặt bằng", "matbang.edit", MatBang, "Quyền sửa mặt bằng");
        public static ApplicationPermission XoaMatBang = new ApplicationPermission("Xóa mặt bằng", "matbang.delete", MatBang, "Quyền xóa mặt bằng");


        static ApplicationPermissions()
        {
            List<ApplicationPermission> allPermissions = new List<ApplicationPermission>()
            {
                ViewUsers,
                ManageUsers,

                ViewRoles,
                ManageRoles,
                AssignRoles,

                XemLoaiYeuCau,ThemLoaiYeuCau,SuaLoaiYeuCau,XoaLoaiYeuCau,
                XemNganHang,ThemNganHang,SuaNganHang,XoaNganHang,
                XemQuocTich,ThemQuocTich,SuaQuocTich,XoaQuocTich,
                XemCumToaNha,ThemCumToaNha,SuaCumToaNha,XoaCumToaNha,
                XemToaNha,ThemToaNha,SuaToaNha,XoaToaNha,
                XemTangLau,ThemTangLau,SuaTangLau,XoaTangLau,
                XemTrangThai,ThemTrangThai,SuaTrangThai,XoaTrangThai,
                XemLoaiMatBang,ThemLoaiMatBang,SuaLoaiMatBang,XoaLoaiMatBang,
                XemNhaCungCap,ThemNhaCungCap,SuaNhaCungCap,XoaNhaCungCap,
                XemLoaiTien,ThemLoaiTien,SuaLoaiTien,XoaLoaiTien,
                XemLoaiGiaThue,ThemLoaiGiaThue,SuaLoaiGiaThue,XoaLoaiGiaThue,
                XemDonViTinh,ThemDonViTinh,SuaDonViTinh,XoaDonViTinh,
                XemTaiKhoanNganHang,ThemTaiKhoanNganHang,SuaTaiKhoanNganHang,XoaTaiKhoanNganHang,
                XemMatBang,ThemMatBang,SuaMatBang,XoaMatBang,
                XemKhuVuc,ThemKhuVuc,SuaKhuVuc,XoaKhuVuc
            };

            AllPermissions = allPermissions.AsReadOnly();
        }

        public static ApplicationPermission GetPermissionByName(string permissionName)
        {
            return AllPermissions.Where(p => p.Name == permissionName).FirstOrDefault();
        }

        public static ApplicationPermission GetPermissionByValue(string permissionValue)
        {
            return AllPermissions.Where(p => p.Value == permissionValue).FirstOrDefault();
        }

        public static string[] GetAllPermissionValues()
        {
            return AllPermissions.Select(p => p.Value).ToArray();
        }

        public static string[] GetAdministrativePermissionValues()
        {
            return new string[] { ManageUsers, ManageRoles, AssignRoles };
        }
    }





    public class ApplicationPermission
    {
        public ApplicationPermission()
        { }

        public ApplicationPermission(string name, string value, string groupName, string description = null)
        {
            Name = name;
            Value = value;
            GroupName = groupName;
            Description = description;
        }



        public string Name { get; set; }
        public string Value { get; set; }
        public string GroupName { get; set; }
        public string Description { get; set; }


        public override string ToString()
        {
            return Value;
        }


        public static implicit operator string(ApplicationPermission permission)
        {
            return permission.Value;
        }
    }
}
