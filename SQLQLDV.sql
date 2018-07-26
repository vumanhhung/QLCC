use QLCC

INSERT INTO tbl_LoaiDichVu VALUES ('A','A',1,0,'true',1,null, null,null,null)
INSERT INTO tbl_LoaiDichVu VALUES ('B','B',2,0,'true',1,null, null,null,null)
INSERT INTO tbl_LoaiDichVu VALUES ('C','C',3,0,'true',1,null, null,null,null)

INSERT INTO tbl_LoaiDichVu VALUES ('A1','A1',1,1,'true',1,null, null,null,null)
INSERT INTO tbl_LoaiDichVu VALUES ('A2','A2',2,1,'true',1,null, null,null,null)
INSERT INTO tbl_LoaiDichVu VALUES ('A3','A3',3,1,'true',1,null, null,null,null)

INSERT INTO tbl_LoaiDichVu VALUES ('B1','B1',1,2,'true',1,null, null,null,null)
INSERT INTO tbl_LoaiDichVu VALUES ('B2','B2',2,2,'true',1,null, null,null,null)
INSERT INTO tbl_LoaiDichVu VALUES ('C1','C1',1,3,'true',1,null, null,null,null)
INSERT INTO tbl_LoaiDichVu VALUES ('C1_1','C1_1',1,9,'true',1,null, null,null,null)


select * from tbl_LoaiDichVu where MaLoaiDichVuCha = 0

select * from tbl_LoaiDichVu where MaLoaiDichVuCha = 1


select b.LoaiDichVuId, a.TenLoaiDichVu as TenLoaiDichVuCha,  b.TenLoaiDichVu from tbl_LoaiDichVu as a 
join tbl_LoaiDichVu as b on a.LoaiDichVuId = b.MaLoaiDichVuCha
where b.MaLoaiDichVuCha = a.LoaiDichVuId

SELECT t1.LoaiDichVuId, t2.TenLoaiDichVu, t2.MaLoaiDichVuCha FROM tbl_LoaiDichVu t1
join tbl_LoaiDichVu t2 on t1.LoaiDichVuId = t2.MaLoaiDichVuCha
order by t1.TenLoaiDichVu, t2.TenLoaiDichVu

select * from tbl_LoaiDichVu

select COUNT(tbl_LoaiDichVu) 