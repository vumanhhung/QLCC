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
    [Route("api/NganHangs")]
    public class NganHangsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public NganHangsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/NganHangs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<NganHang> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<NganHang>().FromSql($"tbl_NganHang_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<NganHang>();
        }
        
        // GET: api/NganHangs
        [HttpGet]
        public IEnumerable<NganHang> GetNganHangs()
        {
            return _context.NganHangs;
        }
        
        // GET: api/NganHangs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNganHang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nganhang = await _context.NganHangs.SingleOrDefaultAsync(m => m.NganHangId == id);

            if (nganhang == null)
            {
                return NotFound();
            }

            return Ok(nganhang);
        }
        
        // PUT: api/NganHangs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNganHang([FromRoute] int id, [FromBody] NganHang nganhang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != nganhang.NganHangId)
            {
                return BadRequest();
            }

            _context.Entry(nganhang).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NganHangExists(id))
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
        
        // POST: api/NganHangs
        [HttpPost]
        public async Task<IActionResult> PostNganHang([FromBody] NganHang nganhang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.NganHangs.Add(nganhang);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNganHang", new { id = nganhang.NganHangId }, nganhang);
        }
        
        // DELETE: api/NganHangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNganHang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nganhang = await _context.NganHangs.SingleOrDefaultAsync(m => m.NganHangId == id);
            if (nganhang == null)
            {
                return NotFound();
            }

            _context.NganHangs.Remove(nganhang);
            await _context.SaveChangesAsync();

            return Ok(nganhang);
        }
        
        private bool NganHangExists(int id)
        {                        
            return _context.NganHangs.Any(e => e.NganHangId == id);
        }
    }    
}