namespace Server.lib
{
    public interface IHttpCDNService
    {
        Task<string> UploadImageAsync(IFormFile image, int id);
    }

    public class HttpCDNService : IHttpCDNService
    {
        private readonly HttpClient _httpClient;

        private readonly IConfiguration _configuration;

        public HttpCDNService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }


        public async Task<string> UploadImageAsync(IFormFile image, int id)
        {
            using var content = new MultipartFormDataContent();
            await using var fileStream = image.OpenReadStream();
            content.Add(new StreamContent(fileStream), "file", image.FileName);
            content.Add(new StringContent(id.ToString()), "id");

            var response = await _httpClient.PostAsync(_configuration["CdnService:User"], content);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadAsStringAsync();
            return result;
        }
    }
}
