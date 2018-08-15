// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

export type PermissionNames =
    "View Users" | "Manage Users" |
    "View Roles" | "Manage Roles" | "Assign Roles";

export type PermissionValues =
    "users.view" | "users.manage" |
    "roles.view" | "roles.manage" | "roles.assign" |
    "trangthai.view" | "trangthai.new" | "trangthai.edit" | "trangthai.delete" |
    "loaimatbang.view" | "loaimatbang.new" | "loaimatbang.edit" | "loaimatbang.delete" |
    "khuvuc.view" | "khuvuc.new" | "khuvuc.edit" | "khuvuc.delete" |
    "nhacungcap.view" | "nhacungcap.new" | "nhacungcap.edit" | "nhacungcap.delete" |
    "cumtoanha.view" | "cumtoanha.new" | "cumtoanha.edit" | "cumtoanha.delete" |
    "toanha.view" | "toanha.new" | "toanha.edit" | "toanha.delete" |
    "loaitien.view" | "loaitien.new" | "loaitien.edit" | "loaitien.delete" |
    "loaigiathue.view" | "loaigiathue.new" | "loaigiathue.edit" | "loaigiathue.delete" |
    "donvitinh.view" | "donvitinh.new" | "donvitinh.edit" | "donvitinh.delete" |
    "taikhoannganhang.view" | "taikhoannganhang.new" | "taikhoannganhang.edit" | "taikhoannganhang.delete" |
    "quoctich.view" | "quoctich.new" | "quoctich.edit" | "quoctich.delete" |
    "nganhang.view" | "nganhang.new" | "nganhang.edit" | "nganhang.delete" |
    "loaiyeucau.view" | "loaiyeucau.new" | "loaiyeucau.edit" | "loaiyeucau.delete" |
    "matbang.view" | "matbang.new" | "matbang.edit" | "matbang.delete" |
    "tanglau.view" | "tanglau.new" | "tanglau.edit" | "tanglau.delete";

export class Permission {

    public static readonly viewUsersPermission: PermissionValues = "users.view";
    public static readonly manageUsersPermission: PermissionValues = "users.manage";

    public static readonly viewRolesPermission: PermissionValues = "roles.view";
    public static readonly manageRolesPermission: PermissionValues = "roles.manage";
    public static readonly assignRolesPermission: PermissionValues = "roles.assign";

    public static readonly xemLoaiYeuCauPermission: PermissionValues = "loaiyeucau.view";
    public static readonly suaLoaiYeuCauPermission: PermissionValues = "loaiyeucau.new";
    public static readonly themLoaiYeuCauPermission: PermissionValues = "loaiyeucau.edit";
    public static readonly xoaLoaiYeuCauPermission: PermissionValues = "loaiyeucau.delete";

    public static readonly xemNganHangPermission: PermissionValues = "nganhang.view";
    public static readonly suaNganHangPermission: PermissionValues = "nganhang.new";
    public static readonly themNganHangPermission: PermissionValues = "nganhang.edit";
    public static readonly xoaNganHangPermission: PermissionValues = "nganhang.delete";

    public static readonly xemQuocTichPermission: PermissionValues = "quoctich.view";
    public static readonly suaQuocTichPermission: PermissionValues = "quoctich.new";
    public static readonly themQuocTichPermission: PermissionValues = "quoctich.edit";
    public static readonly xoaQuocTichPermission: PermissionValues = "quoctich.delete";

    public static readonly xemTaiKhoanNganHangPermission: PermissionValues = "taikhoannganhang.view";
    public static readonly suaTaiKhoanNganHangPermission: PermissionValues = "taikhoannganhang.new";
    public static readonly themTaiKhoanNganHangPermission: PermissionValues = "taikhoannganhang.edit";
    public static readonly xoaTaiKhoanNganHangPermission: PermissionValues = "taikhoannganhang.delete";

    public static readonly xemTrangThaiPermission: PermissionValues = "trangthai.view";
    public static readonly suaTrangThaiPermission: PermissionValues = "trangthai.new";
    public static readonly themTrangThaiPermission: PermissionValues = "trangthai.edit";
    public static readonly xoaTrangThaiPermission: PermissionValues = "trangthai.delete";

