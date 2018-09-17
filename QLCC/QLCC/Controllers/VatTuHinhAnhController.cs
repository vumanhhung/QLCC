﻿using System;
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
        public async Task<IActionResult> GetVatTuHinhAnh([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattuhinhanh = await _context.VatTuHinhAnhs.SingleOrDefaultAsync(m => m.VatTuHinhAnhId == id);

            if (vattuhinhanh == null)
            {
                return NotFound();
            }

            return Ok(vattuhinhanh);
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

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot" + @"\image_vattu", vattuhinhanh.TenHinhAnh);
            vattuhinhanh.URLHinhAnh = filePath;
            _context.VatTuHinhAnhs.Add(vattuhinhanh);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVatTuHinhAnh", new { id = vattuhinhanh.VatTuHinhAnhId }, vattuhinhanh);
        }

        [HttpGet("CheckExist/{name}")]
        public async Task<IActionResult> GetExist([FromRoute] string name)
        {
            var check = await _context.VatTuHinhAnhs.SingleOrDefaultAsync(r => r.TenHinhAnh == name);
            if(check != null)
            {
                return Ok("Exist");
            }
            else
            {
                return Ok("Ok");
            }
        }

        // DELETE: api/VatTuHinhAnhs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVatTuHinhAnh([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattuhinhanh = await _context.VatTuHinhAnhs.SingleOrDefaultAsync(m => m.VatTuHinhAnhId == id);
            if (vattuhinhanh == null)
            {
                return NotFound();
            }

            _context.VatTuHinhAnhs.Remove(vattuhinhanh);
            await _context.SaveChangesAsync();

            return Ok(vattuhinhanh);
        }

        private bool VatTuHinhAnhExists(int id)
        {
            return _context.VatTuHinhAnhs.Any(e => e.VatTuHinhAnhId == id);
        }
    }
}