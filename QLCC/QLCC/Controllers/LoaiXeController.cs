using System;
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
    [Route("api/LoaiXes")]
    public class LoaiXesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public LoaiXesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // PUT: api/LoaiXes/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<LoaiXe> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<LoaiXe>().FromSql($"tbl_LoaiXe_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<LoaiXe>();
        }

        // GET: api/LoaiXes
        [HttpGet]
        public IEnumerable<LoaiXe> GetLoaiXes()
        {
            return _context.LoaiXes;
        }

        // GET: api/LoaiXes/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLoaiXe([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaixe = await _context.LoaiXes.SingleOrDefaultAsync(m => m.LoaiXeId == id);

            if (loaixe == null)
            {
                return NotFound();
            }

            return Ok(loaixe);
        }

        // PUT: api/LoaiXes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoaiXe([FromRoute] int id, [FromBody] LoaiXe loaixe)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != loaixe.LoaiXeId)
            {
                return BadRequest();
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            loaixe.NgaySua = DateTime.Now;
            loaixe.NguoiSua = user;
            var checkten = await _context.LoaiXes.SingleOrDefaultAsync(r => r.TenLoaiXe == loaixe.TenLoaiXe && r.LoaiXeId != id);
            var checkkyhieu = await _context.LoaiXes.SingleOrDefaultAsync(v => v.KyHieu == loaixe.KyHieu && v.LoaiXeId != id);

            if (checkten == null && checkkyhieu == null)
            {
                _context.Entry(loaixe).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                var ldv = "";
                if (checkten != null)
                {
                    ldv = "ten";

                }
                if (checkkyhieu != null)
                {
                    ldv = "kyhieu";
                }
                return Ok(ldv);
            }
        }

        // POST: api/LoaiXes
        [HttpPost]
        public async Task<IActionResult> PostLoaiXe([FromBody] LoaiXe loaixe)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            loaixe.NgayNhap = DateTime.Now;
            loaixe.NguoiNhap = user;
            var checkten = await _context.LoaiXes.SingleOrDefaultAsync(r => r.TenLoaiXe == loaixe.TenLoaiXe);
            var checkkyhieu = await _context.LoaiXes.SingleOrDefaultAsync(v => v.KyHieu == loaixe.KyHieu);
            if (checkten == null && checkkyhieu == null)
            {
                _context.LoaiXes.Add(loaixe);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetLoaiDichVu", new { id = loaixe.LoaiXeId }, loaixe);
            }
            else
            {
                var ldv = new LoaiXe();
                if (checkten != null)
                {
                    ldv.TenLoaiXe = "ten";

                }
                if (checkkyhieu != null)
                {
                    ldv.KyHieu = "kyhieu";
                }
                return Ok(ldv);
            }
        }

        // DELETE: api/LoaiXes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoaiXe([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var loaixe = await _context.LoaiXes.SingleOrDefaultAsync(m => m.LoaiXeId == id);
            if (loaixe == null)
            {
                return NotFound();
            }

            _context.LoaiXes.Remove(loaixe);
            await _context.SaveChangesAsync();

            return Ok(loaixe);
        }


        [HttpGet("GetName")]
        public async Task<ActionResult> getLoaiXeItem([FromBody] string tenloaixe)
        {
            var loaixe = await _context.LoaiXes.SingleOrDefaultAsync(m => m.TenLoaiXe == tenloaixe);
            return Ok(loaixe);
        }
        private bool LoaiXeExists(int id)
        {
            return _context.LoaiXes.Any(e => e.LoaiXeId == id);
        }
    }
}