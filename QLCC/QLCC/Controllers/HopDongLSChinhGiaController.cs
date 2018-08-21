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
    [Route("api/HopDongLSChinhGias")]
    public class HopDongLSChinhGiasController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public HopDongLSChinhGiasController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/HopDongLSChinhGias/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<HopDongLSChinhGia> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<HopDongLSChinhGia>().FromSql($"tbl_HopDongLSChinhGia_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<HopDongLSChinhGia>();
        }
        
        // GET: api/HopDongLSChinhGias
        [HttpGet]
        public IEnumerable<HopDongLSChinhGia> GetHopDongLSChinhGias()
        {
            return _context.HopDongLSChinhGias;
        }
        
        // GET: api/HopDongLSChinhGias/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHopDongLSChinhGia([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hopdonglschinhgia = await _context.HopDongLSChinhGias.SingleOrDefaultAsync(m => m.HopDongLSChinhGiaId == id);

            if (hopdonglschinhgia == null)
            {
                return NotFound();
            }

            return Ok(hopdonglschinhgia);
        }
        
        // PUT: api/HopDongLSChinhGias/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHopDongLSChinhGia([FromRoute] int id, [FromBody] HopDongLSChinhGia hopdonglschinhgia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != hopdonglschinhgia.HopDongLSChinhGiaId)
            {
                return BadRequest();
            }

            _context.Entry(hopdonglschinhgia).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HopDongLSChinhGiaExists(id))
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
        
        // POST: api/HopDongLSChinhGias
        [HttpPost]
        public async Task<IActionResult> PostHopDongLSChinhGia([FromBody] HopDongLSChinhGia hopdonglschinhgia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.HopDongLSChinhGias.Add(hopdonglschinhgia);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHopDongLSChinhGia", new { id = hopdonglschinhgia.HopDongLSChinhGiaId }, hopdonglschinhgia);
        }
        
        // DELETE: api/HopDongLSChinhGias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHopDongLSChinhGia([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hopdonglschinhgia = await _context.HopDongLSChinhGias.SingleOrDefaultAsync(m => m.HopDongLSChinhGiaId == id);
            if (hopdonglschinhgia == null)
            {
                return NotFound();
            }

            _context.HopDongLSChinhGias.Remove(hopdonglschinhgia);
            await _context.SaveChangesAsync();

            return Ok(hopdonglschinhgia);
        }
        
        private bool HopDongLSChinhGiaExists(int id)
        {                        
            return _context.HopDongLSChinhGias.Any(e => e.HopDongLSChinhGiaId == id);
        }
    }    
}