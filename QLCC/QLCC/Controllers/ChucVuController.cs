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
    [Route("api/ChucVus")]
    public class ChucVusController : Controller
    {
        private readonly ApplicationDbContext _context;        

        public ChucVusController(ApplicationDbContext context)
        {
            _context = context;                      
        }
        
        // PUT: api/ChucVus/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<ChucVu> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<ChucVu>().FromSql($"tbl_ChucVu_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<ChucVu>();
        }
        
        // GET: api/ChucVus
        [HttpGet]
        public IEnumerable<ChucVu> GetChucVus()
        {
            return _context.ChucVus;
        }
        
        // GET: api/ChucVus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetChucVu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var chucvu = await _context.ChucVus.SingleOrDefaultAsync(m => m.ChucVuId == id);

            if (chucvu == null)
            {
                return NotFound();
            }

            return Ok(chucvu);
        }
        
        // PUT: api/ChucVus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChucVu([FromRoute] int id, [FromBody] ChucVu chucvu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != chucvu.ChucVuId)
            {
                return BadRequest();
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            
            chucvu.NgaySua = DateTime.Now;
            chucvu.NguoiSua = user;
            _context.Entry(chucvu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChucVuExists(id))
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
        
        // POST: api/ChucVus
        [HttpPost]
        public async Task<IActionResult> PostChucVu([FromBody] ChucVu chucvu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);

            chucvu.NgayNhap = DateTime.Now;
            chucvu.NguoiNhap = user;

            _context.ChucVus.Add(chucvu);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChucVu", new { id = chucvu.ChucVuId }, chucvu);
        }
        
        // DELETE: api/ChucVus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChucVu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var chucvu = await _context.ChucVus.SingleOrDefaultAsync(m => m.ChucVuId == id);
            if (chucvu == null)
            {
                return NotFound();
            }

            _context.ChucVus.Remove(chucvu);
            await _context.SaveChangesAsync();

            return Ok(chucvu);
        }
        
        private bool ChucVuExists(int id)
        {                        
            return _context.ChucVus.Any(e => e.ChucVuId == id);
        }
    }    
}