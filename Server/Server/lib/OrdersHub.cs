using Microsoft.AspNetCore.SignalR;

namespace Server.Hubs
{
    public class OrderHub : Hub
    {
        public async Task SendOrderUpdate(string message)
        {
            await Clients.All.SendAsync("ReceiveOrderUpdate", message);
        }
    }
}
