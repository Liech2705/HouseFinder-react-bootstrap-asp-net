using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using MyApi.Infrastructure.Data;
using System.IO;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var currentDirectory = Directory.GetCurrentDirectory();

        var configuration = new ConfigurationBuilder()
            .AddJsonFile(Path.Combine(currentDirectory, "appsettings.json"), optional: false, reloadOnChange: true)
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));

        return new AppDbContext(optionsBuilder.Options);
    }
}
