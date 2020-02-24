using System;
using System.IO;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Persistence;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly DataContext _context;
        private string _publicId;
        private string _url;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public PhotoAccessor(IWebHostEnvironment hostingEnvironment, DataContext context)
        {
            _hostingEnvironment = hostingEnvironment;
            _context = context;
        }

        // Cloudinary
        // private readonly Cloudinary _cloudinary;
        // public PhotoAccessor(IOptions<CloudinarySettings> config)
        // {
        //     var acc = new Account(
        //         config.Value.CloudName,
        //         config.Value.ApiKey,
        //         config.Value.ApiSecret
        //     );

        //     _cloudinary = new Cloudinary(acc);
        // }

        public async Task<PhotoUploadResult> AddPhotoAsync(IFormFile file)
        {
            // Cloudinary
            //  var uploadResult = new ImageUploadResult();

            // if (file.Length > 0)
            // {
            //     using (var stream = file.OpenReadStream())
            //     {
            //         var uploadParams = new ImageUploadParams
            //         {
            //             File = new FileDescription(file.FileName, stream),
            //             Transformation = new Transformation().Height(500).Width(500)
            //             .Crop("fill").Gravity("face")
            //         };

            //         uploadResult = _cloudinary.Upload(uploadParams);
            //     }
            // }

            // if (uploadResult.Error != null)
            //     throw new Exception(uploadResult.Error.Message);

            if (file.Length > 0)
            {
                var uploadDir = @"images";
                var webRootPath = _hostingEnvironment.WebRootPath;
                var extra = DateTime.UtcNow.ToString("yymmssfff");
                var fileName = extra + file.FileName;
                var path = Path.Combine(webRootPath, uploadDir, fileName);
                await file.CopyToAsync(new FileStream(path, FileMode.Create));
                _url = uploadDir + "/" + fileName;
                _publicId = extra;

            }
            return new PhotoUploadResult
            {
                PublicId = _publicId,
                Url = _url
            };
            
            // Cloudinary
            // return new PhotoUploadResult
            // {
            //     PublicId = uploadResult.PublicId,
            //     Url = uploadResult.SecureUri.AbsoluteUri
            // };

        }

        public void DeletePhoto(Photo photo)
        {
            // Cloudinary
            // var deleteParams = new DeletionParams(publicId);
            // var result = _cloudinary.Destroy(deleteParams);
            // return result.Result == "ok" ? result.Result : null;

            var webRootPath = _hostingEnvironment.WebRootPath;
            var imgToDelPath = Path.GetFullPath(webRootPath +'/'+ photo.Url);

            if (System.IO.File.Exists(imgToDelPath))
            {
                System.IO.File.Delete(imgToDelPath);
            }
        }
    }
}