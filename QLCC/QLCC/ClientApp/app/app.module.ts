// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { LOCALE_ID,NgModule, ErrorHandler } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RippleModule } from '@progress/kendo-angular-ripple';
//import { HttpModule } from '@angular/http';
import { UploadModule } from '@progress/kendo-angular-upload';
//import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
//import { InputsModule } from '@progress/kendo-angular-inputs';
//import { saveAs  } from '@progress/kendo-file-saver';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { registerLocaleData } from '@angular/common';
//import localeVn from '@progress/kendo-angular-intl/locales/vi';
import localeVn from '@angular/common/locales/vi';
registerLocaleData(localeVn);
import 'bootstrap';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastyModule } from 'ng2-toasty';
import { ModalModule } from 'ngx-bootstrap/modal';
import { OnlyNumber } from "./components/controls/OnlyNumber"
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PopoverModule } from "ngx-bootstrap/popover";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ChartsModule } from 'ng2-charts';
//import { CKEditorModule } from 'ng2-ckeditor';
import * as EmailValidator from 'email-validator';

import { AppRoutingModule } from './app-routing.module';
import { AppErrorHandler } from './app-error.handler';
import { AppTitleService } from './services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { AlertService } from './services/alert.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { EndpointFactory } from './services/endpoint-factory.service';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';




import { EqualValidator } from './directives/equal-validator.directive';
import { LastElementDirective } from './directives/last-element.directive';
import { AutofocusDirective } from './directives/autofocus.directive';
import { BootstrapTabDirective } from './directives/bootstrap-tab.directive';
import { BootstrapToggleDirective } from './directives/bootstrap-toggle.directive';
import { BootstrapSelectDirective } from './directives/bootstrap-select.directive';
import { BootstrapDatepickerDirective } from './directives/bootstrap-datepicker.directive';
import { GroupByPipe } from './pipes/group-by.pipe';

import { AppComponent } from "./components/app.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { CustomersComponent } from "./components/customers/customers.component";
import { ProductsComponent } from "./components/products/products.component";
import { OrdersComponent } from "./components/orders/orders.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { AboutComponent } from "./components/about/about.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";

import { BannerDemoComponent } from "./components/controls/banner-demo.component";
import { TodoDemoComponent } from "./components/controls/todo-demo.component";
import { StatisticsDemoComponent } from "./components/controls/statistics-demo.component";
import { NotificationsViewerComponent } from "./components/controls/notifications-viewer.component";
import { SearchBoxComponent } from "./components/controls/search-box.component";
import { UserInfoComponent } from "./components/controls/user-info.component";
import { CuDanMatBangComponent } from "./components/matbang/xemmatbang/cudan/cudan.component";
import { DanhSachYeuCauComponent } from "./components/matbang/xemmatbang/danhsachyeucau/danhsachyeucau.component";
import { TheXeMBComponent } from "./components/matbang/xemmatbang/thexemb/thexemb.component";
import { LichSuSuDungComponent } from "./components/matbang/xemmatbang/lichsusudung/lichsusudung.component";
import { LichSuThuPhiComponent } from "./components/matbang/xemmatbang/lichsuthuphi/lichsuthuphi.component";
import { TaiSanComponent } from "./components/matbang/xemmatbang/taisan/taisan.component";
import { CongNoComponent } from "./components/matbang/xemmatbang/congno/congno.component";

import { UserPreferencesComponent } from "./components/controls/user-preferences.component";
import { UsersManagementComponent } from "./components/controls/users-management.component";
import { RolesManagementComponent } from "./components/controls/roles-management.component";
import { RoleEditorComponent } from "./components/controls/role-editor.component";

import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

import { MenuLeftComponent } from "./components/commoncontrol/menuleft/menuleft.component";
import { FooterComponent } from "./components/commoncontrol/footer/footer.component";
import { commonroadComponent } from "./components/commoncontrol/commonroad/commonroad.component";
import { gobackComponent } from "./components/commoncontrol/commonroad/goback.component";

