using Microsoft.AspNetCore.SignalR;

namespace Server.lib
{
    public class ReservaHub : Hub
    {
        public async Task SendRevervaUpdate(string message)
        {
            await Clients.All.SendAsync("ReceiveReservaUpdate", message);
        }
    }
}
