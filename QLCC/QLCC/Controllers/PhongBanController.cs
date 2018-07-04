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
    [Route("api/PhongBans")]
    public class PhongBansController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public PhongBansController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/PhongBans/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<PhongBan> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<PhongBan>().FromSql($"tbl_PhongBan_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<PhongBan>();
        }
        
        // GET: api/PhongBans
        [HttpGet]
        public IEnumerable<PhongBan> GetPhongBans()
        {
            return _context.PhongBans.Include(m=>m.toanha);
        }
        
        // GET: api/PhongBans/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhongBan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var phongban = await _context.PhongBans.Include(m => m.toanha).SingleOrDefaultAsync(m => m.PhongBanId == id);

            if (phongban == null)
            {
                return NotFound();
            }

            return Ok(phongban);
        }
        
        // PUT: api/PhongBans/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPhongBan([FromRoute] int id, [FromBody] PhongBan phongban)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != phongban.PhongBanId)
            {
                return BadRequest();
            }

            _context.Entry(phongban).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PhongBanExists(id))
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

        // GET: api/ToaNhas/getToaNhaByCum/5,5
        [HttpGet("getPhongBanByToaNha/{toanhaId}/{cumtoanhId}")]
        public IEnumerable<PhongBan> getPhongBanByToaNha([FromRoute] int toanhaId, int cumtoanhId)
        {
            if (toanhaId != 0)
            {
                var phongbans = _context.PhongBans.Include(m => m.toanha).Where(m => m.ToaNhaId == toanhaId);
                return phongbans;
            }
            else
            {
                var phongbans = from a in _context.PhongBans.Include(m => m.toanha)
                let toanhaid = _context.ToaNhas.Where(m => m.CumToaNhaId == cumtoanhId).Select(m => m.ToaNhaId)
                               where toanhaid.Contains((int)a.ToaNhaId)
                               select a;
                return phongbans;
            }
        }

        // POST: api/PhongBans
        [HttpPost]
        public async Task<IActionResult> PostPhongBan([FromBody] PhongBan phongban)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.PhongBans.Add(phongban);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPhongBan", new { id = phongban.PhongBanId }, phongban);
        }
        
        // DELETE: api/PhongBans/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhongBan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var phongban = await _context.PhongBans.SingleOrDefaultAsync(m => m.PhongBanId == id);
            if (phongban == null)
            {
                return NotFound();
            }

            _context.PhongBans.Remove(phongban);
            await _context.SaveChangesAsync();

            return Ok(phongban);
        }
        
        private bool PhongBanExists(int id)
        {                        
            return _context.PhongBans.Any(e => e.PhongBanId == id);
        }
    }    
}