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
    [Route("api/HangSanXuats")]
    public class HangSanXuatsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public HangSanXuatsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/HangSanXuats/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<HangSanXuat> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<HangSanXuat>().FromSql($"tbl_HangSanXuat_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<HangSanXuat>();
        }
        
        // GET: api/HangSanXuats
        [HttpGet]
        public IEnumerable<HangSanXuat> GetHangSanXuats()
        {
            return _context.HangSanXuats;
        }
        
        // GET: api/HangSanXuats/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHangSanXuat([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hangsanxuat = await _context.HangSanXuats.SingleOrDefaultAsync(m => m.HangSanXuatId == id);

            if (hangsanxuat == null)
            {
                return NotFound();
            }

            return Ok(hangsanxuat);
        }
        
        // PUT: api/HangSanXuats/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHangSanXuat([FromRoute] int id, [FromBody] HangSanXuat hangsanxuat)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != hangsanxuat.HangSanXuatId)
            {
                return BadRequest();
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            hangsanxuat.NgaySua = DateTime.Now;
            hangsanxuat.NguoiSua = user;
            _context.Entry(hangsanxuat).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HangSanXuatExists(id))
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
        
        // POST: api/HangSanXuats
        [HttpPost]
        public async Task<IActionResult> PostHangSanXuat([FromBody] HangSanXuat hangsanxuat)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //var user = this.User.Identity.Name;
            //var userId = Utilities.GetUserId(this.User);
            //hangsanxuat.NgayNhap = DateTime.Now;
            //hangsanxuat.NguoiNhap = user;
            _context.HangSanXuats.Add(hangsanxuat);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHangSanXuat", new { id = hangsanxuat.HangSanXuatId }, hangsanxuat);
        }
        
        // DELETE: api/HangSanXuats/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHangSanXuat([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hangsanxuat = await _context.HangSanXuats.SingleOrDefaultAsync(m => m.HangSanXuatId == id);
            if (hangsanxuat == null)
            {
                return NotFound();
            }

            _context.HangSanXuats.Remove(hangsanxuat);
            await _context.SaveChangesAsync();

            return Ok(hangsanxuat);
        }

        [HttpGet("FilterStatus/{status}")]
        public IEnumerable<HangSanXuat> getFilterStatus([FromRoute] bool status)
        {
            return _context.HangSanXuats.Where(m => m.TrangThai == status).ToList();
        }
        private bool HangSanXuatExists(int id)
        {                        
            return _context.HangSanXuats.Any(e => e.HangSanXuatId == id);
        }
    }    
}