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
    [Route("api/LoaiDichVus")]
    public class LoaiDichVusController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public LoaiDichVusController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/LoaiDichVus/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<LoaiDichVu> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<LoaiDichVu>().FromSql($"tbl_LoaiDichVu_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<LoaiDichVu>();
        }
        
        // GET: api/LoaiDichVus
        [HttpGet]
        public IEnumerable<LoaiDichVu> GetLoaiDichVus()
        {
            return _context.LoaiDichVus;
        }
        
        // GET: api/LoaiDichVus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLoaiDichVu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaidichvu = await _context.LoaiDichVus.SingleOrDefaultAsync(m => m.LoaiDichVuId == id);

            if (loaidichvu == null)
            {
                return NotFound();
            }

            return Ok(loaidichvu);
        }
        
        // PUT: api/LoaiDichVus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoaiDichVu([FromRoute] int id, [FromBody] LoaiDichVu loaidichvu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != loaidichvu.LoaiDichVuId)
            {
                return BadRequest();
            }

            _context.Entry(loaidichvu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoaiDichVuExists(id))
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
        
        // POST: api/LoaiDichVus
        [HttpPost]
        public async Task<IActionResult> PostLoaiDichVu([FromBody] LoaiDichVu loaidichvu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.LoaiDichVus.Add(loaidichvu);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLoaiDichVu", new { id = loaidichvu.LoaiDichVuId }, loaidichvu);
        }
        
        // DELETE: api/LoaiDichVus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoaiDichVu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaidichvu = await _context.LoaiDichVus.SingleOrDefaultAsync(m => m.LoaiDichVuId == id);
            if (loaidichvu == null)
            {
                return NotFound();
            }

            _context.LoaiDichVus.Remove(loaidichvu);
            await _context.SaveChangesAsync();

            return Ok(loaidichvu);
        }
        
        private bool LoaiDichVuExists(int id)
        {                        
            return _context.LoaiDichVus.Any(e => e.LoaiDichVuId == id);
        }
    }    
}