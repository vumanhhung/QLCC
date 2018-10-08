import { VatTuPhieuDiChuyen } from "./vattuphieudichuyen.model";
import { VatTu } from "./vattu.model";
import { DonViTinh } from "./donvitinh.model";
import { QuocTich } from "./quoctich.model";

export class VatTuDiChuyen {
    public vatTuDiChuyenId: number;
    public phieuDiChuyenId: number;
    public vatTuId: number;
    public donViTinhId: number;
    public quocTichId: number;
    public soLuong: number;
    public ghiChu: string;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;
    public vattuphieudichuyens: VatTuPhieuDiChuyen;
    public vattus: VatTu;
    public donvitinhs: DonViTinh;
    public quoctichs: QuocTich;

    constructor(vatTuDiChuyenId?: number, phieuDiChuyenId?: number, vatTuId?: number, donViTinhId?: number, quocTichId?: number, soLuong?: number, ghiChu?: string, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.vatTuDiChuyenId = vatTuDiChuyenId;
        this.phieuDiChuyenId = phieuDiChuyenId;
        this.vatTuId = vatTuId;
        this.donViTinhId = donViTinhId;
        this.quocTichId = quocTichId;
        this.soLuong = soLuong;
        this.ghiChu = ghiChu;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
