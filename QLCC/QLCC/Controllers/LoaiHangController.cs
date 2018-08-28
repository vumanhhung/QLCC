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
    [Route("api/LoaiHangs")]
    public class LoaiHangsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public LoaiHangsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/LoaiHangs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<LoaiHang> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<LoaiHang>().FromSql($"tbl_LoaiHang_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<LoaiHang>();
        }
        
        // GET: api/LoaiHangs
        [HttpGet]
        public IEnumerable<LoaiHang> GetLoaiHangs()
        {
            return _context.LoaiHangs;
        }
        
        // GET: api/LoaiHangs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLoaiHang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaihang = await _context.LoaiHangs.SingleOrDefaultAsync(m => m.LoaiHangId == id);

            if (loaihang == null)
            {
                return NotFound();
            }

            return Ok(loaihang);
        }
        
        // PUT: api/LoaiHangs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoaiHang([FromRoute] int id, [FromBody] LoaiHang loaihang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != loaihang.LoaiHangId)
            {
                return BadRequest();
            }

            var checkvalid = await _context.LoaiHangs.SingleOrDefaultAsync(r => r.LoaiHangId != id && r.TenLoaiHang == loaihang.TenLoaiHang);
            if (checkvalid == null)
            {
                var user = this.User.Identity.Name;
                var userId = Utilities.GetUserId(this.User);
                loaihang.NgaySua = DateTime.Now;
                loaihang.NguoiSua = user;
                _context.Entry(loaihang).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!LoaiHangExists(id))
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
            else
            {
                var check = "Exist";
                return Ok(check);
            }
        }
        
        // POST: api/LoaiHangs
        [HttpPost]
        public async Task<IActionResult> PostLoaiHang([FromBody] LoaiHang loaihang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var checkvalid = await _context.LoaiHangs.SingleOrDefaultAsync(r => r.TenLoaiHang == loaihang.TenLoaiHang);
            if (checkvalid == null)
            {
                var user = this.User.Identity.Name;
                var userId = Utilities.GetUserId(this.User);
                loaihang.NgayNhap = DateTime.Now;
                loaihang.NguoiNhap = user;
                _context.LoaiHangs.Add(loaihang);
                await _context.SaveChangesAsync();

                return CreatedAtAction("Getloaihang", new { id = loaihang.LoaiHangId }, loaihang);
            }
            else
            {
                var check = new LoaiHang();
                if (checkvalid != null)
                {
                    check.TenLoaiHang = "Exist";
                }
                return Ok(check);
            }
        }
        
        // DELETE: api/LoaiHangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoaiHang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaihang = await _context.LoaiHangs.SingleOrDefaultAsync(m => m.LoaiHangId == id);
            if (loaihang == null)
            {
                return NotFound();
            }

            _context.LoaiHangs.Remove(loaihang);
            await _context.SaveChangesAsync();

            return Ok(loaihang);
        }

        [HttpGet("FilterStatus/{status}")]
        public IEnumerable<LoaiHang> getFilterStatus([FromRoute] bool status)
        {
            return _context.LoaiHangs.Where(m => m.TrangThai == status).ToList();
        }


        private bool LoaiHangExists(int id)
        {                        
            return _context.LoaiHangs.Any(e => e.LoaiHangId == id);
        }
    }    
}