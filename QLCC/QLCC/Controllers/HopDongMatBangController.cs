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
    [Route("api/HopDongMatBangs")]
    public class HopDongMatBangsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public HopDongMatBangsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/HopDongMatBangs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<HopDongMatBang> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<HopDongMatBang>().FromSql($"tbl_HopDongMatBang_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<HopDongMatBang>();
        }
        
        // GET: api/HopDongMatBangs
        [HttpGet]
        public IEnumerable<HopDongMatBang> GetHopDongMatBangs()
        {
            return _context.HopDongMatBangs;
        }
        
        // GET: api/HopDongMatBangs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHopDongMatBang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hopdongmatbang = await _context.HopDongMatBangs.SingleOrDefaultAsync(m => m.HopDongMatBangId == id);

            if (hopdongmatbang == null)
            {
                return NotFound();
            }

            return Ok(hopdongmatbang);
        }
        
        // PUT: api/HopDongMatBangs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHopDongMatBang([FromRoute] int id, [FromBody] HopDongMatBang hopdongmatbang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != hopdongmatbang.HopDongMatBangId)
            {
                return BadRequest();
            }

            _context.Entry(hopdongmatbang).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HopDongMatBangExists(id))
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
        
        // POST: api/HopDongMatBangs
        [HttpPost]
        public async Task<IActionResult> PostHopDongMatBang([FromBody] HopDongMatBang hopdongmatbang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.HopDongMatBangs.Add(hopdongmatbang);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHopDongMatBang", new { id = hopdongmatbang.HopDongMatBangId }, hopdongmatbang);
        }
        
        // DELETE: api/HopDongMatBangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHopDongMatBang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hopdongmatbang = await _context.HopDongMatBangs.SingleOrDefaultAsync(m => m.HopDongMatBangId == id);
            if (hopdongmatbang == null)
            {
                return NotFound();
            }

            _context.HopDongMatBangs.Remove(hopdongmatbang);
            await _context.SaveChangesAsync();

            return Ok(hopdongmatbang);
        }
        
        private bool HopDongMatBangExists(int id)
        {                        
            return _context.HopDongMatBangs.Any(e => e.HopDongMatBangId == id);
        }
    }    
}