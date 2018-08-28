using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;
using QLCC.Helpers;

namespace QLCC.Controllers
{
    [Produces("application/json")]
    [Route("api/VatTus")]
    public class VatTusController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public VatTusController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/VatTus/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<VatTu> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<VatTu>().FromSql($"tbl_VatTu_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<VatTu>();
        }
        
        // GET: api/VatTus
        [HttpGet]
        public IEnumerable<VatTu> GetVatTus()
        {
            return _context.VatTus.Include(r => r.quocTichs).Include(r => r.loaiHangs).Include(r => r.nhaCungCaps).Include(r => r.hangSanXuats).Include(r => r.donViTinhs).Include(r => r.phongBans).Include(r => r.loaiTiens);
        }
        
        // GET: api/VatTus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVatTu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattu = await _context.VatTus.SingleOrDefaultAsync(m => m.VatTuId == id);

            if (vattu == null)
            {
                return NotFound();
            }

            return Ok(vattu);
        }
        
        // PUT: api/VatTus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVatTu([FromRoute] int id, [FromBody] VatTu vattu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vattu.VatTuId)
            {
                return BadRequest();
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            vattu.NgaySua = DateTime.Now;
            vattu.NguoiSua = user;
            var checkten = await _context.VatTus.SingleOrDefaultAsync(r => r.MaVatTuCha == vattu.MaVatTuCha && r.TenVatTu == vattu.TenVatTu && r.VatTuId != id);
            if (checkten == null)
            {
                _context.Entry(vattu).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                var vt = "";
                if (checkten != null)
                {
                    vt = "Exist";

                }
                return Ok(vt);
            }
        }
        
        // POST: api/VatTus
        [HttpPost]
        public async Task<IActionResult> PostVatTu([FromBody] VatTu vattu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            vattu.NgayNhap = DateTime.Now;
            vattu.NguoiNhap = user;
            var checkten = await _context.VatTus.SingleOrDefaultAsync(r => r.MaVatTuCha == vattu.MaVatTuCha && r.TenVatTu == vattu.TenVatTu);
            if (checkten == null)
            {
                _context.VatTus.Add(vattu);
                await _context.SaveChangesAsync();
                return CreatedAtAction("Getvattu", new { id = vattu.VatTuId }, vattu);
            }
            else
            {
                var vt = new VatTu();
                if (checkten != null)
                {
                    vt.TenVatTu = "Exist";

                }
                return Ok(vt);
            }
        }
        
        // DELETE: api/VatTus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVatTu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattu = await _context.VatTus.SingleOrDefaultAsync(m => m.VatTuId == id);
            if (vattu == null)
            {
                return NotFound();
            }

            _context.VatTus.Remove(vattu);
            await _context.SaveChangesAsync();

            return Ok(vattu);
        }
        
        private bool VatTuExists(int id)
        {                        
            return _context.VatTus.Any(e => e.VatTuId == id);
        }

        //[HttpGet("GetLoaiHang")]
        //public IEnumerable<LoaiHang> GetLoaiHangs()
        //{
        //    return _context.LoaiHangs.Where(r => r.TrangThai == true).ToList<LoaiHang>();
        //}

        //[HttpGet("GetHangSX")]
        //public IEnumerable<HangSanXuat> GetHangSanXuats()
        //{
        //    return _context.HangSanXuats.Where(r => r.TrangThai == true).ToList<HangSanXuat>();
        //}
    }    
}