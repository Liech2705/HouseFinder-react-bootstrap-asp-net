using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MyApi.Infrastructure.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

            // ✅ Trùng với connection string trong appsettings.json
            optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=HouseFinder;Trusted_Connection=True;");

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
