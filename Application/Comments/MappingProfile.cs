using System.Linq;
using Application.Comments.DTOs;
using AutoMapper;
using Domain;

namespace Application.Comments
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Comment, CommentDTO>()
            .ForMember(dst => dst.Username, opt => opt.MapFrom(src => src.Author.UserName))
            .ForMember(dst => dst.DisplayName, opt => opt.MapFrom(src => src.Author.DisplayName))
            .ForMember(dst => dst.Image, opt => opt.MapFrom(src => 
            src.Author.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}