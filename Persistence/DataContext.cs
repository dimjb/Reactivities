using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {           
        }
        
        public DbSet<Activity> Activities { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> Followings { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserActivity>(b => b.HasKey(ua => 
            new {ua.AppUserId, ua.ActivityId}));

            builder.Entity<UserActivity>()
            .HasOne(u => u.AppUser).WithMany(ua => ua.UserActivities)
            .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserActivity>()
            .HasOne(a => a.Activity).WithMany(ua => ua.UserActivities)
            .HasForeignKey(a => a.ActivityId);

            builder.Entity<UserFollowing>(b =>
            {
                b.HasKey(uf => new {uf.ObserverId, uf.TargetId});

                b.HasOne(o => o.Observer).WithMany(f => f.Followings)
                .HasForeignKey(o => o.ObserverId)
                .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(t => t.Target).WithMany(f => f.Followers)
                .HasForeignKey(t => t.TargetId)
                .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
