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
    [Route("api/TaiKhoanNganHangs")]
    public class TaiKhoanNganHangsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public TaiKhoanNganHangsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/TaiKhoanNganHangs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<TaiKhoanNganHang> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<TaiKhoanNganHang>().FromSql($"tbl_TaiKhoanNganHang_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<TaiKhoanNganHang>();
        }
        
        // GET: api/TaiKhoanNganHangs
        [HttpGet]
        public IEnumerable<TaiKhoanNganHang> GetTaiKhoanNganHangs()
        {
            return _context.TaiKhoanNganHangs.Include(m=> m.nganhang);
        }
        
        // GET: api/TaiKhoanNganHangs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaiKhoanNganHang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var taikhoannganhang = await _context.TaiKhoanNganHangs.Include(m => m.nganhang).SingleOrDefaultAsync(m => m.TaiKhoanNganHangId == id);

            if (taikhoannganhang == null)
            {
                return NotFound();
            }

            return Ok(taikhoannganhang);
        }

        // GET: api/ToaNhas/getToaNhaByCum/5
        [HttpGet("getTaiKhoanNganHangByNganHang/{nganhang}")]
        public IEnumerable<TaiKhoanNganHang> getTaiKhoanNganHangByNganHang([FromRoute] int nganhang)
        {
            //var toanha = await _context.ToaNhas.SingleOrDefaultAsync(m => m.CumToaNhaId == cumToaNhaId);
            var taikhoans = _context.TaiKhoanNganHangs.Include(m=>m.nganhang).Where(m => m.NganHangId == nganhang);
            return taikhoans;
        }

        // PUT: api/TaiKhoanNganHangs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaiKhoanNganHang([FromRoute] int id, [FromBody] TaiKhoanNganHang taikhoannganhang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != taikhoannganhang.TaiKhoanNganHangId)
            {
                return BadRequest();
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            taikhoannganhang.NgaySua = DateTime.Now;
            taikhoannganhang.NguoiSua = user;
            _context.Entry(taikhoannganhang).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaiKhoanNganHangExists(id))
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
        
        // POST: api/TaiKhoanNganHangs
        [HttpPost]
        public async Task<IActionResult> PostTaiKhoanNganHang([FromBody] TaiKhoanNganHang taikhoannganhang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            taikhoannganhang.NgayNhap = DateTime.Now;
            taikhoannganhang.NguoiNhap = user;
            _context.TaiKhoanNganHangs.Add(taikhoannganhang);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTaiKhoanNganHang", new { id = taikhoannganhang.TaiKhoanNganHangId }, taikhoannganhang);
        }
        
        // DELETE: api/TaiKhoanNganHangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaiKhoanNganHang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var taikhoannganhang = await _context.TaiKhoanNganHangs.SingleOrDefaultAsync(m => m.TaiKhoanNganHangId == id);
            if (taikhoannganhang == null)
            {
                return NotFound();
            }

            _context.TaiKhoanNganHangs.Remove(taikhoannganhang);
            await _context.SaveChangesAsync();

            return Ok(taikhoannganhang);
        }
        
        private bool TaiKhoanNganHangExists(int id)
        {                        
            return _context.TaiKhoanNganHangs.Any(e => e.TaiKhoanNganHangId == id);
        }
    }    
}