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
    [Route("api/LoaiDichVus")]
    public class LoaiDichVusController : Controller
    {
        private readonly ApplicationDbContext _context;

        public LoaiDichVusController(ApplicationDbContext context)
        {
            _context = context;
        }

        // PUT: api/LoaiDichVus/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<LoaiDichVu> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<LoaiDichVu>().FromSql($"tbl_LoaiDichVu_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<LoaiDichVu>();
        }

        // GET: api/LoaiDichVus
        [HttpGet]
        public IEnumerable<LoaiDichVu> GetLoaiDichVus()
        {
            return _context.LoaiDichVus.OrderBy(r => r.TenLoaiDichVu).ThenByDescending(r => r.MaLoaiDichVuCha);
        }

        // GET: api/LoaiDichVus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLoaiDichVu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loaidichvu = await _context.LoaiDichVus.SingleOrDefaultAsync(m => m.LoaiDichVuId == id);

            if (loaidichvu == null)
            {
                return NotFound();
            }

            return Ok(loaidichvu);
        }

        // PUT: api/LoaiDichVus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoaiDichVu([FromRoute] int id, [FromBody] LoaiDichVu loaidichvu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != loaidichvu.LoaiDichVuId)
            {
                return BadRequest();
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            loaidichvu.NgaySua = DateTime.Now;
            loaidichvu.NguoiSua = user;
            var checkten = await _context.LoaiDichVus.SingleOrDefaultAsync(r => r.MaLoaiDichVuCha == loaidichvu.MaLoaiDichVuCha && r.TenLoaiDichVu == loaidichvu.TenLoaiDichVu && r.LoaiDichVuId != id);
            if (checkten == null)
            {
                _context.Entry(loaidichvu).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                var ldv = "";
                if (checkten != null)
                {
                    ldv = "Exist";

                }
                return Ok(ldv);
            }
        }

        // POST: api/LoaiDichVus
        [HttpPost]
        public async Task<IActionResult> PostLoaiDichVu([FromBody] LoaiDichVu loaidichvu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            loaidichvu.NgayNhap = DateTime.Now;
            loaidichvu.NguoiNhap = user;
            var checkten = await _context.LoaiDichVus.SingleOrDefaultAsync(r => r.MaLoaiDichVuCha == loaidichvu.MaLoaiDichVuCha && r.TenLoaiDichVu == loaidichvu.TenLoaiDichVu);
            if (checkten == null)
            {
                _context.LoaiDichVus.Add(loaidichvu);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetLoaiDichVu", new { id = loaidichvu.LoaiDichVuId }, loaidichvu);
            }
            else
            {
                var ldv = new LoaiDichVu();
                if (checkten != null)
                {
                    ldv.TenLoaiDichVu = "Exist";

                }
                return Ok(ldv);
            }
        }

        // DELETE: api/LoaiDichVus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoaiDichVu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var checkMacha = await _context.LoaiDichVus.SingleOrDefaultAsync(m => m.MaLoaiDichVuCha == id);
            if(checkMacha == null)
            {
                var loaidichvu = await _context.LoaiDichVus.SingleOrDefaultAsync(m => m.LoaiDichVuId == id);
                if (loaidichvu == null)
                {
                    return NotFound();
                }

                _context.LoaiDichVus.Remove(loaidichvu);
                await _context.SaveChangesAsync();

                return Ok(loaidichvu);
            }else
            {
                var check = "Exist";
                return Ok(check);
            }
            
        }

        private bool LoaiDichVuExists(int id)
        {
            return _context.LoaiDichVus.Any(e => e.LoaiDichVuId == id);
        }

        [HttpGet("GetDeQuy")]
        public IEnumerable<LoaiDichVu> getLoaiDVCha()
        {
            List<LoaiDichVu> list = new List<LoaiDichVu>();
            DeQuy(list, 0, "");
            return list;
        }

        void DeQuy(List<LoaiDichVu> list, int parentid, string st)
        {
            List<LoaiDichVu> ldv = new List<LoaiDichVu>();
            ldv = _context.LoaiDichVus.Where(r => r.MaLoaiDichVuCha == parentid).OrderBy(m => m.TenLoaiDichVu).ToList<LoaiDichVu>();
            for (int i = 0; i < ldv.Count; i++)
            {
                LoaiDichVu obj = new LoaiDichVu();
                obj = ldv[i];
                obj.TenLoaiDichVu = st + obj.TenLoaiDichVu;
                list.Add(obj);
                DeQuy(list, obj.LoaiDichVuId, st + "|=> ");
            }
        }

        [HttpGet("FilterByStatus/{status}")]
        public IEnumerable<LoaiDichVu> getAllByStatus([FromRoute] int status)
        {
            List<LoaiDichVu> list = new List<LoaiDichVu>();
            DeQuyByStatus(list, 0,status, "");
            return list;
        }

        void DeQuyByStatus(List<LoaiDichVu> list, int parentid,int status, string st)
        {
            List<LoaiDichVu> ldv = new List<LoaiDichVu>();
            ldv = _context.LoaiDichVus.Where(r => r.TrangThai == status && r.MaLoaiDichVuCha == parentid).OrderBy(m => m.TenLoaiDichVu).ToList<LoaiDichVu>();
            for (int i = 0; i < ldv.Count; i++)
            {
                LoaiDichVu obj = new LoaiDichVu();
                obj = ldv[i];
                obj.TenLoaiDichVu = st + obj.TenLoaiDichVu;
                list.Add(obj);
                DeQuyByStatus(list, obj.LoaiDichVuId, status, st + "|=> ");
            }
        }

        [HttpGet("ListDV/{id}")]
        public IEnumerable<LoaiDichVu> getListLDV([FromRoute] int id)
        {
            List<LoaiDichVu> list = new List<LoaiDichVu>();
            DeQuyListDV(list, 0, id, "");
            return list;
        }
        void DeQuyListDV(List<LoaiDichVu> list, int parentid, int id, string st)
        {
            List<LoaiDichVu> ldv = new List<LoaiDichVu>();
            ldv = _context.LoaiDichVus.Where(r => r.LoaiDichVuId != id).Where(r => r.MaLoaiDichVuCha == parentid).OrderBy(m => m.TenLoaiDichVu).ToList<LoaiDichVu>();
            //ldv = _context.LoaiDichVus.Where(r => r.LoaiDichVuId != id).OrderBy(m => m.TenLoaiDichVu).ToList<LoaiDichVu>();
            for (int i = 0; i < ldv.Count; i++)
            {
                LoaiDichVu obj = new LoaiDichVu();
                obj = ldv[i];
                obj.TenLoaiDichVu = st + obj.TenLoaiDichVu;
                list.Add(obj);
                DeQuyListDV(list, obj.LoaiDichVuId, id, st + "|=> ");
            }
        }

        [HttpGet("ListDVCB")]
        public IEnumerable<LoaiDichVu> getListDVCB()
        {
            List<LoaiDichVu> list = new List<LoaiDichVu>();
            DeQuyListDVCB(list, 0, "");
            return list;
        }
        void DeQuyListDVCB(List<LoaiDichVu> list, int parentid, string st)
        {
           
            List<LoaiDichVu> ldv = new List<LoaiDichVu>();
            ldv = _context.LoaiDichVus.Where(r => r.TrangThai != 2 && r.MaLoaiDichVuCha == parentid).OrderBy(m => m.TenLoaiDichVu).ToList<LoaiDichVu>();
            for (int i = 0; i < ldv.Count; i++)
            {
                LoaiDichVu obj = new LoaiDichVu();
                obj = ldv[i];
                obj.TenLoaiDichVu = st + obj.TenLoaiDichVu;
                list.Add(obj);
                DeQuyListDVCB(list, obj.LoaiDichVuId, st + "|=> ");
            }
        }
    }
}