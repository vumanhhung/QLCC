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
    [Route("api/DichVuNuocs")]
    public class DichVuNuocsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public DichVuNuocsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/DichVuNuocs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<DichVuNuoc> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<DichVuNuoc>().FromSql($"tbl_DichVuNuoc_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<DichVuNuoc>();
        }
        
        // GET: api/DichVuNuocs
        [HttpGet]
        public IEnumerable<DichVuNuoc> GetDichVuNuocs()
        {
            return _context.DichVuNuocs;
        }
        
        // GET: api/DichVuNuocs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDichVuNuoc([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dichvunuoc = await _context.DichVuNuocs.SingleOrDefaultAsync(m => m.DichVuNuocId == id);

            if (dichvunuoc == null)
            {
                return NotFound();
            }

            return Ok(dichvunuoc);
        }
        
        // PUT: api/DichVuNuocs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDichVuNuoc([FromRoute] int id, [FromBody] DichVuNuoc dichvunuoc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != dichvunuoc.DichVuNuocId)
            {
                return BadRequest();
            }

            _context.Entry(dichvunuoc).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DichVuNuocExists(id))
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
        
        // POST: api/DichVuNuocs
        [HttpPost]
        public async Task<IActionResult> PostDichVuNuoc([FromBody] DichVuNuoc dichvunuoc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.DichVuNuocs.Add(dichvunuoc);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDichVuNuoc", new { id = dichvunuoc.DichVuNuocId }, dichvunuoc);
        }
        
        // DELETE: api/DichVuNuocs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDichVuNuoc([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dichvunuoc = await _context.DichVuNuocs.SingleOrDefaultAsync(m => m.DichVuNuocId == id);
            if (dichvunuoc == null)
            {
                return NotFound();
            }

            _context.DichVuNuocs.Remove(dichvunuoc);
            await _context.SaveChangesAsync();

            return Ok(dichvunuoc);
        }
        
        private bool DichVuNuocExists(int id)
        {                        
            return _context.DichVuNuocs.Any(e => e.DichVuNuocId == id);
        }
    }    
}