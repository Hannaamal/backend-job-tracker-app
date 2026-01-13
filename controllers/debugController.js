import jwt from "jsonwebtoken";

// Debug endpoint to check cookies and JWT structure
export const debugCookies = (req, res) => {
  console.log("=== DEBUG COOKIES ===");
  console.log("All cookies:", req.cookies);
  console.log("auth_token cookie:", req.cookies.auth_token);
  console.log("user_role cookie:", req.cookies.user_role);
  console.log("=== END DEBUG COOKIES ===");
  
  const response = {
    message: "Cookie debug info logged to console",
    cookies: {
      auth_token: req.cookies.auth_token ? "Present" : "Missing",
      user_role: req.cookies.user_role ? "Present" : "Missing",
      all: req.cookies
    }
  };
  
  // If auth_token exists, decode it to show structure
  if (req.cookies.auth_token) {
    try {
      const decoded = jwt.verify(req.cookies.auth_token, process.env.JWT_SECRET);
      response.jwt_payload = decoded;
      console.log("=== JWT PAYLOAD ===");
      console.log("Decoded JWT:", decoded);
      console.log("=== END JWT PAYLOAD ===");
    } catch (error) {
      response.jwt_error = "Failed to decode JWT: " + error.message;
      console.log("=== JWT DECODE ERROR ===");
      console.log("Error:", error.message);
      console.log("=== END JWT ERROR ===");
    }
  }
  
  res.json(response);
};

// Debug endpoint to show what cookies are set during login/register
export const debugSetCookies = (req, res) => {
  // This would be called after login/register to show what cookies were set
  const response = {
    message: "Debug: Check console for cookie information",
    note: "This endpoint shows what cookies should be set during auth"
  };
  
  console.log("=== EXPECTED COOKIES TO BE SET ===");
  console.log("auth_token: Should contain JWT with { id, role }");
  console.log("user_role: Should contain just the role string");
  console.log("=== END EXPECTED COOKIES ===");
  
  res.json(response);
};