import { FloursComponent } from "./components/flour/flour.component";

//khai service
import { CumToaNhaService } from './services/cumtoanha.service';
import { CumToaNhaEndpoint } from './services/cumtoanha-endpoint.service';
import { ToaNhaService } from './services/toanha.service';
import { ToaNhaEndpoint } from './services/toanha-endpoint.service';
import { TangLauService } from './services/tanglau.service';
import { TangLauEndpoint } from './services/tanglau-endpoint.service';
import { TrangThaiService } from './services/trangthai.service';
import { TrangThaiEndpoint } from './services/trangthai-endpoint.service';
import { MatBangService } from './services/matbang.service';
import { MatBangEndpoint } from './services/matbang-endpoint.service';
import { ChucVuService } from './services/chucvu.service';
import { ChucVuEndpoint } from './services/chucvu-endpoint.service';
import { DonViTinhService } from './services/donvitinh.service';
import { DonViTinhEndpoint } from './services/donvitinh-endpoint.service';
import { KhuVucService } from './services/khuvuc.service';
import { KhuVucEndpoint } from './services/khuvuc-endpoint.service';
import { LoaiGiaThueService } from './services/loaigiathue.service';
import { LoaiGiaThueEndpoint } from './services/loaigiathue-endpoint.service';
import { LoaiMatBangService } from './services/loaimatbang.service';
import { LoaiMatBangEndpoint } from './services/loaimatbang-endpoint.service';
import { LoaiTienService } from './services/loaitien.service';
import { LoaiTienEndpoint } from './services/loaitien-endpoint.service';
import { LoaiYeuCauService } from './services/loaiyeucau.service';
import { LoaiYeuCauEndpoint } from './services/loaiyeucau-endpoint.service';
import { NhaCungCapService } from './services/nhacungcap.service';
import { NhaCungCapEndpoint } from './services/nhacungcap-endpoint.service';
import { NganHangService } from './services/nganhang.service';
import { NganHangEndpoint } from './services/nganhang-endpoint.service';
import { PhongBanService } from './services/phongban.service';
import { PhongBanEndpoint } from './services/phongban-endpoint.service';
import { QuocTichService } from './services/quoctich.service';
import { QuocTichEndpoint } from './services/quoctich-endpoint.service';
import { TaiKhoanNganHangService } from './services/taikhoannganhang.service';
import { TaiKhoanNganHangEndpoint } from './services/taikhoannganhang-endpoint.service';
import { KhachHangService } from './services/khachhang.service';
import { KhachHangEndpoint } from './services/khachhang-endpoint.service';
import { CuDanService } from './services/cudan.service';
import { CuDanEndpoint } from './services/cudan-endpoint.service';
import { QuanHeChuHoService } from './services/quanhechuho.service';
import { QuanHeChuHoEndpoint } from './services/quanhechuho-endpoint.service';
import { TrangThaiCuDanService } from './services/trangthaicudan.service';
import { TrangThaiCuDanEndpoint } from './services/trangthaicudan-endpoint.service';
import { MucDoUuTienService } from './services/mucdouutien.service';
import { MucDoUuTienEndpoint } from './services/mucdouutien-endpoint.service';
import { TrangThaiYeuCauService } from './services/trangthaiyeucau.service';
import { TrangThaiYeuCauEndpoint } from './services/trangthaiyeucau-endpoint.service';
import { NguonTiepNhanService } from './services/nguontiepnhan.service';
import { NguonTiepNhanEndpoint } from './services/nguontiepnhan-endpoint.service';
import { NhomKhachHangService } from './services/nhomkhachhang.service';
import { NhomKhachHangEndpoint } from './services/nhomkhachhang-endpoint.service';
import { YeuCauService } from './services/yeucau.service';
import { YeuCauEndpoint } from './services/yeucau-endpoint.service';
import { NguoiDungToaNhaService } from './services/nguoidungtoanha.service';
import { NguoiDungToaNhaEndpoint } from './services/nguoidungtoanha-endpoint.service';
import { LoaiXeService } from './services/loaixe.service';
import { LoaiXeEndpoint } from './services/loaixe-endpoint.service';
import { BangGiaXeService } from './services/banggiaxe.service';
import { BangGiaXeEndpoint } from './services/banggiaxe-endpoint.service';
import { BangGiaDichVuCoBanService } from './services/banggiadichvucoban.service';
import { BangGiaDichVuCoBanEndpoint } from './services/banggiadichvucoban-endpoint.service';
import { LoaiDichVuService } from './services/loaidichvu.service';
import { LoaiDichVuEndpoint } from './services/loaidichvu-endpoint.service';
import { TheXeService } from './services/thexe.service';
import { TheXeEndpoint } from './services/thexe-endpoint.service';

