using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;
using QLCC.Helpers;

namespace QLCC.Controllers
{
    [Produces("application/json")]
    [Route("api/LoaiYeuCaus")]
    public class LoaiYeuCausController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public LoaiYeuCausController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/LoaiYeuCaus/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<LoaiYeuCau> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<LoaiYeuCau>().FromSql($"tbl_LoaiYeuCau_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<LoaiYeuCau>();
        }
        
        // GET: api/LoaiYeuCaus
        [HttpGet]
        public IEnumerable<LoaiYeuCau> GetLoaiYeuCaus()
        {
            return _context.LoaiYeuCaus;
        }
        
        // GET: api/LoaiYeuCaus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLoaiYeuCau([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaiyeucau = await _context.LoaiYeuCaus.SingleOrDefaultAsync(m => m.LoaiYeuCauId == id);

            if (loaiyeucau == null)
            {
                return NotFound();
            }

            return Ok(loaiyeucau);
        }
        
        // PUT: api/LoaiYeuCaus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoaiYeuCau([FromRoute] int id, [FromBody] LoaiYeuCau loaiyeucau)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != loaiyeucau.LoaiYeuCauId)
            {
                return BadRequest();
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            loaiyeucau.NgaySua = DateTime.Now;
            loaiyeucau.NguoiSua = user;
            _context.Entry(loaiyeucau).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoaiYeuCauExists(id))
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
        
        // POST: api/LoaiYeuCaus
        [HttpPost]
        public async Task<IActionResult> PostLoaiYeuCau([FromBody] LoaiYeuCau loaiyeucau)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            loaiyeucau.NgayNhap = DateTime.Now;
            loaiyeucau.NguoiNhap = user;
            _context.LoaiYeuCaus.Add(loaiyeucau);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLoaiYeuCau", new { id = loaiyeucau.LoaiYeuCauId }, loaiyeucau);
        }
        
        // DELETE: api/LoaiYeuCaus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoaiYeuCau([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaiyeucau = await _context.LoaiYeuCaus.SingleOrDefaultAsync(m => m.LoaiYeuCauId == id);
            if (loaiyeucau == null)
            {
                return NotFound();
            }

            _context.LoaiYeuCaus.Remove(loaiyeucau);
            await _context.SaveChangesAsync();

            return Ok(loaiyeucau);
        }
        
        private bool LoaiYeuCauExists(int id)
        {                        
            return _context.LoaiYeuCaus.Any(e => e.LoaiYeuCauId == id);
        }
    }    
}