﻿using System;
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
    [Route("api/VatTuTaiLieus")]
    public class VatTuTaiLieusController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public VatTuTaiLieusController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/VatTuTaiLieus/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<VatTuTaiLieu> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<VatTuTaiLieu>().FromSql($"tbl_VatTuTaiLieu_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<VatTuTaiLieu>();
        }
        
        // GET: api/VatTuTaiLieus
        [HttpGet]
        public IEnumerable<VatTuTaiLieu> GetVatTuTaiLieus()
        {
            return _context.VatTuTaiLieus;
        }
        
        // GET: api/VatTuTaiLieus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVatTuTaiLieu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattutailieu = await _context.VatTuTaiLieus.SingleOrDefaultAsync(m => m.VatTutaiLieuId == id);

            if (vattutailieu == null)
            {
                return NotFound();
            }

            return Ok(vattutailieu);
        }
        
        // PUT: api/VatTuTaiLieus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVatTuTaiLieu([FromRoute] int id, [FromBody] VatTuTaiLieu vattutailieu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vattutailieu.VatTutaiLieuId)
            {
                return BadRequest();
            }

            _context.Entry(vattutailieu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VatTuTaiLieuExists(id))
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
        
        // POST: api/VatTuTaiLieus
        [HttpPost]
        public async Task<IActionResult> PostVatTuTaiLieu([FromBody] VatTuTaiLieu vattutailieu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.VatTuTaiLieus.Add(vattutailieu);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVatTuTaiLieu", new { id = vattutailieu.VatTutaiLieuId }, vattutailieu);
        }
        
        // DELETE: api/VatTuTaiLieus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVatTuTaiLieu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattutailieu = await _context.VatTuTaiLieus.SingleOrDefaultAsync(m => m.VatTutaiLieuId == id);
            if (vattutailieu == null)
            {
                return NotFound();
            }

            _context.VatTuTaiLieus.Remove(vattutailieu);
            await _context.SaveChangesAsync();

            return Ok(vattutailieu);
        }
        
        private bool VatTuTaiLieuExists(int id)
        {                        
            return _context.VatTuTaiLieus.Any(e => e.VatTutaiLieuId == id);
        }
    }    
}