import { CongThucNuocService } from "./services/congthucnuoc.service";
import { CongThucNuocEndpoint } from "./services/congthucnuoc-endpoint.service";
import { DinhMucNuocService } from "./services/dinhmucnuoc.service";
import { DinhMucNuocEndpoint } from "./services/dinhmucnuoc-endpoint.service";
import { DichVuCoBanService } from "./services/dichvucoban.service";
import { DichVuCoBanEndpoint } from "./services/dichvucoban-endpoint.service";

import { PhieuThuService } from './services/phieuthu.service';
import { PhieuThuEndpoint } from './services/phieuthu-endpoint.service';
import { PhieuThuChiTietService } from './services/phieuthuchitiet.service';
import { PhieuThuChiTietEndpoint } from './services/phieuthuchitiet-endpoint.service';

import { HopDongService } from './services/hopdong.service';
import { HopDongEndpoint } from './services/hopdong-endpoint.service';

import { DichVuNuocService } from './services/dichvunuoc.service';
import { DichVuNuocEndpoint } from './services/dichvunuoc-endpoint.service';

//KHAI BÁO COMPONENT
import { CumToaNhaComponent } from "./components/cumtoanha/cumtoanha.component";
import { CumToaNhaInfoComponent } from "./components/cumtoanha/cumtoanha-info.component";
import { ImportExcelComponent } from "./components/controls/import-excel.component";
import { ToaNhaComponent } from "./components/toanha/toanha.component";
import { ToaNhaInfoComponent } from "./components/toanha/toanha-info.component";
import { TangLauComponent } from "./components/tanglau/tanglau.component";
import { TangLauInfoComponent } from "./components/tanglau/tanglau-info.component";
import { MatBangComponent } from "./components/matbang/matbang.component";
import { MatBangInfoComponent } from "./components/matbang/matbang-info.component";
//import { TrangThaiComponent } from "./components/trangthai/trangthai.component";
//import { TrangThaiInfoComponent } from "./components/trangthai/trangthai-info.component";
import { DanhMucComponent } from "./components/danhmuc/danhmuc.component";
import { ChucVuComponent } from "./components/chucvu/chucvu.component";
import { ChucVuInfoComponent } from "./components/chucvu/chucvu-info.component";
import { LoaiTienComponent } from "./components/loaitien/loaitien.component";
import { LoaiTienInfoComponent } from "./components/loaitien/loaitien-info.component";
import { DonViTinhComponent } from "./components/donvitinh/donvitinh.component";
import { DonViTinhInfoComponent } from "./components/donvitinh/donvitinh-info.component";
import { KhuVucComponent } from "./components/khuvuc/khuvuc.component";
import { KhuVucInfoComponent } from "./components/khuvuc/khuvuc-info.component";
import { LoaiGiaThueComponent } from "./components/loaigiathue/loaigiathue.component";
import { LoaiGiaThueInfoComponent } from "./components/loaigiathue/loaigiathue-info.component";
import { LoaiMatBangComponent } from "./components/loaimatbang/loaimatbang.component";
import { LoaiMatBangInfoComponent } from "./components/loaimatbang/loaimatbang-info.component";
import { NhaCungCapComponent } from "./components/nhacungcap/nhacungcap.component";
import { NhaCungCapInfoComponent } from "./components/nhacungcap/nhacungcap-info.component";
import { LoaiYeuCauComponent } from "./components/loaiyeucau/loaiyeucau.component";
import { LoaiYeuCauInfoComponent } from "./components/loaiyeucau/loaiyeucau-info.component";
import { NganHangComponent } from "./components/nganhang/nganhang.component";
import { NganHangInfoComponent } from "./components/nganhang/nganhang-info.component";
import { PhongBanComponent } from "./components/phongban/phongban.component";
import { PhongBanInfoComponent } from "./components/phongban/phongban-info.component";
import { QuocTichComponent } from "./components/quoctich/quoctich.component";
import { QuocTichInfoComponent } from "./components/quoctich/quoctich-info.component";
import { TaiKhoanNganHangComponent } from "./components/taikhoannganhang/taikhoannganhang.component";
import { TaiKhoanNganHangInfoComponent } from "./components/taikhoannganhang/taikhoannganhang-info.component";
import { KhachHangCaNhanComponent } from "./components/khachhang/canhan/khachhang-canhan.component";
import { KhachHangCaNhanInfoComponent } from "./components/khachhang/canhan/khachhang-canhan-info.component";
import { KhachHangDoanhNghiepComponent } from "./components/khachhang/doanhnghiep/khachhang-doanhnghiep.component";
import { KhachHangDoanhNghiepInfoComponent } from "./components/khachhang/doanhnghiep/khachhang-doanhnghiep-info.component";
import { CuDanComponent } from "./components/cudan/cudan.component";
import { CuDanInfoComponent } from "./components/cudan/cudan-info.component";
import { QuanHeChuHoComponent } from "./components/quanhechuho/quanhechuho.component";
import { QuanHeChuHoInfoComponent } from "./components/quanhechuho/quanhechuho-info.component";
import { TrangThaiCuDanComponent } from "./components/trangthaicudan/trangthaicudan.component";
import { TrangThaiCuDanInfoComponent } from "./components/trangthaicudan/trangthaicudan-info.component";
import { TrangThaiYeuCauComponent } from "./components/trangthaiyeucau/trangthaiyeucau.component";
import { TrangThaiYeuCauInfoComponent } from "./components/trangthaiyeucau/trangthaiyeucau-info.component";
import { MucDoUuTienComponent } from "./components/mucdouutien/mucdouutien.component";
import { MucDoUuTienInfoComponent } from "./components/mucdouutien/mucdouutien-info.component";
import { NguonTiepNhanComponent } from "./components/nguontiepnhan/nguontiepnhan.component";
import { NguonTiepNhanInfoComponent } from "./components/nguontiepnhan/nguontiepnhan-info.component";
import { NhomKhachHangComponent } from "./components/nhomkhachhang/nhomkhachhang.component";
import { NhomKhachHangInfoComponent } from "./components/nhomkhachhang/nhomkhachhang-info.component";
import { YeuCauComponent } from "./components/yeucau/yeucau.component";
import { YeuCauInfoComponent } from "./components/yeucau/yeucau-info.component";
import { NguoiDungToaNhaComponent } from "./components/nguoidungtoanha/nguoidungtoanha.component";
import { NguoiDungToaNhaInfoComponent } from "./components/nguoidungtoanha/nguoidungtoanha-info.component";
import { LoaiXeComponent } from "./components/loaixe/loaixe.component";
import { LoaiXeInfoComponent } from "./components/loaixe/loaixe-info.component";
import { BangGiaXeComponent } from "./components/banggiaxe/banggiaxe.component";
import { BangGiaXeInfoComponent } from "./components/banggiaxe/banggiaxe-info.component";
import { BangGiaDichVuCoBanComponent } from "./components/banggiadichvucoban/banggiadichvucoban.component";
import { BangGiaDichVuCoBanInfoComponent } from "./components/banggiadichvucoban/banggiadichvucoban-info.component";
import { LoaiDichVuComponent } from "./components/loaidichvu/loaidichvu.component";
import { LoaiDichVuInfoComponent } from "./components/loaidichvu/loaidichvu-info.component";
import { TheXeComponent } from "./components/thexe/thexe.component";
import { TheXeInfoComponent } from "./components/thexe/thexe-info.component";
import { PhieuThuInfoComponent } from "./components/phieuthu/phieuthu-info.component";
import { TheXeThungRacComponent } from "./components/thexe/thexe-thungrac.component";
import { PhieuThuLichSuComponent } from "./components/phieuthu/phieuthu-lichsu.component";

