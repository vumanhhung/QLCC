using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;
using System.IO;
using QLCC.Helpers;

namespace QLCC.Controllers
{
    [Produces("application/json")]
    [Route("api/VatTuHinhAnhs")]
    public class VatTuHinhAnhsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public VatTuHinhAnhsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // PUT: api/VatTuHinhAnhs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<VatTuHinhAnh> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<VatTuHinhAnh>().FromSql($"tbl_VatTuHinhAnh_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<VatTuHinhAnh>();
        }

        // GET: api/VatTuHinhAnhs
        [HttpGet]
        public IEnumerable<VatTuHinhAnh> GetVatTuHinhAnhs()
        {
            return _context.VatTuHinhAnhs;
        }

        // GET: api/VatTuHinhAnhs/5
        [HttpGet("{id}")]
        public IEnumerable<VatTuHinhAnh> GetVatTuHinhAnh([FromRoute] int id)
        {
            var vattuhinhanh = _context.VatTuHinhAnhs.Where(m => m.VatTuId == id);
            return vattuhinhanh;
        }

        // PUT: api/VatTuHinhAnhs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVatTuHinhAnh([FromRoute] int id, [FromBody] VatTuHinhAnh vattuhinhanh)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vattuhinhanh.VatTuHinhAnhId)
            {
                return BadRequest();
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            vattuhinhanh.NgaySua = DateTime.Now;
            vattuhinhanh.NguoiSua = user;
            _context.Entry(vattuhinhanh).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VatTuHinhAnhExists(id))
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

        // POST: api/VatTuHinhAnhs
        [HttpPost]
        public async Task<IActionResult> PostVatTuHinhAnh([FromBody] VatTuHinhAnh vattuhinhanh)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            vattuhinhanh.NgayNhap = DateTime.Now;
            vattuhinhanh.NguoiNhap = user;
            _context.VatTuHinhAnhs.Add(vattuhinhanh);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVatTuHinhAnh", new { id = vattuhinhanh.VatTuHinhAnhId }, vattuhinhanh);
        }

        [HttpGet("Count/{id}")]
        public IEnumerable<VatTuHinhAnh> getCount([FromRoute] int id)
        {
            return _context.VatTuHinhAnhs.Where(r => r.VatTuId == id);
        }

        // DELETE: api/VatTuHinhAnhs/5
        [HttpDelete("DelAll/{id}")]
        public async Task<IActionResult> DeleteAllVatTuHinhAnh([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var vattuhinhanh = await _context.VatTuHinhAnhs.SingleOrDefaultAsync(r => r.VatTuHinhAnhId == id);
            if (vattuhinhanh == null)
            {
                return NotFound();
            }
            _context.VatTuHinhAnhs.Remove(vattuhinhanh);
            await _context.SaveChangesAsync();

            return Ok(vattuhinhanh);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVatTuHinhAnh([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var check = _context.VatTuHinhAnhs.Where(r => r.VatTuId == id);
            foreach (var vattuhinhanh in check)
            {
                if (vattuhinhanh == null)
                {
                    return NotFound();
                }
                _context.VatTuHinhAnhs.Remove(vattuhinhanh);
                await _context.SaveChangesAsync();
            }

            return Ok(check);
        }

        private bool VatTuHinhAnhExists(int id)
        {
            return _context.VatTuHinhAnhs.Any(e => e.VatTuHinhAnhId == id);
        }
    }
}