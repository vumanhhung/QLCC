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
    [Route("api/DonViTinhs")]
    public class DonViTinhsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public DonViTinhsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/DonViTinhs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<DonViTinh> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<DonViTinh>().FromSql($"tbl_DonViTinh_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<DonViTinh>();
        }
        
        // GET: api/DonViTinhs
        [HttpGet]
        public IEnumerable<DonViTinh> GetDonViTinhs()
        {
            return _context.DonViTinhs;
        }
        
        // GET: api/DonViTinhs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDonViTinh([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var donvitinh = await _context.DonViTinhs.SingleOrDefaultAsync(m => m.DonViTinhId == id);

            if (donvitinh == null)
            {
                return NotFound();
            }

            return Ok(donvitinh);
        }
        
        // PUT: api/DonViTinhs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDonViTinh([FromRoute] int id, [FromBody] DonViTinh donvitinh)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != donvitinh.DonViTinhId)
            {
                return BadRequest();
            }

            _context.Entry(donvitinh).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DonViTinhExists(id))
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
        
        // POST: api/DonViTinhs
        [HttpPost]
        public async Task<IActionResult> PostDonViTinh([FromBody] DonViTinh donvitinh)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.DonViTinhs.Add(donvitinh);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDonViTinh", new { id = donvitinh.DonViTinhId }, donvitinh);
        }
        
        // DELETE: api/DonViTinhs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDonViTinh([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var donvitinh = await _context.DonViTinhs.SingleOrDefaultAsync(m => m.DonViTinhId == id);
            if (donvitinh == null)
            {
                return NotFound();
            }

            _context.DonViTinhs.Remove(donvitinh);
            await _context.SaveChangesAsync();

            return Ok(donvitinh);
        }
        
        private bool DonViTinhExists(int id)
        {                        
            return _context.DonViTinhs.Any(e => e.DonViTinhId == id);
        }
    }    
}