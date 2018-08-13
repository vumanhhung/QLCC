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
    [Route("api/PhieuThus")]
    public class PhieuThusController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public PhieuThusController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/PhieuThus/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<PhieuThu> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<PhieuThu>().FromSql($"tbl_PhieuThu_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<PhieuThu>();
        }
        
        // GET: api/PhieuThus
        [HttpGet]
        public IEnumerable<PhieuThu> GetPhieuThus()
        {
            return _context.PhieuThus;
        }
        
        // GET: api/PhieuThus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhieuThu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var phieuthu = await _context.PhieuThus.SingleOrDefaultAsync(m => m.PhieuThuId == id);

            if (phieuthu == null)
            {
                return NotFound();
            }

            return Ok(phieuthu);
        }
        
        // PUT: api/PhieuThus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPhieuThu([FromRoute] int id, [FromBody] PhieuThu phieuthu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != phieuthu.PhieuThuId)
            {
                return BadRequest();
            }

            _context.Entry(phieuthu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PhieuThuExists(id))
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
        
        // POST: api/PhieuThus
        [HttpPost]
        public async Task<IActionResult> PostPhieuThu([FromBody] PhieuThu phieuthu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.PhieuThus.Add(phieuthu);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPhieuThu", new { id = phieuthu.PhieuThuId }, phieuthu);
        }
        
        // DELETE: api/PhieuThus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhieuThu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var phieuthu = await _context.PhieuThus.SingleOrDefaultAsync(m => m.PhieuThuId == id);
            if (phieuthu == null)
            {
                return NotFound();
            }

            _context.PhieuThus.Remove(phieuthu);
            await _context.SaveChangesAsync();

            return Ok(phieuthu);
        }
        
        private bool PhieuThuExists(int id)
        {                        
            return _context.PhieuThus.Any(e => e.PhieuThuId == id);
        }
    }    
}