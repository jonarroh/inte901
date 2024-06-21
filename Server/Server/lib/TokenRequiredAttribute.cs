using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Server.lib
{
    public class TokenRequiredAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var token = context.HttpContext.Request.Cookies["token"];
            Console.WriteLine(token);
            if (token == null)
            {
                Console.WriteLine("Token not found");
                context.Result = new RedirectToActionResult("NotFoundMessage", "Account", new { message = "Token not found" });
                return;
            }

            try
            {
                var jwtHandler = new JwtSecurityTokenHandler();
                var secretKey = Environment.GetEnvironmentVariable("SECRET_KEY");

                if (string.IsNullOrEmpty(secretKey))
                {
                    context.Result = new RedirectToActionResult("NotFoundMessage", "Account", new {message = "Secret key not found" });
                    return;
                }

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                    ClockSkew = TimeSpan.Zero // Elimina cualquier margen de error de tiempo
                };

                var claimsPrincipal = jwtHandler.ValidateToken(token, validationParameters, out _);
                context.HttpContext.User = claimsPrincipal;
            }
            catch (SecurityTokenExpiredException)
            {
                context.HttpContext.Response.Cookies.Delete("token");
                context.Result = new RedirectToActionResult("NotFoundMessage", "Account", new { message = "Token expirado" });
            }
            catch (SecurityTokenException)
            {
                context.HttpContext.Response.Cookies.Delete("token");
                context.Result = new RedirectToActionResult("NotFoundMessage", "Account", new { message = "Token inválido" });
            }
        }
    }
}