    public static readonly xemLoaiMatBangPermission: PermissionValues = "loaimatbang.view";
    public static readonly suaLoaiMatBangPermission: PermissionValues = "loaimatbang.new";
    public static readonly themLoaiMatBangPermission: PermissionValues = "loaimatbang.edit";
    public static readonly xoaLoaiMatBangPermission: PermissionValues = "loaimatbang.delete";

    public static readonly xemKhuVucPermission: PermissionValues = "khuvuc.view";
    public static readonly suaKhuVucPermission: PermissionValues = "khuvuc.new";
    public static readonly themKhuVucPermission: PermissionValues = "khuvuc.edit";
    public static readonly xoaKhuVucPermission: PermissionValues = "khuvuc.delete";

    public static readonly xemCumToaNhaPermission: PermissionValues = "cumtoanha.view";
    public static readonly themCumToaNhaPermission: PermissionValues = "cumtoanha.new";
    public static readonly suaCumToaNhaPermission: PermissionValues = "cumtoanha.edit";
    public static readonly xoaCumToaNhaPermission: PermissionValues = "cumtoanha.delete";

    public static readonly xemToaNhaPermission: PermissionValues = "toanha.view";
    public static readonly suaToaNhaPermission: PermissionValues = "toanha.new";
    public static readonly themToaNhaPermission: PermissionValues = "toanha.edit";
    public static readonly xoaToaNhaPermission: PermissionValues = "toanha.delete";

    public static readonly xemTangLauPermission: PermissionValues = "tanglau.view";
    public static readonly suaTangLauPermission: PermissionValues = "tanglau.new";
    public static readonly themTangLauPermission: PermissionValues = "tanglau.edit";
    public static readonly xoaTangLauPermission: PermissionValues = "tanglau.delete";

    public static readonly xemNhaCungCapPermission: PermissionValues = "nhacungcap.view";
    public static readonly suaNhaCungCapPermission: PermissionValues = "nhacungcap.new";
    public static readonly themNhaCungCapPermission: PermissionValues = "nhacungcap.edit";
    public static readonly xoaNhaCungCapPermission: PermissionValues = "nhacungcap.delete";

    public static readonly xemLoaiTienPermission: PermissionValues = "loaitien.view";
    public static readonly suaLoaiTienPermission: PermissionValues = "loaitien.new";
    public static readonly themLoaiTienPermission: PermissionValues = "loaitien.edit";
    public static readonly xoaLoaiTienPermission: PermissionValues = "loaitien.delete";

    public static readonly xemLoaiGiaThuePermission: PermissionValues = "loaigiathue.view";
    public static readonly suaLoaiGiaThuePermission: PermissionValues = "loaigiathue.new";
    public static readonly themLoaiGiaThuePermission: PermissionValues = "loaigiathue.edit";
    public static readonly xoaLoaiGiaThuePermission: PermissionValues = "loaigiathue.delete";

    public static readonly xemDonViTinhPermission: PermissionValues = "donvitinh.view";
    public static readonly suaDonViTinhPermission: PermissionValues = "donvitinh.new";
    public static readonly themDonViTinhPermission: PermissionValues = "donvitinh.edit";
    public static readonly xoaDonViTinhPermission: PermissionValues = "donvitinh.delete";

    public static readonly xemMatBangPermission: PermissionValues = "matbang.view";
    public static readonly suaMatBangPermission: PermissionValues = "matbang.new";
    public static readonly themMatBangPermission: PermissionValues = "matbang.edit";
    public static readonly xoaMatBangPermission: PermissionValues = "matbang.delete";


    constructor(name?: PermissionNames, value?: PermissionValues, groupName?: string, description?: string) {
        this.name = name;
        this.value = value;
        this.groupName = groupName;
        this.description = description;
    }

    public name: PermissionNames;
    public value: PermissionValues;
    public groupName: string;
    public description: string;
}