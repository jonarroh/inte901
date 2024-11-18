using Microsoft.AspNetCore.SignalR;

namespace Server.lib
{
    public class ReservesHub : Hub
    {
        public async Task SendReverveUpdate(string message)
        {
            await Clients.All.SendAsync("ReceiveReserveUpdate", message);
        }
    }
}
