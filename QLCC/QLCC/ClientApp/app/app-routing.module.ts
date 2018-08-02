// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { CustomersComponent } from "./components/customers/customers.component";
import { ProductsComponent } from "./components/products/products.component";
import { OrdersComponent } from "./components/orders/orders.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { AboutComponent } from "./components/about/about.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { FloursComponent } from './components/flour/flour.component';
import { CumToaNhaComponent } from './components/cumtoanha/cumtoanha.component';
import { ToaNhaComponent } from './components/toanha/toanha.component';
import { MatBangComponent } from './components/matbang/matbang.component';
import { TangLauComponent } from './components/tanglau/tanglau.component';
import { ChucVuComponent } from './components/chucvu/chucvu.component';
import { DanhMucComponent } from './components/danhmuc/danhmuc.component';
import { NganHangComponent } from './components/nganhang/nganhang.component';
import { TrangThaiComponent } from './components/trangthai/trangthai.component';
import { TaiKhoanNganHangComponent } from './components/taikhoannganhang/taikhoannganhang.component';
import { NhaCungCapComponent } from './components/nhacungcap/nhacungcap.component';
import { QuocTichComponent } from './components/quoctich/quoctich.component';
import { KhuVucComponent } from './components/khuvuc/khuvuc.component';
import { DonViTinhComponent } from './components/donvitinh/donvitinh.component';
import { PhongBanComponent } from './components/phongban/phongban.component';
import { LoaiTienComponent } from './components/loaitien/loaitien.component';
import { LoaiGiaThueComponent } from './components/loaigiathue/loaigiathue.component';
import { LoaiMatBangComponent } from './components/loaimatbang/loaimatbang.component';
import { RoleEditorComponent } from './components/controls/role-editor.component';
import { KhachHangCaNhanComponent } from './components/khachhang/canhan/khachhang-canhan.component';
import { KhachHangDoanhNghiepComponent } from './components/khachhang/doanhnghiep/khachhang-doanhnghiep.component';
import { CuDanComponent } from './components/cudan/cudan.component';
import { TrangThaiCuDanComponent } from "./components/trangthaicudan/trangthaicudan.component";
import { QuanHeChuHoComponent } from "./components/quanhechuho/quanhechuho.component";
import { TrangThaiYeuCauComponent } from "./components/trangthaiyeucau/trangthaiyeucau.component";
import { MucDoUuTienComponent } from "./components/mucdouutien/mucdouutien.component";
import { NguonTiepNhanComponent } from "./components/nguontiepnhan/nguontiepnhan.component";
import { NhomKhachHangComponent } from "./components/nhomkhachhang/nhomkhachhang.component";
import { LoaiYeuCauComponent } from "./components/loaiyeucau/loaiyeucau.component";
import { YeuCauComponent } from "./components/yeucau/yeucau.component";
import { LoaiXeComponent } from "./components/loaixe/loaixe.component";
import { BangGiaXeComponent } from "./components/banggiaxe/banggiaxe.component";
import { BangGiaDichVuCoBanComponent } from "./components/banggiadichvucoban/banggiadichvucoban.component";
import { LoaiDichVuComponent } from './components/loaidichvu/loaidichvu.component';
import { CongThucNuocComponent } from './components/congthucnuoc/congthucnuoc.component';
import { DichVuCoBanComponent } from './components/dichvucoban/dichvucoban.component';


