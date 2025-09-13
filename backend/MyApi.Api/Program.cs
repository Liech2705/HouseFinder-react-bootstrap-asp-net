
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyApi.Application;
using MyApi.Application.Mappings;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;
using MyApi.Infrastructure.Interfaces;
using MyApi.Infrastructure.Repositories;
using MyApi.Infrastructure.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

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

builder.Services.AddScoped<IPasswordHasherService, PasswordHasherService>();


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

    }, loggerFactory);

    return config.CreateMapper();
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
