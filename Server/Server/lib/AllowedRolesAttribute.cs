using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Server.lib
{
    public class AllowedRolesAttribute : Attribute, IAuthorizationFilter
    {
        private readonly string[] _roles;

        public AllowedRolesAttribute(params string[] roles)
        {
            _roles = roles;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            if (!user.Identity.IsAuthenticated)
            {
                context.Result = new RedirectToActionResult("NotFoundMessage", "Account", new { message = "No autenticado" });
                return;
            }

            var userRole = user.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

            if (userRole == null || !_roles.Contains(userRole))
            {
                context.Result = new RedirectToActionResult("NotFoundMessage", "Account", new { message = "No autorizado" });
            }
        }
    }
}
