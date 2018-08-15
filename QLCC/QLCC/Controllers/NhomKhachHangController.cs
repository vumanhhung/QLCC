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
    [Route("api/NhomKhachHangs")]
    public class NhomKhachHangsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public NhomKhachHangsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/NhomKhachHangs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<NhomKhachHang> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<NhomKhachHang>().FromSql($"tbl_NhomKhachHang_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<NhomKhachHang>();
        }
        
        // GET: api/NhomKhachHangs
        [HttpGet]
        public IEnumerable<NhomKhachHang> GetNhomKhachHangs()
        {
            return _context.NhomKhachHangs;
        }
        
        // GET: api/NhomKhachHangs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNhomKhachHang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nhomkhachhang = await _context.NhomKhachHangs.SingleOrDefaultAsync(m => m.NhomKhachHangId == id);

            if (nhomkhachhang == null)
            {
                return NotFound();
            }

            return Ok(nhomkhachhang);
        }
        
        // PUT: api/NhomKhachHangs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNhomKhachHang([FromRoute] int id, [FromBody] NhomKhachHang nhomkhachhang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != nhomkhachhang.NhomKhachHangId)
            {
                return BadRequest();
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            nhomkhachhang.NgaySua = DateTime.Now;
            nhomkhachhang.NguoiSua = user;
            _context.Entry(nhomkhachhang).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NhomKhachHangExists(id))
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
        
        // POST: api/NhomKhachHangs
        [HttpPost]
        public async Task<IActionResult> PostNhomKhachHang([FromBody] NhomKhachHang nhomkhachhang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            nhomkhachhang.NgayNhap = DateTime.Now;
            nhomkhachhang.NguoiNhap = user;
            _context.NhomKhachHangs.Add(nhomkhachhang);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNhomKhachHang", new { id = nhomkhachhang.NhomKhachHangId }, nhomkhachhang);
        }
        
        // DELETE: api/NhomKhachHangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNhomKhachHang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nhomkhachhang = await _context.NhomKhachHangs.SingleOrDefaultAsync(m => m.NhomKhachHangId == id);
            if (nhomkhachhang == null)
            {
                return NotFound();
            }

            _context.NhomKhachHangs.Remove(nhomkhachhang);
            await _context.SaveChangesAsync();

            return Ok(nhomkhachhang);
        }
        
        private bool NhomKhachHangExists(int id)
        {                        
            return _context.NhomKhachHangs.Any(e => e.NhomKhachHangId == id);
        }
    }    
}