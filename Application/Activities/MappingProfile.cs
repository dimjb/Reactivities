using System.Linq;
using Application.Activities.DTOs;
using AutoMapper;
using Domain;

namespace Application.Activities
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			CreateMap<Activity, ActivityDTO>();
			CreateMap<UserActivity, AttendeeDTO>()
			.ForMember(dst => dst.Username, opt => opt.MapFrom(src => src.AppUser.UserName))
			.ForMember(dst => dst.DisplayName, opt => opt.MapFrom(src => src.AppUser.DisplayName))
			.ForMember(dst => dst.Image, 
			opt => opt.MapFrom(src => src.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url))
			.ForMember(dst => dst.Following, opt => opt.MapFrom<FollowingResolver>());
		}
	}
}