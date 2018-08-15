import { MatBang } from "./matbang.model";
import { CuDan } from "./cudan.model";
import { MucDoUuTien } from "./mucdouutien.model";
import { NguonTiepNhan } from "./nguontiepnhan.model";
import { PhongBan } from "./phongban.model";
import { TrangThaiYeuCau } from "./trangthaiyeucau.model";
import { LoaiYeuCau } from "./loaiyeucau.model";

export class YeuCau {
    public yeuCauId: number;
    public soYeuCau: string;
    public matBangId: number;
    public nguoiGui: string;
    public soDienThoai: string;
    public noiDung: string;
    public thoiGianHen: Date;
    public mucDoUuTienId: number;
    public nguonTiepNhanId: number;
    public tieuDe: string;
    public phongBanId: number;
    public trangThaiYeuCauId: number;
    public cuDanId: number;
    public loaiYeuCauId: number;
    public matBang: MatBang;
    public cuDan: CuDan;
    public mucDoUuTien: MucDoUuTien;
    public nguonTiepNhan: NguonTiepNhan;
    public phongBan: PhongBan;
    public trangThaiYeuCau: TrangThaiYeuCau;
    public loaiYeuCau: LoaiYeuCau;

    constructor(yeuCauId?: number, soYeuCau?: string, matBangId?: number, nguoiGui?: string, soDienThoai?: string, noiDung?: string, thoiGianHen?: Date, mucDoUuTienId?: number, nguonTiepNhanId?: number, tieuDe?: string, phongBanId?: number, trangThaiYeuCauId?: number, cuDanId?: number, loaiYeuCauId?: number) {
        this.yeuCauId = yeuCauId;
        this.soYeuCau = soYeuCau;
        this.matBangId = matBangId;
        this.nguoiGui = nguoiGui;
        this.soDienThoai = soDienThoai;
        this.noiDung = noiDung;
        this.thoiGianHen = thoiGianHen;
        this.mucDoUuTienId = mucDoUuTienId;
        this.nguonTiepNhanId = nguonTiepNhanId;
        this.tieuDe = tieuDe;
        this.phongBanId = phongBanId;
        this.trangThaiYeuCauId = trangThaiYeuCauId;
        this.cuDanId = cuDanId;
        this.loaiYeuCauId = loaiYeuCauId;
    }
}
