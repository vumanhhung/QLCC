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
    [Route("api/KhachHangs")]
    public class KhachHangsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public KhachHangsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // PUT: api/KhachHangs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<KhachHang> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {
            List<KhachHang> kh = new List<KhachHang>();
            orderBy = orderBy != "x" ? orderBy : "";
            var khO = _context.Set<KhachHang>().FromSql($"tbl_KhachHang_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<KhachHang>();
            for (int i = 0; i < khO.Count; i++)
            {
                KhachHang obj = new KhachHang();
                obj = khO[i];                
                obj.NhomKhachHang = _context.NhomKhachHangs.SingleOrDefault(m => m.NhomKhachHangId == khO[i].NhomKhachHangId);
                kh.Add(obj);
            }
            return khO;
        }

        // GET: api/KhachHangs
        [HttpGet("getcanhan")]
        public IEnumerable<KhachHang> GetKhachHangs()
        {
            return _context.KhachHangs.Where(m => m.KhDoanhNghiep == false).Include(o => o.NhomKhachHang);
        }
        // GET: api/KhachHangs
        [HttpGet("getdoanhnghiep")]
        public IEnumerable<KhachHang> GetKhachHangDoanhNhgieps()
        {
            return _context.KhachHangs.Where(m => m.KhDoanhNghiep == true); ;
        }

        // GET: api/KhachHangs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetKhachHang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var khachhang = await _context.KhachHangs.SingleOrDefaultAsync(m => m.KhachHangId == id);

            if (khachhang == null)
            {
                return NotFound();
            }

            return Ok(khachhang);
        }

        // PUT: api/KhachHangs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKhachHang([FromRoute] int id, [FromBody] KhachHang khachhang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != khachhang.KhachHangId)
            {
                return BadRequest();
            }

            _context.Entry(khachhang).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KhachHangExists(id))
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

        // POST: api/KhachHangs
        [HttpPost]
        public async Task<IActionResult> PostKhachHang([FromBody] KhachHang khachhang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.KhachHangs.Add(khachhang);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetKhachHang", new { id = khachhang.KhachHangId }, khachhang);
        }

        // DELETE: api/KhachHangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKhachHang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var khachhang = await _context.KhachHangs.SingleOrDefaultAsync(m => m.KhachHangId == id);
            if (khachhang == null)
            {
                return NotFound();
            }

            _context.KhachHangs.Remove(khachhang);
            await _context.SaveChangesAsync();

            return Ok(khachhang);
        }

        private bool KhachHangExists(int id)
        {
            return _context.KhachHangs.Any(e => e.KhachHangId == id);
        }
    }
}