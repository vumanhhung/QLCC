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
    [Route("api/TangLaus")]
    public class TangLausController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public TangLausController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // GET: api/TangLaus
        [HttpGet]
        public IEnumerable<TangLau> GetTangLaus()
        {
            return _context.TangLaus.Include(m=>m.toanhas);
        }
        
        // GET: api/TangLaus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTangLau([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tanglau = await _context.TangLaus.Include(m => m.toanhas).SingleOrDefaultAsync(m => m.TangLauId == id);

            if (tanglau == null)
            {
                return NotFound();
            }

            return Ok(tanglau);
        }

        // GET: api/TangLaus/getTangLauByToaNha/5
        [HttpGet("getTangLauByToaNha/{toaNhaId}/{cumToaNhaId}")]
        public IEnumerable<TangLau> GetTangLauByToaNha([FromRoute] int toaNhaId,int cumToaNhaId)
        {
            if (toaNhaId != 0)
            {
                var tanglaus = _context.TangLaus.Include(m => m.toanhas).Where(m => m.ToaNhaId == toaNhaId);
                return tanglaus;
            }
            else
            {
                var tanglaus = from a in _context.TangLaus.Include(m => m.toanhas)
                               let toanhaid = _context.ToaNhas.Where(m => m.CumToaNhaId == cumToaNhaId).Select(m => m.ToaNhaId)
                where toanhaid.Contains((int)a.ToaNhaId)
                            select a;
                return tanglaus;
            }
        }

        // PUT: api/TangLaus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTangLau([FromRoute] int id, [FromBody] TangLau tanglau)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tanglau.TangLauId)
            {
                return BadRequest();
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            tanglau.NgaySua = DateTime.Now;
            tanglau.NguoiSua = user;
            _context.Entry(tanglau).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TangLauExists(id))
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
        
        // POST: api/TangLaus
        [HttpPost]
        public async Task<IActionResult> PostTangLau([FromBody] TangLau tanglau)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);

            tanglau.NgayNhap = DateTime.Now;
            tanglau.NguoiNhap = user;
            _context.TangLaus.Add(tanglau);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTangLau", new { id = tanglau.TangLauId }, tanglau);
        }
        
        // DELETE: api/TangLaus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTangLau([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tanglau = await _context.TangLaus.SingleOrDefaultAsync(m => m.TangLauId == id);
            if (tanglau == null)
            {
                return NotFound();
            }

            List<MatBang> listmb = _context.MatBangs.Where(t => t.TangLauId == tanglau.TangLauId).ToList();
            if (listmb.Count <= 0)
            {
                _context.TangLaus.Remove(tanglau);
                await _context.SaveChangesAsync();
                return Ok(tanglau);
            }
            else
                return BadRequest("Không thể xóa tầng lầu. Do đã được sử dụng!");
        }
        
        private bool TangLauExists(int id)
        {                        
            return _context.TangLaus.Any(e => e.TangLauId == id);
        }
    }    
}