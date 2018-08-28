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
    [Route("api/ToaNhas")]
    public class ToaNhasController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ToaNhasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ToaNhas
        [HttpGet]
        public IEnumerable<ToaNha> GetToaNhas()
        {
            return _context.ToaNhas.Include(m => m.cumtoanhas);
        }

        // GET: api/ToaNhas/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetToaNha([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var toanha = await _context.ToaNhas.Include(m => m.cumtoanhas).SingleOrDefaultAsync(m => m.ToaNhaId == id);

            if (toanha == null)
            {
                return NotFound();
            }

            return Ok(toanha);
        }
        // GET: api/ToaNhas/getToaNhaByCum/5
        [HttpGet("getToaNhaByCum/{cumToaNhaId}")]
        public IEnumerable<ToaNha> GetToaNhaByCum([FromRoute] int cumToaNhaId)
        {
            //var toanha = await _context.ToaNhas.SingleOrDefaultAsync(m => m.CumToaNhaId == cumToaNhaId);
            var toanhas = _context.ToaNhas.Include(m => m.cumtoanhas).Where(m => m.CumToaNhaId == cumToaNhaId);
            return toanhas;
        }

        // PUT: api/ToaNhas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutToaNha([FromRoute] int id, [FromBody] ToaNha toanha)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != toanha.ToaNhaId)
            {
                return BadRequest();
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            toanha.NgaySua = DateTime.Now;
            toanha.NguoiSua = user;
            _context.Entry(toanha).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ToaNhaExists(id))
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

        // POST: api/ToaNhas
        [HttpPost]
        public async Task<IActionResult> PostToaNha([FromBody] ToaNha toanha)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);

            toanha.NgayNhap = DateTime.Now;
            toanha.NguoiNhap = user;
            _context.ToaNhas.Add(toanha);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetToaNha", new { id = toanha.ToaNhaId }, toanha);
        }

        // DELETE: api/ToaNhas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteToaNha([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var toanha = await _context.ToaNhas.SingleOrDefaultAsync(m => m.ToaNhaId == id);
            if (toanha == null)
            {
                return NotFound();
            }
            List<TangLau> ListTang = _context.TangLaus.Where(t => t.ToaNhaId == toanha.ToaNhaId).ToList();
            if(ListTang.Count <= 0)
            {
                _context.ToaNhas.Remove(toanha);
                await _context.SaveChangesAsync();
                return Ok(toanha);
            }else
                return BadRequest("Không xóa được tòa nhà. Do đã được sử dụng!");

        }

        private bool ToaNhaExists(int id)
        {
            return _context.ToaNhas.Any(e => e.ToaNhaId == id);
        }
    }
}