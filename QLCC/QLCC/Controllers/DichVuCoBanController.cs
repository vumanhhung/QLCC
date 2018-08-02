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
    [Route("api/DichVuCoBans")]
    public class DichVuCoBansController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public DichVuCoBansController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/DichVuCoBans/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<DichVuCoBan> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<DichVuCoBan>().FromSql($"tbl_DichVuCoBan_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<DichVuCoBan>();
        }
        
        // GET: api/DichVuCoBans
        [HttpGet]
        public IEnumerable<DichVuCoBan> GetDichVuCoBans()
        {
            return _context.DichVuCoBans.Include(m => m.matBangs).Include(m => m.khachHangs).Include(m => m.loaiDichVus).Include(m => m.loaiTiens).Include(m => m.donViTinhs);
        }
        
        // GET: api/DichVuCoBans/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDichVuCoBan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dichvucoban = await _context.DichVuCoBans.SingleOrDefaultAsync(m => m.DichVuCoBanId == id);

            if (dichvucoban == null)
            {
                return NotFound();
            }

            return Ok(dichvucoban);
        }
        
        // PUT: api/DichVuCoBans/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDichVuCoBan([FromRoute] int id, [FromBody] DichVuCoBan dichvucoban)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != dichvucoban.DichVuCoBanId)
            {
                return BadRequest();
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            dichvucoban.NgaySua = DateTime.Now;
            dichvucoban.NguoiSua = user;
            var checkten = await _context.DichVuCoBans.SingleOrDefaultAsync(r => r.SoChungTu == dichvucoban.SoChungTu && r.DichVuCoBanId != id);
            if (checkten == null)
            {
                _context.Entry(dichvucoban).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                var warn = "";
                if (checkten != null)
                {
                    warn = "Exist";
                }
                return Ok(warn);
            }
        }
        
        // POST: api/DichVuCoBans
        [HttpPost]
        public async Task<IActionResult> PostDichVuCoBan([FromBody] DichVuCoBan dichvucoban)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            dichvucoban.NgayNhap = DateTime.Now;
            dichvucoban.NguoiNhap = user;
            var checkten = await _context.DichVuCoBans.SingleOrDefaultAsync(r => r.SoChungTu == dichvucoban.SoChungTu);
            if (checkten == null)
            {
                _context.DichVuCoBans.Add(dichvucoban);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetDichVuCoBan", new { id = dichvucoban.DichVuCoBanId }, dichvucoban);
            }
            else
            {
                var warn = new DichVuCoBan();
                if (checkten != null)
                {
                    warn.SoChungTu = "Exist";
                }
                return Ok(warn);
            }
        }
        
        // DELETE: api/DichVuCoBans/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDichVuCoBan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dichvucoban = await _context.DichVuCoBans.SingleOrDefaultAsync(m => m.DichVuCoBanId == id);
            if (dichvucoban == null)
            {
                return NotFound();
            }

            _context.DichVuCoBans.Remove(dichvucoban);
            await _context.SaveChangesAsync();

            return Ok(dichvucoban);
        }
        
        private bool DichVuCoBanExists(int id)
        {                        
            return _context.DichVuCoBans.Any(e => e.DichVuCoBanId == id);
        }

        [HttpGet("CheckExpire")]
        public async Task<ActionResult> getLapLai()
        {
            var expire = new DateTime();
            var checkExpire = await _context.DichVuCoBans.SingleOrDefaultAsync(r => r.DenNgay == expire && r.LapLai == true);
            return Ok(checkExpire);
        }
    }    
}