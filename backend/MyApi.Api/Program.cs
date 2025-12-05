using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyApi.Application.Mappings;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;
using MyApi.Infrastructure.Interfaces;
using MyApi.Infrastructure.Repositories;
//using MyApi.Infrastructure.Seeders;
using MyApi.Infrastructure.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Dòng này giúp chuyển Enum thành String khi trả về JSON
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    }); ;
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// service authentication + authorization
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(options =>
{
    // Mặc định API dùng JWT để xác thực
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

    // Scheme riêng để đăng nhập Google/Facebook (dùng cookie tạm)
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie()
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]))
    };

    // Event để kiểm tra token trong DB (revoked token)
    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = async context =>
        {
            await Task.CompletedTask;
        },

        OnAuthenticationFailed = context =>
        {
            // Optionally log or handle failed auth
            return Task.CompletedTask;
        }
    };
})
.AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    options.CallbackPath = "/signin-google"; // 👈 callback mặc định
    options.SaveTokens = true;
    options.ClaimActions.MapJsonKey("urn:google:picture", "picture", "url"); // 👈 thêm claim ảnh
})
.AddFacebook(FacebookDefaults.AuthenticationScheme, options =>
{
    options.AppId = builder.Configuration["Authentication:Facebook:AppId"];
    options.AppSecret = builder.Configuration["Authentication:Facebook:AppSecret"];
    options.CallbackPath = "/signin-facebook"; // 👈 callback mặc định
    options.SaveTokens = true;
    options.Fields.Add("picture");
    options.ClaimActions.MapJsonKey("urn:facebook:picture", "picture.data.url"); // 👈 thêm claim ảnh
});

// service Reponsitory
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IBoardingHouseRepository, BoardingHouseRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IChatConversationRepository, ChatConversationRepository>();
builder.Services.AddScoped<IChatMessageRepository, ChatMessageRepository>();
builder.Services.AddScoped<ICheckBookingRepository, CheckBookingRepository>();
builder.Services.AddScoped<IHouseImageRepository, HouseImageRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>();
builder.Services.AddScoped<IRoomImageRepository, RoomImageRepository>();
builder.Services.AddScoped<IUserPaymentMethodRepository, UserPaymentMethodRepository>();
builder.Services.AddScoped<IRoomPropertyRepository, RoomPropertyRepository>();
builder.Services.AddScoped<IUserInforRepository, UserInforRepository>();
builder.Services.AddScoped<IFavoriteHouseRepository, FavoriteHouseRepository>();

builder.Services.AddScoped<IPasswordHasherService, PasswordHasherService>();

builder.Services.AddScoped<IVnPayService, VnPayService>();
builder.Services.AddTransient<VNPayLibrary>();

// service mapper
builder.Services.AddSingleton<IMapper>(sp =>
{
    var loggerFactory = sp.GetRequiredService<ILoggerFactory>();
    var config = new MapperConfiguration(cfg =>
    {
        cfg.AddMaps(typeof(BoardingHouseMappingProfile).Assembly);
        cfg.AddMaps(typeof(UserMappingProfile).Assembly);
        cfg.AddMaps(typeof(BookingMappingProfile).Assembly);
        cfg.AddMaps(typeof(ChatConversationMappingProfile).Assembly);
        cfg.AddMaps(typeof(ChatMessageMappingProfile).Assembly);
        cfg.AddMaps(typeof(CheckBookingMappingProfile).Assembly);
        cfg.AddMaps(typeof(HouseImageMappingProfile).Assembly);
        cfg.AddMaps(typeof(NotificationMappingProfile).Assembly);
        cfg.AddMaps(typeof(PaymentMappingProfile).Assembly);
        cfg.AddMaps(typeof(ReportMappingProfile).Assembly);
        cfg.AddMaps(typeof(ReviewMappingProfile).Assembly);
        cfg.AddMaps(typeof(RoomImageMappingProfile).Assembly);
        cfg.AddMaps(typeof(RoomMappingProfile).Assembly);
        cfg.AddMaps(typeof(RoomPropertyMappingProfile).Assembly);
        cfg.AddMaps(typeof(UserInforMappingProfile).Assembly);
        cfg.AddMaps(typeof(UserPaymentMethodMappingProfile).Assembly);
        cfg.AddMaps(typeof(FavoriteHouseMappingProfile).Assembly);

    }, loggerFactory);

    return config.CreateMapper();
});

// Thêm CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173",
                    "https://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()
                  .SetIsOriginAllowed(_ => true);
        });
});

builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
});

builder.Services.AddScoped<EmailService>();
builder.WebHost.UseWebRoot("wwwroot");

var app = builder.Build();

// Cho phép truy cập file trong wwwroot
app.UseStaticFiles();

//using (var scope = app.Services.CreateScope())
//{
//    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//    var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasherService>();
//    DataSeeder.Seed(context, hasher);
//}

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors("AllowReactApp");

app.MapHub<ChatHub>("/chatHub");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// use Auth
app.UseAuthentication();
app.UseAuthorization();



app.MapControllers();

app.Run();
