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
    [Route("api/PhieuThuChiTiets")]
    public class PhieuThuChiTietsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PhieuThuChiTietsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // PUT: api/PhieuThuChiTiets/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<PhieuThuChiTiet> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<PhieuThuChiTiet>().FromSql($"tbl_PhieuThuChiTiet_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<PhieuThuChiTiet>();
        }

        // GET: api/PhieuThuChiTiets
        [HttpGet]
        public IEnumerable<PhieuThuChiTiet> GetPhieuThuChiTiets()
        {
            return _context.PhieuThuChiTiets;
        }

        // GET: api/PhieuThuChiTiets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhieuThuChiTiet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var phieuthuchitiet = await _context.PhieuThuChiTiets.SingleOrDefaultAsync(m => m.PhieuThuChiTietId == id);

            if (phieuthuchitiet == null)
            {
                return NotFound();
            }

            return Ok(phieuthuchitiet);
        }

        // PUT: api/PhieuThuChiTiets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPhieuThuChiTiet([FromRoute] int id, [FromBody] PhieuThuChiTiet phieuthuchitiet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != phieuthuchitiet.PhieuThuChiTietId)
            {
                return BadRequest();
            }

            _context.Entry(phieuthuchitiet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PhieuThuChiTietExists(id))
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

        // POST: api/PhieuThuChiTiets
        [HttpPost]
        public async Task<IActionResult> PostPhieuThuChiTiet([FromBody] PhieuThuChiTiet phieuthuchitiet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.PhieuThuChiTiets.Add(phieuthuchitiet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPhieuThuChiTiet", new { id = phieuthuchitiet.PhieuThuChiTietId }, phieuthuchitiet);
        }

        // POST: api/PhieuThuChiTiets/addlist
        [HttpPost("addlist")]
        public async Task<IActionResult> PostPhieuThuChiTiets([FromBody] PhieuThuChiTiet[] phieuthuchitiets)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            for (int i = 0; i < phieuthuchitiets.Count(); i++)
            {
                if (phieuthuchitiets[i].HanTuNgay == null)
                {
                    int dayofmonth = DateTime.DaysInMonth(Convert.ToInt32(phieuthuchitiets[i].Nam), Convert.ToInt32(phieuthuchitiets[i].Thang));
                    string fd = phieuthuchitiets[i].Thang.ToString() + "/1/" + phieuthuchitiets[i].Nam.ToString();
                    string td = phieuthuchitiets[i].Thang.ToString() + "/" + dayofmonth + "/" + phieuthuchitiets[i].Nam.ToString();
                    phieuthuchitiets[i].HanTuNgay = Convert.ToDateTime(fd);
                    phieuthuchitiets[i].HanDenNgay = Convert.ToDateTime(td);
                }
                phieuthuchitiets[i].NgayLap = DateTime.Now;
                var user = this.User.Identity.Name;
                var userId = Utilities.GetUserId(this.User);
                phieuthuchitiets[i].NgayLap = DateTime.Now;
                phieuthuchitiets[i].NguoiLap = user;
                _context.PhieuThuChiTiets.Add(phieuthuchitiets[i]);

            }
            await _context.SaveChangesAsync();

            return Ok(phieuthuchitiets);
        }

        // DELETE: api/PhieuThuChiTiets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhieuThuChiTiet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var phieuthuchitiet = await _context.PhieuThuChiTiets.SingleOrDefaultAsync(m => m.PhieuThuChiTietId == id);
            if (phieuthuchitiet == null)
            {
                return NotFound();
            }

            _context.PhieuThuChiTiets.Remove(phieuthuchitiet);
            await _context.SaveChangesAsync();

            return Ok(phieuthuchitiet);
        }

        private bool PhieuThuChiTietExists(int id)
        {
            return _context.PhieuThuChiTiets.Any(e => e.PhieuThuChiTietId == id);
        }
    }
}