using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;

namespace QLCC.Controllers
{
    [Produces("application/json")]
    [Route("api/YeuCaus")]
    public class YeuCausController : Controller
    {
        private readonly ApplicationDbContext _context;

        public YeuCausController(ApplicationDbContext context)
        {
            _context = context;
        }

        // PUT: api/YeuCaus/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<YeuCau> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {
            List<YeuCau> yc = new List<YeuCau>();
            orderBy = orderBy != "x" ? orderBy : "";
            var lyc = _context.Set<YeuCau>().FromSql($"tbl_YeuCau_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<YeuCau>();
            for (int i = 0; i < lyc.Count; i++)
            {
                YeuCau obj = new YeuCau();
                obj = lyc[i];
                if (lyc[i].MatBangId != 0) obj.MatBang = _context.MatBangs.SingleOrDefault(m => m.MatBangId == lyc[i].MatBangId);
                if (lyc[i].CuDanId != 0) obj.CuDan = _context.CuDans.SingleOrDefault(m => m.CuDanId == lyc[i].CuDanId);
                obj.MucDoUuTien = _context.MucDoUuTiens.SingleOrDefault(m => m.MucDoUuTienId == lyc[i].MucDoUuTienId);
                obj.PhongBan = _context.PhongBans.SingleOrDefault(m => m.PhongBanId == lyc[i].PhongBanId);
                obj.TrangThaiYeuCau = _context.TrangThaiYeuCaus.SingleOrDefault(m => m.TrangThaiYeuCauId == lyc[i].TrangThaiYeuCauId);
                obj.LoaiYeuCau = _context.LoaiYeuCaus.SingleOrDefault(m => m.LoaiYeuCauId == lyc[i].LoaiYeuCauId);
                obj.NguonTiepNhan = _context.NguonTiepNhans.SingleOrDefault(m => m.NguonTiepNhanId == lyc[i].NguonTiepNhanId);
                yc.Add(obj);
            }
            return yc;
        }

        // GET: api/YeuCaus
        [HttpGet]
        public IEnumerable<YeuCau> GetYeuCaus()
        {
            return _context.YeuCaus.Include(o => o.MucDoUuTien).Include(o => o.PhongBan).Include(o => o.TrangThaiYeuCau)
                .Include(o => o.LoaiYeuCau).Include(o => o.NguonTiepNhan);
        }

        // GET: api/YeuCaus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetYeuCau([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var yeucau = await _context.YeuCaus.SingleOrDefaultAsync(m => m.YeuCauId == id);

            if (yeucau == null)
            {
                return NotFound();
            }

            return Ok(yeucau);
        }

        // PUT: api/YeuCaus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutYeuCau([FromRoute] int id, [FromBody] YeuCau yeucau)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != yeucau.YeuCauId)
            {
                return BadRequest();
            }

            _context.Entry(yeucau).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!YeuCauExists(id))
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

        // POST: api/YeuCaus
        [HttpPost]
        public async Task<IActionResult> PostYeuCau([FromBody] YeuCau yeucau)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.YeuCaus.Add(yeucau);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetYeuCau", new { id = yeucau.YeuCauId }, yeucau);
        }

        // DELETE: api/YeuCaus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteYeuCau([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var yeucau = await _context.YeuCaus.SingleOrDefaultAsync(m => m.YeuCauId == id);
            if (yeucau == null)
            {
                return NotFound();
            }

            _context.YeuCaus.Remove(yeucau);
            await _context.SaveChangesAsync();

            return Ok(yeucau);
        }

        private bool YeuCauExists(int id)
        {
            return _context.YeuCaus.Any(e => e.YeuCauId == id);
        }
    }
}