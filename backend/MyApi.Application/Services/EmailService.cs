using MimeKit;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

public class EmailService
{
    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("Room Finder App", "nhlinhcntt2211015@student.ctuet.edu.vn"));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = subject;
        email.Body = new TextPart("html") { Text = body };

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync("nhlinhcntt2211015@student.ctuet.edu.vn", "rdhb ppgw rtdt tpwe");
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}
