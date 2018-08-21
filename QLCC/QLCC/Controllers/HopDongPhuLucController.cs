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
    [Route("api/HopDongPhuLucs")]
    public class HopDongPhuLucsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public HopDongPhuLucsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/HopDongPhuLucs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<HopDongPhuLuc> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<HopDongPhuLuc>().FromSql($"tbl_HopDongPhuLuc_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<HopDongPhuLuc>();
        }
        
        // GET: api/HopDongPhuLucs
        [HttpGet]
        public IEnumerable<HopDongPhuLuc> GetHopDongPhuLucs()
        {
            return _context.HopDongPhuLucs;
        }
        
        // GET: api/HopDongPhuLucs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHopDongPhuLuc([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hopdongphuluc = await _context.HopDongPhuLucs.SingleOrDefaultAsync(m => m.HopDongPhuLucId == id);

            if (hopdongphuluc == null)
            {
                return NotFound();
            }

            return Ok(hopdongphuluc);
        }
        
        // PUT: api/HopDongPhuLucs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHopDongPhuLuc([FromRoute] int id, [FromBody] HopDongPhuLuc hopdongphuluc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != hopdongphuluc.HopDongPhuLucId)
            {
                return BadRequest();
            }

            _context.Entry(hopdongphuluc).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HopDongPhuLucExists(id))
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
        
        // POST: api/HopDongPhuLucs
        [HttpPost]
        public async Task<IActionResult> PostHopDongPhuLuc([FromBody] HopDongPhuLuc hopdongphuluc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.HopDongPhuLucs.Add(hopdongphuluc);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHopDongPhuLuc", new { id = hopdongphuluc.HopDongPhuLucId }, hopdongphuluc);
        }
        
        // DELETE: api/HopDongPhuLucs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHopDongPhuLuc([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hopdongphuluc = await _context.HopDongPhuLucs.SingleOrDefaultAsync(m => m.HopDongPhuLucId == id);
            if (hopdongphuluc == null)
            {
                return NotFound();
            }

            _context.HopDongPhuLucs.Remove(hopdongphuluc);
            await _context.SaveChangesAsync();

            return Ok(hopdongphuluc);
        }
        
        private bool HopDongPhuLucExists(int id)
        {                        
            return _context.HopDongPhuLucs.Any(e => e.HopDongPhuLucId == id);
        }
    }    
}