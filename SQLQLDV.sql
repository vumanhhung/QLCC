USE [QLCC]
GO

/****** Object:  Table [dbo].[tbl_HangSanXuat]    Script Date: 21/08/2018 05:11:13 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tbl_HangSanXuat](
	[HangSanXuatId] [int] NOT NULL,
	[TenHangSanXuat] [nvarchar](250) NULL,
	[KyHieu] [varchar](20) NULL,
	[DienGiai] [nvarchar](500) NULL,
	[TrangThai] [bit] NULL,
	[NguoiNhap] [varchar](150) NULL,
	[NgayNhap] [datetime] NULL,
	[NguoiSua] [varchar](150) NULL,
	[NgaySua] [datetime] NULL,
 CONSTRAINT [PK_tbl_HangSanXuat] PRIMARY KEY CLUSTERED 
(
	[HangSanXuatId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tbl_LoaiHang](
	[LoaiHangId] [int] NOT NULL,
	[TenLoaiHang] [nvarchar](250) NULL,
	[KyHieu] [varchar](20) NULL,
	[DienGiai] [nvarchar](500) NULL,
	[TrangThai] [bit] NULL,
	[NguoiNhap] [varchar](150) NULL,
	[NgayNhap] [datetime] NULL,
	[NguoiSua] [varchar](150) NULL,
	[NgaySua] [datetime] NULL,
 CONSTRAINT [PK_tbl_LoaiHang] PRIMARY KEY CLUSTERED 
(
	[LoaiHangId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO