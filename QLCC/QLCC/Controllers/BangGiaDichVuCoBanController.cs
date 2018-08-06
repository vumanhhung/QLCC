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
    [Route("api/BangGiaDichVuCoBans")]
    public class BangGiaDichVuCoBansController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public BangGiaDichVuCoBansController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/BangGiaDichVuCoBans/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<BangGiaDichVuCoBan> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            var bgcb =  _context.Set<BangGiaDichVuCoBan>().FromSql($"tbl_BangGiaDichVuCoBan_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<BangGiaDichVuCoBan>();
            if (bgcb.Count > 0)
            {
                for (int i = 0; i < bgcb.Count; i++)
                {
                    bgcb[i].LoaiDichVu = _context.LoaiDichVus.SingleOrDefault(o => o.LoaiDichVuId == bgcb[i].LoaiDichVuId);
                    bgcb[i].LoaiTien = _context.LoaiTiens.SingleOrDefault(o => o.LoaiTienId == bgcb[i].LoaiTienId);
                    bgcb[i].DonViTinh = _context.DonViTinhs.SingleOrDefault(o => o.DonViTinhId == bgcb[i].DonViTinhId);
                }
            }
            return bgcb;
        }
        
        // GET: api/BangGiaDichVuCoBans
        [HttpGet]
        public IEnumerable<BangGiaDichVuCoBan> GetBangGiaDichVuCoBans()
        {
            return _context.BangGiaDichVuCoBans;
        }
        
        // GET: api/BangGiaDichVuCoBans/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBangGiaDichVuCoBan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var banggiadichvucoban = await _context.BangGiaDichVuCoBans.SingleOrDefaultAsync(m => m.BangGiaDichVuCoBanId == id);

            if (banggiadichvucoban == null)
            {
                return NotFound();
            }

            return Ok(banggiadichvucoban);
        }
        
        // PUT: api/BangGiaDichVuCoBans/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBangGiaDichVuCoBan([FromRoute] int id, [FromBody] BangGiaDichVuCoBan banggiadichvucoban)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != banggiadichvucoban.BangGiaDichVuCoBanId)
            {
                return BadRequest();
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            banggiadichvucoban.NgaySua = DateTime.Now;
            banggiadichvucoban.NguoiSua = user;
            _context.Entry(banggiadichvucoban).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BangGiaDichVuCoBanExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        
        // POST: api/BangGiaDichVuCoBans
        [HttpPost]
        public async Task<IActionResult> PostBangGiaDichVuCoBan([FromBody] BangGiaDichVuCoBan banggiadichvucoban)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            banggiadichvucoban.NgayNhap = DateTime.Now;
            banggiadichvucoban.NguoiNhap = user;
            _context.BangGiaDichVuCoBans.Add(banggiadichvucoban);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBangGiaDichVuCoBan", new { id = banggiadichvucoban.BangGiaDichVuCoBanId }, banggiadichvucoban);
        }
        
        // DELETE: api/BangGiaDichVuCoBans/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBangGiaDichVuCoBan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var banggiadichvucoban = await _context.BangGiaDichVuCoBans.SingleOrDefaultAsync(m => m.BangGiaDichVuCoBanId == id);
            if (banggiadichvucoban == null)
            {
                return NotFound();
            }

            _context.BangGiaDichVuCoBans.Remove(banggiadichvucoban);
            await _context.SaveChangesAsync();

            return Ok(banggiadichvucoban);
        }
        
        private bool BangGiaDichVuCoBanExists(int id)
        {                        
            return _context.BangGiaDichVuCoBans.Any(e => e.BangGiaDichVuCoBanId == id);
        }

        [HttpGet("GetLoaiDichVu/{id}")]
        public async Task<IActionResult> GetBangGiaDichVuCoBanByLoaiDichVuId([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var banggiadichvucoban = await _context.BangGiaDichVuCoBans.SingleOrDefaultAsync(m => m.LoaiDichVuId == id);

            if (banggiadichvucoban == null)
            {
                return NotFound();
            }

            return Ok(banggiadichvucoban);
        }
    }    
}