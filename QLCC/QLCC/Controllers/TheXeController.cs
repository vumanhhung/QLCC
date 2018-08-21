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
    [Route("api/TheXes")]
    public class TheXesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TheXesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // PUT: api/TheXes/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<TheXe> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {
            orderBy = orderBy != "x" ? orderBy : "";
            var thexes = _context.Set<TheXe>().FromSql($"tbl_TheXe_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<TheXe>();
            for (int i = 0; i < thexes.Count(); i++)
            {
                thexes[i].LoaiXes = _context.LoaiXes.SingleOrDefault(o => o.LoaiXeId == thexes[i].LoaiXeId);
                PhieuThuChiTiet pt = _context.PhieuThuChiTiets.Where(o => o.TheXeId == thexes[i].TheXeId).OrderByDescending(o => o.HanDenNgay).FirstOrDefault();
                thexes[i].PhieuThuChiTiets = pt;
            }
            return thexes;
        }

        // GET: api/TheXes
        [HttpGet]
        public IEnumerable<TheXe> GetTheXes()
        {
            return _context.TheXes;
        }

        // GET: api/TheXes/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTheXe([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var thexe = await _context.TheXes.SingleOrDefaultAsync(m => m.TheXeId == id);

            if (thexe == null)
            {
                return NotFound();
            }

            return Ok(thexe);
        }

        // PUT: api/TheXes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTheXe([FromRoute] int id, [FromBody] TheXe thexe)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != thexe.TheXeId)
            {
                return BadRequest();
            }

            _context.Entry(thexe).State = EntityState.Modified;
            var user = this.User.Identity.Name;
            thexe.NgaySua = DateTime.Now;
            thexe.NguoiSua = user;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TheXeExists(id))
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

        // PUT: api/TheXes/updatelist
        [HttpPut("updatelist")]
        public async Task<IActionResult> PutTheXes([FromBody] TheXe[] thexes)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            for (int i = 0; i < thexes.Count(); i++)
            {
                _context.Entry(thexes[i]).State = EntityState.Modified;                
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/TheXes
        [HttpPost]
        public async Task<IActionResult> PostTheXe([FromBody] TheXe thexe)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = this.User.Identity.Name;
            thexe.NguoiNhap = thexe.NguoiSua = user;
            thexe.NgayDangKy = DateTime.Now;
            thexe.NgaySua = DateTime.Now;
            _context.TheXes.Add(thexe);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTheXe", new { id = thexe.TheXeId }, thexe);
        }

        // DELETE: api/TheXes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTheXe([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var thexe = await _context.TheXes.SingleOrDefaultAsync(m => m.TheXeId == id);
            if (thexe == null)
            {
                return NotFound();
            }

            _context.TheXes.Remove(thexe);
            await _context.SaveChangesAsync();

            return Ok(thexe);
        }

        // DELETE: api/TheXes/deletelist
        [HttpPut("deletelist")]
        public async Task<IActionResult> DeleteTheXes([FromBody] TheXe[] thexes)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            for (int i = 0; i < thexes.Count(); i++)
            {
                _context.TheXes.Remove(thexes[i]);
            }

            await _context.SaveChangesAsync();

            return Ok(thexes);
        }

        private bool TheXeExists(int id)
        {
            return _context.TheXes.Any(e => e.TheXeId == id);
        }
    }
}