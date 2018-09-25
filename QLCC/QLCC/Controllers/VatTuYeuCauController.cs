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
    [Route("api/VatTuYeuCaus")]
    public class VatTuYeuCausController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public VatTuYeuCausController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/VatTuYeuCaus/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<VatTuYeuCau> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<VatTuYeuCau>().FromSql($"tbl_VatTuYeuCau_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<VatTuYeuCau>();
        }
        
        // GET: api/VatTuYeuCaus
        [HttpGet]
        public IEnumerable<VatTuYeuCau> GetVatTuYeuCaus()
        {
            return _context.VatTuYeuCaus;
        }
        
        // GET: api/VatTuYeuCaus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVatTuYeuCau([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattuyeucau = await _context.VatTuYeuCaus.SingleOrDefaultAsync(m => m.VatTuYeuCauId == id);

            if (vattuyeucau == null)
            {
                return NotFound();
            }

            return Ok(vattuyeucau);
        }
        
        // PUT: api/VatTuYeuCaus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVatTuYeuCau([FromRoute] int id, [FromBody] VatTuYeuCau vattuyeucau)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vattuyeucau.VatTuYeuCauId)
            {
                return BadRequest();
            }

            _context.Entry(vattuyeucau).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VatTuYeuCauExists(id))
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
        
        // POST: api/VatTuYeuCaus
        [HttpPost]
        public async Task<IActionResult> PostVatTuYeuCau([FromBody] VatTuYeuCau vattuyeucau)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.VatTuYeuCaus.Add(vattuyeucau);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVatTuYeuCau", new { id = vattuyeucau.VatTuYeuCauId }, vattuyeucau);
        }
        
        // DELETE: api/VatTuYeuCaus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVatTuYeuCau([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattuyeucau = await _context.VatTuYeuCaus.SingleOrDefaultAsync(m => m.VatTuYeuCauId == id);
            if (vattuyeucau == null)
            {
                return NotFound();
            }

            _context.VatTuYeuCaus.Remove(vattuyeucau);
            await _context.SaveChangesAsync();

            return Ok(vattuyeucau);
        }
        
        private bool VatTuYeuCauExists(int id)
        {                        
            return _context.VatTuYeuCaus.Any(e => e.VatTuYeuCauId == id);
        }
    }    
}