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
    [Route("api/TrangThaiYeuCaus")]
    public class TrangThaiYeuCausController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public TrangThaiYeuCausController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/TrangThaiYeuCaus/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<TrangThaiYeuCau> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<TrangThaiYeuCau>().FromSql($"tbl_TrangThaiYeuCau_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<TrangThaiYeuCau>();
        }
        
        // GET: api/TrangThaiYeuCaus
        [HttpGet]
        public IEnumerable<TrangThaiYeuCau> GetTrangThaiYeuCaus()
        {
            return _context.TrangThaiYeuCaus;
        }
        
        // GET: api/TrangThaiYeuCaus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTrangThaiYeuCau([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var trangthaiyeucau = await _context.TrangThaiYeuCaus.SingleOrDefaultAsync(m => m.TrangThaiYeuCauId == id);

            if (trangthaiyeucau == null)
            {
                return NotFound();
            }

            return Ok(trangthaiyeucau);
        }
        
        // PUT: api/TrangThaiYeuCaus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTrangThaiYeuCau([FromRoute] int id, [FromBody] TrangThaiYeuCau trangthaiyeucau)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != trangthaiyeucau.TrangThaiYeuCauId)
            {
                return BadRequest();
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            trangthaiyeucau.NgaySua = DateTime.Now;
            trangthaiyeucau.NguoiSua = user;
            _context.Entry(trangthaiyeucau).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TrangThaiYeuCauExists(id))
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
        
        // POST: api/TrangThaiYeuCaus
        [HttpPost]
        public async Task<IActionResult> PostTrangThaiYeuCau([FromBody] TrangThaiYeuCau trangthaiyeucau)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            trangthaiyeucau.NgayNhap = DateTime.Now;
            trangthaiyeucau.NguoiNhap = user;
            _context.TrangThaiYeuCaus.Add(trangthaiyeucau);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTrangThaiYeuCau", new { id = trangthaiyeucau.TrangThaiYeuCauId }, trangthaiyeucau);
        }
        
        // DELETE: api/TrangThaiYeuCaus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrangThaiYeuCau([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var trangthaiyeucau = await _context.TrangThaiYeuCaus.SingleOrDefaultAsync(m => m.TrangThaiYeuCauId == id);
            if (trangthaiyeucau == null)
            {
                return NotFound();
            }

            _context.TrangThaiYeuCaus.Remove(trangthaiyeucau);
            await _context.SaveChangesAsync();

            return Ok(trangthaiyeucau);
        }
        
        private bool TrangThaiYeuCauExists(int id)
        {                        
            return _context.TrangThaiYeuCaus.Any(e => e.TrangThaiYeuCauId == id);
        }
    }    
}