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
    [Route("api/MucDoUuTiens")]
    public class MucDoUuTiensController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public MucDoUuTiensController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/MucDoUuTiens/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<MucDoUuTien> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<MucDoUuTien>().FromSql($"tbl_MucDoUuTien_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<MucDoUuTien>();
        }
        
        // GET: api/MucDoUuTiens
        [HttpGet]
        public IEnumerable<MucDoUuTien> GetMucDoUuTiens()
        {
            return _context.MucDoUuTiens;
        }
        
        // GET: api/MucDoUuTiens/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMucDoUuTien([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var mucdouutien = await _context.MucDoUuTiens.SingleOrDefaultAsync(m => m.MucDoUuTienId == id);

            if (mucdouutien == null)
            {
                return NotFound();
            }

            return Ok(mucdouutien);
        }
        
        // PUT: api/MucDoUuTiens/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMucDoUuTien([FromRoute] int id, [FromBody] MucDoUuTien mucdouutien)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != mucdouutien.MucDoUuTienId)
            {
                return BadRequest();
            }

            _context.Entry(mucdouutien).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MucDoUuTienExists(id))
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
        
        // POST: api/MucDoUuTiens
        [HttpPost]
        public async Task<IActionResult> PostMucDoUuTien([FromBody] MucDoUuTien mucdouutien)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.MucDoUuTiens.Add(mucdouutien);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMucDoUuTien", new { id = mucdouutien.MucDoUuTienId }, mucdouutien);
        }
        
        // DELETE: api/MucDoUuTiens/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMucDoUuTien([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var mucdouutien = await _context.MucDoUuTiens.SingleOrDefaultAsync(m => m.MucDoUuTienId == id);
            if (mucdouutien == null)
            {
                return NotFound();
            }

            _context.MucDoUuTiens.Remove(mucdouutien);
            await _context.SaveChangesAsync();

            return Ok(mucdouutien);
        }
        
        private bool MucDoUuTienExists(int id)
        {                        
            return _context.MucDoUuTiens.Any(e => e.MucDoUuTienId == id);
        }
    }    
}