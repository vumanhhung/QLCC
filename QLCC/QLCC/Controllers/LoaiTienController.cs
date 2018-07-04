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
    [Route("api/LoaiTiens")]
    public class LoaiTiensController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public LoaiTiensController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/LoaiTiens/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<LoaiTien> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<LoaiTien>().FromSql($"tbl_LoaiTien_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<LoaiTien>();
        }
        
        // GET: api/LoaiTiens
        [HttpGet]
        public IEnumerable<LoaiTien> GetLoaiTiens()
        {
            return _context.LoaiTiens;
        }
        
        // GET: api/LoaiTiens/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLoaiTien([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaitien = await _context.LoaiTiens.SingleOrDefaultAsync(m => m.LoaiTienId == id);

            if (loaitien == null)
            {
                return NotFound();
            }

            return Ok(loaitien);
        }



        // PUT: api/LoaiTiens/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoaiTien([FromRoute] int id, [FromBody] LoaiTien loaitien)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != loaitien.LoaiTienId)
            {
                return BadRequest();
            }

            _context.Entry(loaitien).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoaiTienExists(id))
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
        
        // POST: api/LoaiTiens
        [HttpPost]
        public async Task<IActionResult> PostLoaiTien([FromBody] LoaiTien loaitien)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.LoaiTiens.Add(loaitien);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLoaiTien", new { id = loaitien.LoaiTienId }, loaitien);
        }
        
        // DELETE: api/LoaiTiens/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoaiTien([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaitien = await _context.LoaiTiens.SingleOrDefaultAsync(m => m.LoaiTienId == id);
            if (loaitien == null)
            {
                return NotFound();
            }

            _context.LoaiTiens.Remove(loaitien);
            await _context.SaveChangesAsync();

            return Ok(loaitien);
        }
        
        private bool LoaiTienExists(int id)
        {                        
            return _context.LoaiTiens.Any(e => e.LoaiTienId == id);
        }
    }    
}