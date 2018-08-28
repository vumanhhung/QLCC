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
    [Route("api/LoaiMatBangs")]
    public class LoaiMatBangsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public LoaiMatBangsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/LoaiMatBangs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<LoaiMatBang> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<LoaiMatBang>().FromSql($"tbl_LoaiMatBang_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<LoaiMatBang>();
        }
        
        // GET: api/LoaiMatBangs
        [HttpGet]
        public IEnumerable<LoaiMatBang> GetLoaiMatBangs()
        {
            return _context.LoaiMatBangs;
        }
        
        // GET: api/LoaiMatBangs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLoaiMatBang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaimatbang = await _context.LoaiMatBangs.SingleOrDefaultAsync(m => m.LoaiMatBangId == id);

            if (loaimatbang == null)
            {
                return NotFound();
            }

            return Ok(loaimatbang);
        }
        
        // PUT: api/LoaiMatBangs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoaiMatBang([FromRoute] int id, [FromBody] LoaiMatBang loaimatbang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != loaimatbang.LoaiMatBangId)
            {
                return BadRequest();
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            loaimatbang.NgaySua = DateTime.Now;
            loaimatbang.NguoiSua = user;
            _context.Entry(loaimatbang).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoaiMatBangExists(id))
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
        
        // POST: api/LoaiMatBangs
        [HttpPost]
        public async Task<IActionResult> PostLoaiMatBang([FromBody] LoaiMatBang loaimatbang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);

            loaimatbang.NgayNhap = DateTime.Now;
            loaimatbang.NguoiNhap = user;
            _context.LoaiMatBangs.Add(loaimatbang);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLoaiMatBang", new { id = loaimatbang.LoaiMatBangId }, loaimatbang);
        }
        
        // DELETE: api/LoaiMatBangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoaiMatBang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //
            var loaimatbang = await _context.LoaiMatBangs.SingleOrDefaultAsync(m => m.LoaiMatBangId == id);
            if (loaimatbang == null)
            {
                return NotFound();
            }

            List<MatBang> listmb = _context.MatBangs.Where(t => t.LoaiMatBangId == loaimatbang.LoaiMatBangId).ToList();
            if (listmb.Count <= 0)
            {
                _context.LoaiMatBangs.Remove(loaimatbang);
                await _context.SaveChangesAsync();
                return Ok(loaimatbang);
            }else
                return BadRequest("Không xóa được loại mặt bằng. Do đã được sử dụng!");
        }
        
        private bool LoaiMatBangExists(int id)
        {                        
            return _context.LoaiMatBangs.Any(e => e.LoaiMatBangId == id);
        }
    }    
}