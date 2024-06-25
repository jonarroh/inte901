namespace Server.lib
{
    public class Encript
    {
        public static string GetSHA256(string str)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = System.Text.Encoding.UTF8.GetBytes(str);
                var hash = sha256.ComputeHash(bytes);
                return GetStringFromHash(hash);
            }
        }

        private static string GetStringFromHash(byte[] hash)
        {
            var result = new System.Text.StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                result.Append(hash[i].ToString("X2"));
            }
            return result.ToString();
        }
    }
}
