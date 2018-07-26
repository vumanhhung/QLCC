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
    [Route("api/DinhMucNuocs")]
    public class DinhMucNuocsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public DinhMucNuocsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/DinhMucNuocs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<DinhMucNuoc> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<DinhMucNuoc>().FromSql($"tbl_DinhMucNuoc_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<DinhMucNuoc>();
        }
        
        // GET: api/DinhMucNuocs
        [HttpGet("List/{id}")]
        public IEnumerable<DinhMucNuoc> GetDinhMucNuocs([FromRoute] int id)
        {
            var list = _context.CongThucNuocs.SingleOrDefault(m => m.CongThucNuocId == id);
            return _context.DinhMucNuocs.Where(m => m.CongThucNuocId == list.CongThucNuocId);
        }
        
        // GET: api/DinhMucNuocs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDinhMucNuoc([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dinhmucnuoc = await _context.DinhMucNuocs.SingleOrDefaultAsync(m => m.DinhMucNuocId == id);

            if (dinhmucnuoc == null)
            {
                return NotFound();
            }

            return Ok(dinhmucnuoc);
        }
        
        // PUT: api/DinhMucNuocs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDinhMucNuoc([FromRoute] int id, [FromBody] DinhMucNuoc dinhmucnuoc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != dinhmucnuoc.DinhMucNuocId)
            {
                return BadRequest();
            }

            _context.Entry(dinhmucnuoc).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DinhMucNuocExists(id))
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
        
        // POST: api/DinhMucNuocs
        [HttpPost]
        public async Task<IActionResult> PostDinhMucNuoc([FromBody] DinhMucNuoc dinhmucnuoc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.DinhMucNuocs.Add(dinhmucnuoc);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDinhMucNuoc", new { id = dinhmucnuoc.DinhMucNuocId }, dinhmucnuoc);
        }
        
        // DELETE: api/DinhMucNuocs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDinhMucNuoc([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dinhmucnuoc = await _context.DinhMucNuocs.SingleOrDefaultAsync(m => m.DinhMucNuocId == id);
            if (dinhmucnuoc == null)
            {
                return NotFound();
            }

            _context.DinhMucNuocs.Remove(dinhmucnuoc);
            await _context.SaveChangesAsync();

            return Ok(dinhmucnuoc);
        }
        
        private bool DinhMucNuocExists(int id)
        {                        
            return _context.DinhMucNuocs.Any(e => e.DinhMucNuocId == id);
        }
    }    
}