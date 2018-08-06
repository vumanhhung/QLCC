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
    [Route("api/NguonTiepNhans")]
    public class NguonTiepNhansController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public NguonTiepNhansController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/NguonTiepNhans/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<NguonTiepNhan> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<NguonTiepNhan>().FromSql($"tbl_NguonTiepNhan_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<NguonTiepNhan>();
        }
        
        // GET: api/NguonTiepNhans
        [HttpGet]
        public IEnumerable<NguonTiepNhan> GetNguonTiepNhans()
        {
            return _context.NguonTiepNhans;
        }
        
        // GET: api/NguonTiepNhans/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNguonTiepNhan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nguontiepnhan = await _context.NguonTiepNhans.SingleOrDefaultAsync(m => m.NguonTiepNhanId == id);

            if (nguontiepnhan == null)
            {
                return NotFound();
            }

            return Ok(nguontiepnhan);
        }
        
        // PUT: api/NguonTiepNhans/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNguonTiepNhan([FromRoute] int id, [FromBody] NguonTiepNhan nguontiepnhan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != nguontiepnhan.NguonTiepNhanId)
            {
                return BadRequest();
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            nguontiepnhan.NgaySua = DateTime.Now;
            nguontiepnhan.NguoiSua = user;
            _context.Entry(nguontiepnhan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NguonTiepNhanExists(id))
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
        
        // POST: api/NguonTiepNhans
        [HttpPost]
        public async Task<IActionResult> PostNguonTiepNhan([FromBody] NguonTiepNhan nguontiepnhan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            nguontiepnhan.NgayNhap = DateTime.Now;
            nguontiepnhan.NguoiNhap = user;
            _context.NguonTiepNhans.Add(nguontiepnhan);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNguonTiepNhan", new { id = nguontiepnhan.NguonTiepNhanId }, nguontiepnhan);
        }
        
        // DELETE: api/NguonTiepNhans/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNguonTiepNhan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nguontiepnhan = await _context.NguonTiepNhans.SingleOrDefaultAsync(m => m.NguonTiepNhanId == id);
            if (nguontiepnhan == null)
            {
                return NotFound();
            }

            _context.NguonTiepNhans.Remove(nguontiepnhan);
            await _context.SaveChangesAsync();

            return Ok(nguontiepnhan);
        }
        
        private bool NguonTiepNhanExists(int id)
        {                        
            return _context.NguonTiepNhans.Any(e => e.NguonTiepNhanId == id);
        }
    }    
}