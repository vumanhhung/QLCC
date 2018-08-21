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
    [Route("api/HopDongDichVus")]
    public class HopDongDichVusController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public HopDongDichVusController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/HopDongDichVus/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<HopDongDichVu> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<HopDongDichVu>().FromSql($"tbl_HopDongDichVu_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<HopDongDichVu>();
        }
        
        // GET: api/HopDongDichVus
        [HttpGet]
        public IEnumerable<HopDongDichVu> GetHopDongDichVus()
        {
            return _context.HopDongDichVus;
        }
        
        // GET: api/HopDongDichVus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHopDongDichVu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hopdongdichvu = await _context.HopDongDichVus.SingleOrDefaultAsync(m => m.HopDongDichVuId == id);

            if (hopdongdichvu == null)
            {
                return NotFound();
            }

            return Ok(hopdongdichvu);
        }
        
        // PUT: api/HopDongDichVus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHopDongDichVu([FromRoute] int id, [FromBody] HopDongDichVu hopdongdichvu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != hopdongdichvu.HopDongDichVuId)
            {
                return BadRequest();
            }

            _context.Entry(hopdongdichvu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HopDongDichVuExists(id))
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
        
        // POST: api/HopDongDichVus
        [HttpPost]
        public async Task<IActionResult> PostHopDongDichVu([FromBody] HopDongDichVu hopdongdichvu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.HopDongDichVus.Add(hopdongdichvu);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHopDongDichVu", new { id = hopdongdichvu.HopDongDichVuId }, hopdongdichvu);
        }
        
        // DELETE: api/HopDongDichVus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHopDongDichVu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hopdongdichvu = await _context.HopDongDichVus.SingleOrDefaultAsync(m => m.HopDongDichVuId == id);
            if (hopdongdichvu == null)
            {
                return NotFound();
            }

            _context.HopDongDichVus.Remove(hopdongdichvu);
            await _context.SaveChangesAsync();

            return Ok(hopdongdichvu);
        }
        
        private bool HopDongDichVuExists(int id)
        {                        
            return _context.HopDongDichVus.Any(e => e.HopDongDichVuId == id);
        }
    }    
}