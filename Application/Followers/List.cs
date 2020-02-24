using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Profiles;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<List<Profile>> 
        { 
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Profile>>
        {
            private readonly DataContext _context;
            private readonly IProfileReader _profileReader;
            public Handler(DataContext context, IProfileReader profileReader)
            {
                _profileReader = profileReader;
                _context = context;
            }

            public async Task<List<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Followings.AsQueryable();

                var users = new List<UserFollowing>();
                var profiles = new List<Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                    {
                        users = await queryable
                        .Where(u => u.Target.UserName == request.Username)
                        .ToListAsync();

                        foreach(var follower in users)
                        {
                            profiles.Add(await _profileReader.ReadProfile(follower.Observer.UserName));
                        }
                        break;
                    }
                    case "following":
                    {
                        users = await queryable
                        .Where(u => u.Observer.UserName == request.Username)
                        .ToListAsync();

                        foreach(var followed in users)
                        {
                            profiles.Add(await _profileReader.ReadProfile(followed.Target.UserName));
                        }
                        break;
                    }
                    
                }

                return profiles;
            }
        }
    }
}