import { CongThucNuocComponent } from "./components/congthucnuoc/congthucnuoc.component";
import { CongThucNuocInfoComponent } from "./components/congthucnuoc/congthucnuoc-info.component";
import { DinhMucNuocComponent } from "./components/congthucnuoc/dinhmucnuoc.component";
import { DichVuCoBanComponent } from "./components/dichvucoban/dichvucoban.component";
import { DichVuCoBanInfoComponent } from "./components/dichvucoban/dichvucoban-info.component";
import { DichVuCoBanImportComponent } from "./components/dichvucoban/dichvucoban-import.component";
import { DatePipe } from "@angular/common";

import { HopDongComponent } from "./components/hopdong/hopdong.component";
import { HopDongInfoComponent } from "./components/hopdong/hopdong-info.component";
import { DichVuNuocComponent } from "./components/dichvunuoc/dichvunuoc.component";
import { DichVuNuocInfoComponent } from "./components/dichvunuoc/dichvunuoc-info.component";
import { HangSanXuatService } from "./services/hangsanxuat.service";
import { HangSanXuatEndpoint } from "./services/hangsanxuat-endpoint.service";
import { HangSanXuatComponent } from "./components/hangsanxuat/hangsanxuat.component";
import { HangSanXuatInfoComponent } from "./components/hangsanxuat/hangsanxuat-info.component";
import { LoaiHangComponent } from "./components/loaihang/loaihang.component";
import { LoaiHangInfoComponent } from "./components/loaihang/loaihang-info.component";
import { LoaiHangService } from "./services/loaihang.service";
import { LoaiHangEndpoint } from "./services/loaihang-endpoint.service";

