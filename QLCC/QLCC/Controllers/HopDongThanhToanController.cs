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
    [Route("api/HopDongThanhToans")]
    public class HopDongThanhToansController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public HopDongThanhToansController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/HopDongThanhToans/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<HopDongThanhToan> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<HopDongThanhToan>().FromSql($"tbl_HopDongThanhToan_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<HopDongThanhToan>();
        }
        
        // GET: api/HopDongThanhToans
        [HttpGet]
        public IEnumerable<HopDongThanhToan> GetHopDongThanhToans()
        {
            return _context.HopDongThanhToans;
        }
        
        // GET: api/HopDongThanhToans/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHopDongThanhToan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hopdongthanhtoan = await _context.HopDongThanhToans.SingleOrDefaultAsync(m => m.HopDongThanhToanId == id);

            if (hopdongthanhtoan == null)
            {
                return NotFound();
            }

            return Ok(hopdongthanhtoan);
        }
        
        // PUT: api/HopDongThanhToans/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHopDongThanhToan([FromRoute] int id, [FromBody] HopDongThanhToan hopdongthanhtoan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != hopdongthanhtoan.HopDongThanhToanId)
            {
                return BadRequest();
            }

            _context.Entry(hopdongthanhtoan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HopDongThanhToanExists(id))
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
        
        // POST: api/HopDongThanhToans
        [HttpPost]
        public async Task<IActionResult> PostHopDongThanhToan([FromBody] HopDongThanhToan hopdongthanhtoan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.HopDongThanhToans.Add(hopdongthanhtoan);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHopDongThanhToan", new { id = hopdongthanhtoan.HopDongThanhToanId }, hopdongthanhtoan);
        }
        
        // DELETE: api/HopDongThanhToans/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHopDongThanhToan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hopdongthanhtoan = await _context.HopDongThanhToans.SingleOrDefaultAsync(m => m.HopDongThanhToanId == id);
            if (hopdongthanhtoan == null)
            {
                return NotFound();
            }

            _context.HopDongThanhToans.Remove(hopdongthanhtoan);
            await _context.SaveChangesAsync();

            return Ok(hopdongthanhtoan);
        }
        
        private bool HopDongThanhToanExists(int id)
        {                        
            return _context.HopDongThanhToans.Any(e => e.HopDongThanhToanId == id);
        }
    }    
}