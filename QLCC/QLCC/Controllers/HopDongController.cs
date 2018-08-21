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
    [Route("api/HopDongs")]
    public class HopDongsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public HopDongsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/HopDongs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<HopDong> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<HopDong>().FromSql($"tbl_HopDong_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<HopDong>();
        }
        
        // GET: api/HopDongs
        [HttpGet]
        public IEnumerable<HopDong> GetHopDongs()
        {
            return _context.HopDongs;
        }
        
        // GET: api/HopDongs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHopDong([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hopdong = await _context.HopDongs.SingleOrDefaultAsync(m => m.HopDongId == id);

            if (hopdong == null)
            {
                return NotFound();
            }

            return Ok(hopdong);
        }
        
        // PUT: api/HopDongs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHopDong([FromRoute] int id, [FromBody] HopDong hopdong)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != hopdong.HopDongId)
            {
                return BadRequest();
            }

            _context.Entry(hopdong).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HopDongExists(id))
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
        
        // POST: api/HopDongs
        [HttpPost]
        public async Task<IActionResult> PostHopDong([FromBody] HopDong hopdong)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.HopDongs.Add(hopdong);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHopDong", new { id = hopdong.HopDongId }, hopdong);
        }
        
        // DELETE: api/HopDongs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHopDong([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hopdong = await _context.HopDongs.SingleOrDefaultAsync(m => m.HopDongId == id);
            if (hopdong == null)
            {
                return NotFound();
            }

            _context.HopDongs.Remove(hopdong);
            await _context.SaveChangesAsync();

            return Ok(hopdong);
        }
        
        private bool HopDongExists(int id)
        {                        
            return _context.HopDongs.Any(e => e.HopDongId == id);
        }
    }    
}