//import { IntlModule } from '@progress/kendo-angular-intl';
import '@progress/kendo-angular-intl/locales/vi/all';
import { VatTuComponent } from "./components/vattu/vattu.component";
import { VatTuInfoComponent } from "./components/vattu/vattu-info.component";
import { VatTuService } from "./services/vattu.service";
import { VatTuEndpoint } from "./services/vattu-endpoint.service";
import { VatTuHinhAnhComponent } from "./components/vattuhinhanh/vattuhinhanh.component";
import { VatTuHinhAnhInfoComponent } from "./components/vattuhinhanh/vattuhinhanh-info.component";
import { VatTuTaiLieuComponent } from "./components/vattutailieu/vattutailieu.component";
import { VatTuTaiLieuInfoComponent } from "./components/vattutailieu/vattutailieu-info.component";
import { VatTuHinhAnhService } from "./services/vattuhinhanh.service";
import { VatTuHinhAnhEndpoint } from "./services/vattuhinhanh-endpoint.service";
import { VatTuTaiLieuEndpoint } from "./services/vattutailieu-endpoint.service";
import { VatTuTaiLieuService } from "./services/vattutailieu.service";
import { AuthService } from "./services/auth.service";
import { Utilities } from "./models/utilities";
import { FormWizardModule } from 'angular-wizard-form';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        //HttpModule,
        FormWizardModule,
        FormsModule,
        AppRoutingModule,
        UploadModule,
        RippleModule,
        //DropDownsModule,
        ModalModule.forRoot(),
        //CKEditorModule,
        //InputsModule,
        DateInputsModule,
        DatePickerModule,
        ExcelExportModule,
        ComboBoxModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLanguageLoader
            }
        }),
        NgxDatatableModule,
        ToastyModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        CarouselModule.forRoot(),
        ModalModule.forRoot(),
        MalihuScrollbarModule.forRoot(),
        ChartsModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        CustomersComponent,
        ProductsComponent,
        OrdersComponent,
        SettingsComponent,
        UsersManagementComponent,
        UserInfoComponent,
        CuDanComponent,
        CuDanMatBangComponent,
        DanhSachYeuCauComponent,
        TheXeMBComponent,
        LichSuSuDungComponent,
        LichSuThuPhiComponent,
        TaiSanComponent,
        CongNoComponent,
        OnlyNumber,
        UserPreferencesComponent,
        RolesManagementComponent,
        RoleEditorComponent,
        AboutComponent,
        NotFoundComponent,
        NotificationsViewerComponent,
        SearchBoxComponent,
        StatisticsDemoComponent,
        TodoDemoComponent,
        BannerDemoComponent,
        EqualValidator,
        LastElementDirective,
        AutofocusDirective,
        BootstrapTabDirective,
        BootstrapToggleDirective,
        BootstrapSelectDirective,
        BootstrapDatepickerDirective,
        GroupByPipe,
        MenuLeftComponent,
        FooterComponent,
        commonroadComponent,
        gobackComponent,
        FloursComponent,
        CumToaNhaComponent,
        CumToaNhaInfoComponent,
        ImportExcelComponent,
        ToaNhaComponent,
        ToaNhaInfoComponent,
        TangLauComponent,
        TangLauInfoComponent,
        MatBangComponent,
        MatBangInfoComponent,
        //TrangThaiComponent,
        //TrangThaiInfoComponent,
        NhaCungCapComponent,
        NhaCungCapInfoComponent,
        ChucVuComponent,
        ChucVuInfoComponent,
        DonViTinhComponent,
        DonViTinhInfoComponent,
        KhuVucComponent,
        KhuVucInfoComponent,
        LoaiGiaThueComponent,
        LoaiGiaThueInfoComponent,
        LoaiMatBangComponent,
        LoaiMatBangInfoComponent,
        LoaiTienComponent,
        LoaiTienInfoComponent,
        LoaiYeuCauComponent,
        LoaiYeuCauInfoComponent,
        NganHangComponent,
        NganHangInfoComponent,
        PhongBanComponent,
        PhongBanInfoComponent,
        QuocTichComponent,
        QuocTichInfoComponent,
        TaiKhoanNganHangComponent,
        TaiKhoanNganHangInfoComponent,
        KhachHangCaNhanComponent,
        KhachHangCaNhanInfoComponent,
        KhachHangDoanhNghiepComponent,
        KhachHangDoanhNghiepInfoComponent,
        CuDanInfoComponent,
        QuanHeChuHoComponent,
        QuanHeChuHoInfoComponent,
        TrangThaiCuDanComponent,
        TrangThaiCuDanInfoComponent,
        TrangThaiYeuCauComponent,
        TrangThaiYeuCauInfoComponent,
        MucDoUuTienComponent,
        MucDoUuTienInfoComponent,
        NguonTiepNhanComponent,
        NguonTiepNhanInfoComponent,
        NhomKhachHangComponent,
        NhomKhachHangInfoComponent,
        YeuCauComponent,
        YeuCauInfoComponent,
        NguoiDungToaNhaComponent,
        NguoiDungToaNhaInfoComponent,
        LoaiXeComponent,
        LoaiXeInfoComponent,
        BangGiaXeComponent,
        BangGiaXeInfoComponent,
        BangGiaDichVuCoBanComponent,
        BangGiaDichVuCoBanInfoComponent,
        LoaiDichVuComponent,
        LoaiDichVuInfoComponent,
        TheXeComponent,
        TheXeInfoComponent,
        PhieuThuInfoComponent,
        TheXeThungRacComponent,
        CongThucNuocComponent,
        CongThucNuocInfoComponent,
        DinhMucNuocComponent,
        DichVuCoBanComponent,
        DichVuCoBanInfoComponent,
        DichVuCoBanImportComponent,
        PhieuThuLichSuComponent,
        DanhMucComponent,
        HopDongComponent,
        HopDongInfoComponent,
        DichVuNuocComponent,
        DichVuNuocInfoComponent,
        HangSanXuatComponent,
        HangSanXuatInfoComponent,
        LoaiHangComponent,
        LoaiHangInfoComponent,
        VatTuComponent,
        VatTuInfoComponent,
        VatTuHinhAnhComponent,
        VatTuHinhAnhInfoComponent,
        VatTuTaiLieuComponent,
        VatTuTaiLieuInfoComponent
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'vi' },
        { provide: 'BASE_URL', useFactory: getBaseUrl },
        { provide: ErrorHandler, useClass: AppErrorHandler },
        AlertService,
        ConfigurationService,
        AppTitleService,
        AppTranslationService,
        NotificationService,
        NotificationEndpoint,
        AccountService,
        AccountEndpoint,
        LocalStoreManager,
        EndpointFactory,
        CumToaNhaService,
        CumToaNhaEndpoint,
        ToaNhaService,
        ToaNhaEndpoint,
        TangLauService,
        TangLauEndpoint,
        MatBangService,
        MatBangEndpoint,
        TrangThaiService,
        TrangThaiEndpoint,
        NhaCungCapService,
        NhaCungCapEndpoint,
        ChucVuService,
        ChucVuEndpoint,
        DonViTinhService,
        DonViTinhEndpoint,
        KhuVucService,
        KhuVucEndpoint,
        LoaiGiaThueService,
        LoaiGiaThueEndpoint,
        LoaiMatBangService,
        LoaiMatBangEndpoint,
        LoaiTienService,
        LoaiTienEndpoint,
        LoaiYeuCauService,
        LoaiYeuCauEndpoint,
        NganHangService,
        NganHangEndpoint,
        PhongBanService,
        PhongBanEndpoint,
        QuocTichService,
        QuocTichEndpoint,
        TaiKhoanNganHangService,
        TaiKhoanNganHangEndpoint,
        KhachHangService,
        KhachHangEndpoint,
        CuDanService,
        CuDanEndpoint,
        QuanHeChuHoService,
        QuanHeChuHoEndpoint,
        TrangThaiCuDanEndpoint,
        TrangThaiCuDanService,
        TrangThaiYeuCauEndpoint,
        TrangThaiYeuCauService,
        MucDoUuTienEndpoint,
        MucDoUuTienService,
        NguonTiepNhanService,
        NguonTiepNhanEndpoint,
        NhomKhachHangService,
        NhomKhachHangEndpoint,
        NguoiDungToaNhaService,
        NguoiDungToaNhaEndpoint,
        YeuCauService,
        YeuCauEndpoint,
        LoaiXeService,
        LoaiXeEndpoint,
        BangGiaXeService,
        BangGiaXeEndpoint,
        BangGiaDichVuCoBanService,
        BangGiaDichVuCoBanEndpoint,
        LoaiDichVuService,
        LoaiDichVuEndpoint,
        TheXeService,
        TheXeEndpoint,
        PhieuThuService,
        PhieuThuEndpoint,
        PhieuThuChiTietService,
        PhieuThuChiTietEndpoint,
        CongThucNuocService,
        CongThucNuocEndpoint,
        DinhMucNuocService,
        DinhMucNuocEndpoint,
        DichVuCoBanService,
        DichVuCoBanEndpoint,
        DatePipe,
        HopDongService,
        HopDongEndpoint,
        DichVuNuocService,
        DichVuNuocEndpoint,
        HangSanXuatService,
        HangSanXuatEndpoint,
        LoaiHangService,
        LoaiHangEndpoint,
        VatTuService,
        VatTuEndpoint,
        VatTuHinhAnhService,
        VatTuHinhAnhEndpoint,
        VatTuTaiLieuService,
        VatTuTaiLieuEndpoint,
        AuthService,
        Utilities
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}




export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}
