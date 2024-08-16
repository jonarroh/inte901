using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Server;
using Server.Models;
using Server.Models.DTO;
using Server.Models.Usuario.Server.Models.Usuario;

namespace Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PurchasesController : ControllerBase
	{
		private readonly Context _context;

		public PurchasesController(Context context)
		{
			_context = context;
		}


		[HttpGet]
		//[Authorize]
		[Route("allCompras")]
		public async Task<IActionResult> GetCompras()
		{
			try
			{
				var compras = await _context.Purchases.ToListAsync();

				if (compras == null || compras.Count == 0)
				{
					return BadRequest("No hay compras encontradas");
				}

				foreach (var compra in compras)
				{
					compra.CreatedAt = DateTime.Parse(compra.CreatedAt.ToString() ?? "");
					compra.DetailPurchases = await _context.DetailPurchases.Where(d => d.IdPurchase == compra.Id).ToListAsync();
					compra.User = await _context.Users.FindAsync(compra.IdUser);
				}

				return Ok(compras);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);

				return NotFound("Se produjo un error en el servidor, contacte a soporte");
			}
		}

		[HttpPost]
		//[Authorize]
		[Route("addCompra")]
		public async Task<IActionResult> AddCompra(PurchaseDTO data)
		{
			try
			{
				if (data == null)
				{
					return BadRequest("No se recibieron datos");
				}

				Purchase compra = new Purchase
				{
					Status = "Pendiente",
					CreatedAt = DateTime.Now,
					IdUser = data.IdUser,
					Total = data.Total
				};

				_context.Purchases.Add(compra);
				await _context.SaveChangesAsync();

				foreach (var detalle in data.Details)
				{
					DetailPurchase detail = new DetailPurchase
					{
						Quantity = detalle.Quantity,
						PriceSingle = detalle.PriceSingle,
						Presentation = detalle.Presentation,
						Expiration = DateTime.Now,
						UnitType = detalle.UnitType,
						CreatedAt = DateTime.Now,
						Status = "Pendiente",
						IdProveedor = detalle.IdProveedor,
						IdMP = detalle.IdMP,
						IdPurchase = compra.Id
					};

					_context.DetailPurchases.Add(detail);
					await _context.SaveChangesAsync();
				}

				return Ok(compra);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);

				return NotFound("Se produjo un error en el servidor, contacte a soporte");
			}
		}

		[HttpPut]
		//[Authorize]
		[Route("updateStatusDetail/{id},{status}")]
		public async Task<IActionResult> UpdateStatusDetail(int id, string status)
		{
			try
			{
				var detalle = await _context.DetailPurchases.FindAsync(id);

				if (detalle == null)
				{
					return BadRequest("Detalle no encontrado");
				}

				detalle.Status = status;

				_context.Update(detalle);
				await _context.SaveChangesAsync();

				return Ok("Detalle actualizado correctamente");
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);

				return NotFound("Se produjo un error en el servidor, contacte a soporte");
			}
		}

		[HttpPut]
		//[Authorize]
		[Route("updateStatusCompra/{id},{status}")]
		public async Task<IActionResult> UpdateStatusCompra(int id, string status)
		{
			try
			{
				var compra = await _context.Purchases.FindAsync(id);
				var detalles = await _context.DetailPurchases.Where(d => d.IdPurchase == id).ToListAsync();

				compra.DetailPurchases = detalles;

				if (compra == null)
				{
					return BadRequest("Compra no encontrada");
				}

				compra.Status = status;

				if (status == "Entregada")
				{
					foreach (var detalle in compra.DetailPurchases)
					{
						detalle.Status = "Entregada";

						var match = detalle.Presentation != null ? Regex.Match(detalle.Presentation, @"\d+") : null;
						int cant = int.Parse(match?.Value ?? "0");

						int totalInventario = (int)(cant * detalle.Quantity!);

						if (detalle.IdMP != null)
						{
							var mp = await _context.InventarioMPs.Where(i => i.IdMateriaPrima == detalle.IdMP).FirstOrDefaultAsync();
							if (mp != null)
							{
								// Realiza la conversión de unidades si es necesario.
								switch (detalle.UnitType)
								{
									case "Kg":
										if (mp.UnidadMedida == "Gr")
										{
											totalInventario *= 1000; // Convierte de Kg a Gr.
										}
										break;
									case "Lt":
										if (mp.UnidadMedida == "Ml")
										{
											totalInventario *= 1000; // Convierte de Lt a Ml.
										}
										break;
									case "Ml":
										if (mp.UnidadMedida == "Lt")
										{
											totalInventario /= 1000; // Convierte de Ml a Lt.
										}
										break;
									case "Pieza":
										// No se requiere conversión adicional.
										break;
								}

								mp.Cantidad += totalInventario;
								_context.Update(mp);
							}
						}
					}
				}
				else
				{
					foreach (var detalle in compra.DetailPurchases)
					{
						detalle.Status = status;

						_context.Update(detalle);
					}
				}

				_context.Update(compra);
				await _context.SaveChangesAsync();

				return Ok(compra);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);

				return NotFound("Se produjo un error en el servidor, contacte a soporte");
			}
		}

		[HttpGet]
		//[Authorize]
		[Route("getDetails/{id}")]
		public async Task<IActionResult> GetDetails(int id)
		{
			try
			{
				var detalles = await _context.DetailPurchases.Where(d => d.IdPurchase == id).ToListAsync();

				if (detalles == null || detalles.Count == 0)
				{
					return BadRequest("No hay detalles encontrados");
				}

				return Ok(detalles);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);

				return NotFound("Se produjo un error en el servidor, contacte a soporte");
			}
		}

		private bool PurchaseExists(int? id)
		{
			return _context.Purchases.Any(e => e.Id == id);
		}


		public class allCompras()
		{
			public int Id { get; set; }
			public string Status { get; set; }
			public DateTime CreatedAt { get; set; }
			public string user { get; set; }
			public string proveedor { get; set; }
			public List<DetalleCompra> DetailPurchases { get; set; }
		}

		public class DetalleCompra()
		{
			public int IdProduct { get; set; }
			public int Quantity { get; set; }
			public double PriceSingle { get; set; }
			public string Presentation { get; set; }
			public DateTime Expiration { get; set; }
			public string UnitType { get; set; }
			public string Status { get; set; }
		}
	}
}
