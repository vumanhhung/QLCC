import { ToaNha } from "./toanha.model";
export class NguoiDungToaNha {
		public nguoiDungToaNhaId: number;
		public cumToaNhaId: number;
		public toaNhaId: number;
		public nguoiDungId: string;
		public userName: string;
        public dienGiai: string;
        public toaNha: ToaNha;
    
    constructor(nguoiDungToaNhaId?: number, cumToaNhaId?: number, toaNhaId?: number, nguoiDungId?: string, userName?: string, dienGiai?: string)
    {
				this.nguoiDungToaNhaId = nguoiDungToaNhaId;
				this.cumToaNhaId = cumToaNhaId;
				this.toaNhaId = toaNhaId;
				this.nguoiDungId = nguoiDungId;
				this.userName = userName;
				this.dienGiai = dienGiai;
    }
}
