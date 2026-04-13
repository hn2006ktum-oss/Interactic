using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult Register(User user)
    {
        if (_context.Users.Any(u => u.Username == user.Username))
        {
            return BadRequest("Tài khoản đã tồn tại");
        }

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok(user);
    }
    [HttpGet]
public IActionResult GetAll()
{
    return Ok(_context.Users.ToList());
}
}