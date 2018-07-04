export class TrangThai {
		public trangThaiId: number;
		public tenTrangThai: string;
		public mauNen: string;
		public choThue: number;
		public dienGiai: string;
    
    constructor(trangThaiId?: number, tenTrangThai?: string, mauNen?: string, choThue?: number, dienGiai?: string)
    {
				this.trangThaiId = trangThaiId;
				this.tenTrangThai = tenTrangThai;
				this.mauNen = mauNen;
				this.choThue = choThue;
				this.dienGiai = dienGiai;
    }
}
