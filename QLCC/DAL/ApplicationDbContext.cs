// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

using DAL.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using DAL.Models.Interfaces;

namespace DAL
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public string CurrentUserId { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<CumToaNha> CumToaNhas { get; set; }
        public DbSet<ToaNha> ToaNhas { get; set; }
        public DbSet<TangLau> TangLaus { get; set; }
        public DbSet<MatBang> MatBangs { get; set; }
        public DbSet<TrangThai> TrangThais { get; set; }
        public DbSet<NhaCungCap> NhaCungCaps { get; set; }
        public DbSet<ChucVu> ChucVus { get; set; }        
        public DbSet<DonViTinh> DonViTinhs { get; set; }
        public DbSet<KhuVuc> KhuVucs { get; set; }
        public DbSet<LoaiGiaThue> LoaiGiaThues { get; set; }
        public DbSet<LoaiMatBang> LoaiMatBangs { get; set; }
        public DbSet<LoaiTien> LoaiTiens { get; set; }
        public DbSet<LoaiYeuCau> LoaiYeuCaus { get; set; }
        public DbSet<NganHang> NganHangs { get; set; }
        public DbSet<PhongBan> PhongBans { get; set; }
        public DbSet<QuocTich> QuocTichs { get; set; }
        public DbSet<NhomKhachHang> NhomKhachHangs { get; set; }
        public DbSet<KhachHang> KhachHangs { get; set; }
        public DbSet<TaiKhoanNganHang> TaiKhoanNganHangs { get; set; }
        public DbSet<TrangThaiYeuCau> TrangThaiYeuCaus { get; set; }
        public DbSet<TrangThaiCuDan> TrangThaiCuDans { get; set; }
        public DbSet<QuanHeChuHo> QuanHeChuHos { get; set; }
        public DbSet<MucDoUuTien> MucDoUuTiens { get; set; }
        public DbSet<NguonTiepNhan> NguonTiepNhans { get; set; }
        public DbSet<CuDan> CuDans { get; set; }
        public DbSet<NguoiDungToaNha> NguoiDungToaNhas { get; set; }
        public DbSet<YeuCau> YeuCaus { get; set; }

        public DbSet<BangGiaDichVuCoBan> BangGiaDichVuCoBans { get; set; }
        public DbSet<BangGiaXe> BangGiaXes { get; set; }
        public DbSet<LoaiDichVu> LoaiDichVus { get; set; }
        public DbSet<LoaiXe> LoaiXes { get; set; }
        public DbSet<CongThucNuoc> CongThucNuocs { get; set; }
        public DbSet<DinhMucNuoc> DinhMucNuocs { get; set; }
        public DbSet<DichVuCoBan> DichVuCoBans { get; set; }

        public ApplicationDbContext(DbContextOptions options) : base(options)
        { }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>().HasMany(u => u.Claims).WithOne().HasForeignKey(c => c.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ApplicationUser>().HasMany(u => u.Roles).WithOne().HasForeignKey(r => r.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ApplicationRole>().HasMany(r => r.Claims).WithOne().HasForeignKey(c => c.RoleId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ApplicationRole>().HasMany(r => r.Users).WithOne().HasForeignKey(r => r.RoleId).IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Customer>().Property(c => c.Name).IsRequired().HasMaxLength(100);
            builder.Entity<Customer>().HasIndex(c => c.Name);
            builder.Entity<Customer>().Property(c => c.Email).HasMaxLength(100);
            builder.Entity<Customer>().Property(c => c.PhoneNumber).IsUnicode(false).HasMaxLength(30);
            builder.Entity<Customer>().Property(c => c.City).HasMaxLength(50);
            builder.Entity<Customer>().ToTable($"App{nameof(this.Customers)}");

            builder.Entity<ProductCategory>().Property(p => p.Name).IsRequired().HasMaxLength(100);
            builder.Entity<ProductCategory>().Property(p => p.Description).HasMaxLength(500);
            builder.Entity<ProductCategory>().ToTable($"App{nameof(this.ProductCategories)}");

            builder.Entity<Product>().Property(p => p.Name).IsRequired().HasMaxLength(100);
            builder.Entity<Product>().HasIndex(p => p.Name);
            builder.Entity<Product>().Property(p => p.Description).HasMaxLength(500);
            builder.Entity<Product>().Property(p => p.Icon).IsUnicode(false).HasMaxLength(256);
            builder.Entity<Product>().HasOne(p => p.Parent).WithMany(p => p.Children).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Product>().ToTable($"App{nameof(this.Products)}");

            builder.Entity<Order>().Property(o => o.Comments).HasMaxLength(500);
            builder.Entity<Order>().ToTable($"App{nameof(this.Orders)}");

            builder.Entity<OrderDetail>().ToTable($"App{nameof(this.OrderDetails)}");
            builder.Entity<CumToaNha>().ToTable($"tbl_CumToaNha");
            builder.Entity<ToaNha>().ToTable($"tbl_ToaNha");
            builder.Entity<TangLau>().ToTable($"tbl_TangLau");
            builder.Entity<MatBang>().ToTable($"tbl_MatBang");
            builder.Entity<TrangThai>().ToTable($"tbl_TrangThai");
            builder.Entity<NhaCungCap>().ToTable($"tbl_NhaCungCap");
            builder.Entity<ChucVu>().ToTable($"tbl_ChucVu");

            builder.Entity<DonViTinh>().ToTable($"tbl_DonViTinh");
            builder.Entity<KhuVuc>().ToTable($"tbl_KhuVuc");
            builder.Entity<LoaiGiaThue>().ToTable($"tbl_LoaiGiaThue");
            builder.Entity<LoaiMatBang>().ToTable($"tbl_LoaiMatBang");
            builder.Entity<LoaiTien>().ToTable($"tbl_LoaiTien");
            builder.Entity<LoaiYeuCau>().ToTable($"tbl_LoaiYeuCau");
            builder.Entity<NganHang>().ToTable($"tbl_NganHang");
            builder.Entity<PhongBan>().ToTable($"tbl_PhongBan");
            builder.Entity<QuocTich>().ToTable($"tbl_QuocTich");
            builder.Entity<TaiKhoanNganHang>().ToTable($"tbl_TaiKhoanNganHang");
            builder.Entity<KhachHang>().ToTable($"tbl_KhachHang");
            builder.Entity<NhomKhachHang>().ToTable($"tbl_NhomKhachHang");
            builder.Entity<TrangThaiYeuCau>().ToTable($"tbl_TrangThaiYeuCau");
            builder.Entity<TrangThaiCuDan>().ToTable($"tbl_TrangThaiCuDan");
            builder.Entity<QuanHeChuHo>().ToTable($"tbl_QuanHeChuHo");
            builder.Entity<MucDoUuTien>().ToTable($"tbl_MucDoUuTien");
            builder.Entity<NguonTiepNhan>().ToTable($"tbl_NguonTiepNhan");
            builder.Entity<CuDan>().ToTable($"tbl_CuDan");
            builder.Entity<YeuCau>().ToTable($"tbl_YeuCau");
            builder.Entity<NguoiDungToaNha>().ToTable($"tbl_NguoiDungToaNha");

            builder.Entity<BangGiaDichVuCoBan>().ToTable($"tbl_BangGiaDichVuCoBan");
            builder.Entity<BangGiaXe>().ToTable($"tbl_BangGiaXe");
            builder.Entity<LoaiDichVu>().ToTable($"tbl_LoaiDichVu");
            builder.Entity<LoaiXe>().ToTable($"tbl_LoaiXe");
            builder.Entity<CongThucNuoc>().ToTable($"tbl_CongThucNuoc");
            builder.Entity<DinhMucNuoc>().ToTable($"tbl_DinhMucNuoc");
            builder.Entity<DichVuCoBan>().ToTable($"tbl_DichVuCoBan");
        }

        public override int SaveChanges()
        {
            UpdateAuditEntities();
            return base.SaveChanges();
        }


        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            UpdateAuditEntities();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }


        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(cancellationToken);
        }


        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }


        private void UpdateAuditEntities()
        {
            var modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.Entity is IAuditableEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));


            foreach (var entry in modifiedEntries)
            {
                var entity = (IAuditableEntity)entry.Entity;
                DateTime now = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedDate = now;
                    entity.CreatedBy = CurrentUserId;
                }
                else
                {
                    base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                    base.Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                }

                entity.UpdatedDate = now;
                entity.UpdatedBy = CurrentUserId;
            }
        }
    }
}
