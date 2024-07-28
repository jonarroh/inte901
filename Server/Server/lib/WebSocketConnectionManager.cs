namespace Server.lib
{
    using System;
    using System.Collections.Concurrent;
    using System.Net.WebSockets;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;

    public class WebSocketConnectionManager
    {
        private ConcurrentDictionary<string, WebSocket> _sockets = new ConcurrentDictionary<string, WebSocket>();

        public async Task HandleWebSocketAsync(WebSocket socket, TaskCompletionSource<object> socketFinishedTcs)
        {
            var id = Guid.NewGuid().ToString();
            _sockets.TryAdd(id, socket);

            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            while (!result.CloseStatus.HasValue)
            {
                var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                await ProcessMessage(id, message);

                result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }

            _sockets.TryRemove(id, out WebSocket _);
            await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            socketFinishedTcs.SetResult(null);
        }

        private Task ProcessMessage(string id, string message)
        {
            // Procesar el mensaje recibido
            return Task.CompletedTask;
        }

        public async Task SendMessageAsync(string id, string message)
        {
            if (_sockets.TryGetValue(id, out WebSocket socket))
            {
                var buffer = Encoding.UTF8.GetBytes(message);
                await socket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }

        public async Task BroadcastMessageAsync(string message)
        {
            foreach (var socket in _sockets.Values)
            {
                var buffer = Encoding.UTF8.GetBytes(message);
                await socket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
    }

}
