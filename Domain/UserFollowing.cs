namespace Domain
{
    public class UserFollowing
    {
        public string ObserverId { get; set; } //follower
        public virtual AppUser Observer { get; set; }
        public string TargetId { get; set; } //followed
        public virtual AppUser Target { get; set; }
    }
}