@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: "", component: HomeComponent, canActivate: [AuthGuard], data: { title: "Trang chủ" } },
            { path: "login", component: LoginComponent, data: { title: "Đăng nhập" } },
            { path: "customers", component: CustomersComponent, canActivate: [AuthGuard], data: { title: "Customers" } },
            { path: "cumtoanha", component: CumToaNhaComponent, canActivate: [AuthGuard], data: { title: "Thông tin cụm tòa nhà" } },
            { path: "toanha", component: ToaNhaComponent, canActivate: [AuthGuard], data: { title: "Thông tin tòa nhà" } },
            { path: "tanglau", component: TangLauComponent, canActivate: [AuthGuard], data: { title: "Thông tin tầng lầu" } },
            { path: "chucvu", component: ChucVuComponent, canActivate: [AuthGuard], data: { title: "Danh sách chức vụ" } },
            { path: "nganhang", component: NganHangComponent, canActivate: [AuthGuard], data: { title: "Danh sách ngân hàng" } },
            { path: "taikhoannganhang", component: TaiKhoanNganHangComponent, canActivate: [AuthGuard], data: { title: "Danh sách tài khoản ngân hàng" } },
            { path: "trangthai", component: TrangThaiComponent, canActivate: [AuthGuard], data: { title: "Danh sách trạng thái" } },
            { path: "nhacungcap", component: NhaCungCapComponent, canActivate: [AuthGuard], data: { title: "Danh sách nhà cung cấp" } },
            { path: "quoctich", component: QuocTichComponent, canActivate: [AuthGuard], data: { title: "Danh sách quốc tịch" } },
            { path: "khuvuc", component: KhuVucComponent, canActivate: [AuthGuard], data: { title: "Danh sách khu vực" } },
            { path: "donvitinh", component: DonViTinhComponent, canActivate: [AuthGuard], data: { title: "Danh sách đơn vị tính" } },
            { path: "phongban", component: PhongBanComponent, canActivate: [AuthGuard], data: { title: "Danh sách phòng ban" } },
            { path: "loaitien", component: LoaiTienComponent, canActivate: [AuthGuard], data: { title: "Danh sách loại tiên" } },
            { path: "loaigiathue", component: LoaiGiaThueComponent, canActivate: [AuthGuard], data: { title: "Danh sách loại giá thuê" } },
            { path: "loaimatbang", component: LoaiMatBangComponent, canActivate: [AuthGuard], data: { title: "Danh sách loại mặt bằng" } },
            { path: "loaiyeucau", component: LoaiYeuCauComponent, canActivate: [AuthGuard], data: { title: "Danh sách loại yêu cầu" } },
            { path: "quanlydanhmuc", component: DanhMucComponent, canActivate: [AuthGuard], data: { title: "Quản lý danh mục" } },
            { path: "quanlymatbang", component: MatBangComponent, canActivate: [AuthGuard], data: { title: "Quản lý mặt bằng" } },
            { path: "chucvu", component: ChucVuComponent, canActivate: [AuthGuard], data: { title: "Quản lý chức vụ" } },
            { path: "khachhangcanhan", component: KhachHangCaNhanComponent, canActivate: [AuthGuard], data: { title: "Quản lý khách hàng | Cá nhân" } },
            { path: "khachhangdoanhnghiep", component: KhachHangDoanhNghiepComponent, canActivate: [AuthGuard], data: { title: "Quản lý khách hàng | Doanh nghiệp" } },
            { path: "cudan", component: CuDanComponent, canActivate: [AuthGuard], data: { title: "Quản lý cư dân" } },
            { path: "trangthaicudan", component: TrangThaiCuDanComponent, canActivate: [AuthGuard], data: { title: "Quản lý trạng thái cư dân" } },
            { path: "quanhechuho", component: QuanHeChuHoComponent, canActivate: [AuthGuard], data: { title: "Quản lý quan hệ chủ hộ" } },
            { path: "trangthaiyeucau", component: TrangThaiYeuCauComponent, canActivate: [AuthGuard], data: { title: "Trạng thái yêu cầu" } },
            { path: "mucdouutien", component: MucDoUuTienComponent, canActivate: [AuthGuard], data: { title: "Mức độ ưu tiên" } },
            { path: "nguontiepnhan", component: NguonTiepNhanComponent, canActivate: [AuthGuard], data: { title: "Nguồn tiếp nhận" } },
            { path: "nhomkhachhang", component: NhomKhachHangComponent, canActivate: [AuthGuard], data: { title: "Nhóm khách hàng" } },
            { path: "yeucau", component: YeuCauComponent, canActivate: [AuthGuard], data: { title: "Yêu cầu" } },
            { path: "loaixe", component: LoaiXeComponent, canActivate: [AuthGuard], data: { title: "Loại xe" } },
            { path: "banggiaxe", component: BangGiaXeComponent, canActivate: [AuthGuard], data: { title: "Bảng giá xe" } },
            { path: "banggiadichvucoban", component: BangGiaDichVuCoBanComponent, canActivate: [AuthGuard], data: { title: "Bảng giá dịch vụ cơ bản" } },
            { path: "loaidichvu", component: LoaiDichVuComponent, canActivate: [AuthGuard], data: { title: "Loại dịch vụ" } },
            { path: "congthucnuoc", component: CongThucNuocComponent, canActivate: [AuthGuard], data: { title: "Công thức nước" } },
            { path: "dichvucoban", component: DichVuCoBanComponent, canActivate: [AuthGuard], data: { title: "Dịch vụ cơ bản" } },
            { path: "matbang", component: MatBangComponent, canActivate: [AuthGuard], data: { title: "Mặt bằng" } },
            //{ path: "role/:id", component: RoleEditorComponent},
            { path: "settings", component: SettingsComponent, canActivate: [AuthGuard], data: { title: "Cấu hình" } },
            { path: "about", component: AboutComponent, data: { title: "Giới thiệu" } },
            { path: "home", redirectTo: "/", pathMatch: "full" },
            { path: "**", component: NotFoundComponent, data: { title: "Không tìm thấy Trang" } }
        ])
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthService, AuthGuard
    ]
})
export class AppRoutingModule { }