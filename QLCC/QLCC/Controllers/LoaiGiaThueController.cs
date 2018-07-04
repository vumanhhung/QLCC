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
    [Route("api/LoaiGiaThues")]
    public class LoaiGiaThuesController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public LoaiGiaThuesController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/LoaiGiaThues/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<LoaiGiaThue> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<LoaiGiaThue>().FromSql($"tbl_LoaiGiaThue_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<LoaiGiaThue>();
        }
        
        // GET: api/LoaiGiaThues
        [HttpGet]
        public IEnumerable<LoaiGiaThue> GetLoaiGiaThues()
        {
            return _context.LoaiGiaThues.Include(m=>m.loaitien);
        }
        
        // GET: api/LoaiGiaThues/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLoaiGiaThue([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaigiathue = await _context.LoaiGiaThues.Include(m => m.loaitien).SingleOrDefaultAsync(m => m.LoaiGiaThueId == id);

            if (loaigiathue == null)
            {
                return NotFound();
            }

            return Ok(loaigiathue);
        }

        // GET: api/ToaNhas/getToaNhaByCum/5
        [HttpGet("getLoaiGiaThueByLoaiTien/{loaitien}")]
        public IEnumerable<LoaiGiaThue> getLoaiGiaThueByLoaiTien([FromRoute] int loaitien)
        {
            var loaigiathue = _context.LoaiGiaThues.Include(m => m.loaitien).Where(m => m.LoaiTienId == loaitien);
            return loaigiathue;
        }

        // PUT: api/LoaiGiaThues/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoaiGiaThue([FromRoute] int id, [FromBody] LoaiGiaThue loaigiathue)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != loaigiathue.LoaiGiaThueId)
            {
                return BadRequest();
            }

            _context.Entry(loaigiathue).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoaiGiaThueExists(id))
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
        
        // POST: api/LoaiGiaThues
        [HttpPost]
        public async Task<IActionResult> PostLoaiGiaThue([FromBody] LoaiGiaThue loaigiathue)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.LoaiGiaThues.Add(loaigiathue);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLoaiGiaThue", new { id = loaigiathue.LoaiGiaThueId }, loaigiathue);
        }
        
        // DELETE: api/LoaiGiaThues/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoaiGiaThue([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaigiathue = await _context.LoaiGiaThues.SingleOrDefaultAsync(m => m.LoaiGiaThueId == id);
            if (loaigiathue == null)
            {
                return NotFound();
            }

            _context.LoaiGiaThues.Remove(loaigiathue);
            await _context.SaveChangesAsync();

            return Ok(loaigiathue);
        }
        
        private bool LoaiGiaThueExists(int id)
        {                        
            return _context.LoaiGiaThues.Include(m => m.loaitien).Any(e => e.LoaiGiaThueId == id);
        }
    }    
}