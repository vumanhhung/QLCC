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
    [Route("api/BangGiaXes")]
    public class BangGiaXesController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public BangGiaXesController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/BangGiaXes/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<BangGiaXe> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<BangGiaXe>().FromSql($"tbl_BangGiaXe_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<BangGiaXe>();
        }
        
        // GET: api/BangGiaXes
        [HttpGet]
        public IEnumerable<BangGiaXe> GetBangGiaXes()
        {
            return _context.BangGiaXes;
        }
        
        // GET: api/BangGiaXes/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBangGiaXe([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var banggiaxe = await _context.BangGiaXes.SingleOrDefaultAsync(m => m.BangGiaXeId == id);

            if (banggiaxe == null)
            {
                return NotFound();
            }

            return Ok(banggiaxe);
        }
        
        // PUT: api/BangGiaXes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBangGiaXe([FromRoute] int id, [FromBody] BangGiaXe banggiaxe)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != banggiaxe.BangGiaXeId)
            {
                return BadRequest();
            }

            _context.Entry(banggiaxe).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BangGiaXeExists(id))
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
        
        // POST: api/BangGiaXes
        [HttpPost]
        public async Task<IActionResult> PostBangGiaXe([FromBody] BangGiaXe banggiaxe)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.BangGiaXes.Add(banggiaxe);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBangGiaXe", new { id = banggiaxe.BangGiaXeId }, banggiaxe);
        }
        
        // DELETE: api/BangGiaXes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBangGiaXe([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var banggiaxe = await _context.BangGiaXes.SingleOrDefaultAsync(m => m.BangGiaXeId == id);
            if (banggiaxe == null)
            {
                return NotFound();
            }

            _context.BangGiaXes.Remove(banggiaxe);
            await _context.SaveChangesAsync();

            return Ok(banggiaxe);
        }
        
        private bool BangGiaXeExists(int id)
        {                        
            return _context.BangGiaXes.Any(e => e.BangGiaXeId == id);
        }
    }    
}