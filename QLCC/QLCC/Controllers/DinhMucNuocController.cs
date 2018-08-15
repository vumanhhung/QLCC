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
    [Route("api/DinhMucNuocs")]
    public class DinhMucNuocsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DinhMucNuocsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // PUT: api/DinhMucNuocs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<DinhMucNuoc> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<DinhMucNuoc>().FromSql($"tbl_DinhMucNuoc_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<DinhMucNuoc>();
        }

        // GET: api/DinhMucNuocs
        [HttpGet("List/{id}")]
        public IEnumerable<DinhMucNuoc> GetDinhMucNuocs([FromRoute] int id)
        {
            return _context.DinhMucNuocs.Where(m => m.CongThucNuocId == id);
        }

        // GET: api/DinhMucNuocs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDinhMucNuoc([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dinhmucnuoc = await _context.DinhMucNuocs.SingleOrDefaultAsync(m => m.DinhMucNuocId == id);

            if (dinhmucnuoc == null)
            {
                return NotFound();
            }

            return Ok(dinhmucnuoc);
        }

        // PUT: api/DinhMucNuocs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDinhMucNuoc([FromRoute] int id, [FromBody] DinhMucNuoc dinhmucnuoc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != dinhmucnuoc.DinhMucNuocId)
            {
                return BadRequest();
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            dinhmucnuoc.NgaySua = DateTime.Now;
            dinhmucnuoc.NguoiSua = user;
            var checkten = await _context.DinhMucNuocs.SingleOrDefaultAsync(r => r.TenDinhMucNuoc == dinhmucnuoc.TenDinhMucNuoc && r.DinhMucNuocId != id);
            if (checkten == null)
            {
                _context.Entry(dinhmucnuoc).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                var warn = "";
                if (checkten != null)
                {
                    warn = "Exist";
                }
                return Ok(warn);
            }
        }

        // POST: api/DinhMucNuocs
        [HttpPost]
        public async Task<IActionResult> PostDinhMucNuoc([FromBody] DinhMucNuoc dinhmucnuoc, [FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            dinhmucnuoc.NgayNhap = DateTime.Now;
            dinhmucnuoc.NguoiNhap = user;
            var checkten = await _context.DinhMucNuocs.SingleOrDefaultAsync(r => r.TenDinhMucNuoc == dinhmucnuoc.TenDinhMucNuoc && r.CongThucNuocId == id);
            if (checkten == null)
            {
                _context.DinhMucNuocs.Add(dinhmucnuoc);
                await _context.SaveChangesAsync();
                return CreatedAtAction("Getdinhmucnuoc", new { id = dinhmucnuoc.DinhMucNuocId }, dinhmucnuoc);
            }
            else
            {
                var warn = new DinhMucNuoc();
                if (checkten != null)
                {
                    warn.TenDinhMucNuoc = "Exist";
                }
                return Ok(warn);
            }
        }

        // DELETE: api/DinhMucNuocs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDinhMucNuoc([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var dinhmucnuoc = await _context.DinhMucNuocs.SingleOrDefaultAsync(m => m.DinhMucNuocId == id);
            if (dinhmucnuoc == null)
            {
                return NotFound();
            }

            _context.DinhMucNuocs.Remove(dinhmucnuoc);
            await _context.SaveChangesAsync();

            return Ok(dinhmucnuoc);
        }

        [HttpGet("Max/{id}")]
        public async Task<int?> checkMax(int id)
        {
            return await _context.DinhMucNuocs.Where(r => r.CongThucNuocId == id).MaxAsync(r => r.SoCuoi);
            //var check = "";
            //if(max == 0)
            //{
            //    check = "0";
            //}
            //else
            //{
            //    check = "1";
            //}
            //return Ok(check);
        }

        private bool DinhMucNuocExists(int id)
        {
            return _context.DinhMucNuocs.Any(e => e.DinhMucNuocId == id);
        }
    }
}