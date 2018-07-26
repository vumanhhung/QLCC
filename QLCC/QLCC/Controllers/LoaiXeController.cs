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
    [Route("api/LoaiXes")]
    public class LoaiXesController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public LoaiXesController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/LoaiXes/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<LoaiXe> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<LoaiXe>().FromSql($"tbl_LoaiXe_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<LoaiXe>();
        }
        
        // GET: api/LoaiXes
        [HttpGet]
        public IEnumerable<LoaiXe> GetLoaiXes()
        {
            return _context.LoaiXes;
        }
        
        // GET: api/LoaiXes/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLoaiXe([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaixe = await _context.LoaiXes.SingleOrDefaultAsync(m => m.LoaiXeId == id);

            if (loaixe == null)
            {
                return NotFound();
            }

            return Ok(loaixe);
        }
        
        // PUT: api/LoaiXes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoaiXe([FromRoute] int id, [FromBody] LoaiXe loaixe)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != loaixe.LoaiXeId)
            {
                return BadRequest();
            }

            _context.Entry(loaixe).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoaiXeExists(id))
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
        
        // POST: api/LoaiXes
        [HttpPost]
        public async Task<IActionResult> PostLoaiXe([FromBody] LoaiXe loaixe)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.LoaiXes.Add(loaixe);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLoaiXe", new { id = loaixe.LoaiXeId }, loaixe);
        }
        
        // DELETE: api/LoaiXes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoaiXe([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaixe = await _context.LoaiXes.SingleOrDefaultAsync(m => m.LoaiXeId == id);
            if (loaixe == null)
            {
                return NotFound();
            }

            _context.LoaiXes.Remove(loaixe);
            await _context.SaveChangesAsync();

            return Ok(loaixe);
        }
        
        private bool LoaiXeExists(int id)
        {                        
            return _context.LoaiXes.Any(e => e.LoaiXeId == id);
        }
    }    
}