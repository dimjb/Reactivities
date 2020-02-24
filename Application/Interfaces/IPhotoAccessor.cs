using System.Threading.Tasks;
using Application.Photos;
using Domain;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        // Cloudinary
        //  PhotoUploadResult AddPhotoAsync(IFormFile file);
        //  string DeletePhoto(string publicId);
         Task<PhotoUploadResult> AddPhotoAsync(IFormFile file);
         void DeletePhoto(Photo photo);
    }
}