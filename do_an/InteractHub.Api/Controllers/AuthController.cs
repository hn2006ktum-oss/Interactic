using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public IActionResult Login(User loginUser)
    {
        var user = _context.Users
            .FirstOrDefault(u => u.Username == loginUser.Username 
                              && u.Password == loginUser.Password);

        if (user == null)
        {
            return Unauthorized("Sai tài khoản hoặc mật khẩu");
        }

        return Ok(new
        {
            user.Id,
            user.Username,
            token = "fake-token"
        });
    }
}