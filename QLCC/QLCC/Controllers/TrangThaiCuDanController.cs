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
    [Route("api/TrangThaiCuDans")]
    public class TrangThaiCuDansController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public TrangThaiCuDansController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/TrangThaiCuDans/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<TrangThaiCuDan> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<TrangThaiCuDan>().FromSql($"tbl_TrangThaiCuDan_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<TrangThaiCuDan>();
        }
        
        // GET: api/TrangThaiCuDans
        [HttpGet]
        public IEnumerable<TrangThaiCuDan> GetTrangThaiCuDans()
        {
            return _context.TrangThaiCuDans;
        }
        
        // GET: api/TrangThaiCuDans/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTrangThaiCuDan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var trangthaicudan = await _context.TrangThaiCuDans.SingleOrDefaultAsync(m => m.TrangThaiCuDanId == id);

            if (trangthaicudan == null)
            {
                return NotFound();
            }

            return Ok(trangthaicudan);
        }
        
        // PUT: api/TrangThaiCuDans/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTrangThaiCuDan([FromRoute] int id, [FromBody] TrangThaiCuDan trangthaicudan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != trangthaicudan.TrangThaiCuDanId)
            {
                return BadRequest();
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            trangthaicudan.NgaySua = DateTime.Now;
            trangthaicudan.NguoiSua = user;
            _context.Entry(trangthaicudan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TrangThaiCuDanExists(id))
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
        
        // POST: api/TrangThaiCuDans
        [HttpPost]
        public async Task<IActionResult> PostTrangThaiCuDan([FromBody] TrangThaiCuDan trangthaicudan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            trangthaicudan.NgayNhap = DateTime.Now;
            trangthaicudan.NguoiNhap = user;
            _context.TrangThaiCuDans.Add(trangthaicudan);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTrangThaiCuDan", new { id = trangthaicudan.TrangThaiCuDanId }, trangthaicudan);
        }
        
        // DELETE: api/TrangThaiCuDans/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrangThaiCuDan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var trangthaicudan = await _context.TrangThaiCuDans.SingleOrDefaultAsync(m => m.TrangThaiCuDanId == id);
            if (trangthaicudan == null)
            {
                return NotFound();
            }

            _context.TrangThaiCuDans.Remove(trangthaicudan);
            await _context.SaveChangesAsync();

            return Ok(trangthaicudan);
        }
        
        private bool TrangThaiCuDanExists(int id)
        {                        
            return _context.TrangThaiCuDans.Any(e => e.TrangThaiCuDanId == id);
        }
    }    
}