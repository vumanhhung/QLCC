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
    [Route("api/TrangThais")]
    public class TrangThaisController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public TrangThaisController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // GET: api/TrangThais
        [HttpGet]
        public IEnumerable<TrangThai> GetTrangThais()
        {
            return _context.TrangThais;
        }
        
        // GET: api/TrangThais/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTrangThai([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var trangthai = await _context.TrangThais.SingleOrDefaultAsync(m => m.TrangThaiId == id);

            if (trangthai == null)
            {
                return NotFound();
            }

            return Ok(trangthai);
        }
        
        // PUT: api/TrangThais/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTrangThai([FromRoute] int id, [FromBody] TrangThai trangthai)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != trangthai.TrangThaiId)
            {
                return BadRequest();
            }

            _context.Entry(trangthai).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TrangThaiExists(id))
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
        
        // POST: api/TrangThais
        [HttpPost]
        public async Task<IActionResult> PostTrangThai([FromBody] TrangThai trangthai)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.TrangThais.Add(trangthai);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTrangThai", new { id = trangthai.TrangThaiId }, trangthai);
        }
        
        // DELETE: api/TrangThais/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrangThai([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var trangthai = await _context.TrangThais.SingleOrDefaultAsync(m => m.TrangThaiId == id);
            if (trangthai == null)
            {
                return NotFound();
            }

            _context.TrangThais.Remove(trangthai);
            await _context.SaveChangesAsync();

            return Ok(trangthai);
        }
        
        private bool TrangThaiExists(int id)
        {                        
            return _context.TrangThais.Any(e => e.TrangThaiId == id);
        }
    }    
}