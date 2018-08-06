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
    [Route("api/QuocTichs")]
    public class QuocTichsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public QuocTichsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/QuocTichs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<QuocTich> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<QuocTich>().FromSql($"tbl_QuocTich_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<QuocTich>();
        }
        
        // GET: api/QuocTichs
        [HttpGet]
        public IEnumerable<QuocTich> GetQuocTichs()
        {
            return _context.QuocTichs;
        }
        
        // GET: api/QuocTichs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuocTich([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var quoctich = await _context.QuocTichs.SingleOrDefaultAsync(m => m.QuocTichId == id);

            if (quoctich == null)
            {
                return NotFound();
            }

            return Ok(quoctich);
        }
        
        // PUT: api/QuocTichs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuocTich([FromRoute] int id, [FromBody] QuocTich quoctich)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != quoctich.QuocTichId)
            {
                return BadRequest();
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            quoctich.NgaySua = DateTime.Now;
            quoctich.NguoiSua = user;
            _context.Entry(quoctich).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuocTichExists(id))
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
        
        // POST: api/QuocTichs
        [HttpPost]
        public async Task<IActionResult> PostQuocTich([FromBody] QuocTich quoctich)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            quoctich.NgayNhap = DateTime.Now;
            quoctich.NguoiNhap = user;
            _context.QuocTichs.Add(quoctich);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuocTich", new { id = quoctich.QuocTichId }, quoctich);
        }
        
        // DELETE: api/QuocTichs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuocTich([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var quoctich = await _context.QuocTichs.SingleOrDefaultAsync(m => m.QuocTichId == id);
            if (quoctich == null)
            {
                return NotFound();
            }

            _context.QuocTichs.Remove(quoctich);
            await _context.SaveChangesAsync();

            return Ok(quoctich);
        }
        
        private bool QuocTichExists(int id)
        {                        
            return _context.QuocTichs.Any(e => e.QuocTichId == id);
        }
    }    
}