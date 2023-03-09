const tokenController = require('../../controllers/token');

describe('Token controller', () => {

    describe('authenticateUser', () => {
      test('is a function', () => {
        expect(typeof tokenController.authenticateUser).toBe('function');
      });
      test("should return 401 Unauthorized when no token is provided", () => {
        const req = { headers: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        authenticateToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
      });
      test("should return 403 Forbidden when an invalid token is provided", () => {
        const req = { headers: { authorization: "Bearer invalid-token" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        authenticateToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
      });
      test("should set req.user to the decoded user ID when a valid token is provided", () => {
        const user = { id: 123 };
        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = { status: jest.fn(), json: jest.fn() };
        const next = jest.fn();
        authenticateToken(req, res, next);
        expect(req.user).toEqual(user);
        expect(next).toHaveBeenCalled();
      });
    });
  
    // Add one more test. Code: #####
    describe('getAllQuizzesByUserId', () => {
      test('is a function', () => {
        expect(typeof tokenController.authenticateToken).toBe('function');
      });
      test("should return 401 Unauthorized when no token is provided", async () => {
        const req = { headers: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        await authenticateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Authentication failed. Token is missing." });
        expect(next).not.toHaveBeenCalled();
      });
  
      test("should return 401 Unauthorized when an invalid token is provided", async () => {
        const req = { headers: { token: "invalid-token" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        await authenticateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Authentication failed." });
        expect(next).not.toHaveBeenCalled();
      });
      test("should return 401 Unauthorized when the token has expired", async () => {
        const user = { id: 123 };
        const token = new Token({ token: "expired-token", userId: user.id, expiresAt: new Date() });
        jest.spyOn(Token, "getTokenByTokenHash").mockResolvedValue(token);
        const req = { headers: { token: token.token } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        await authenticateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Authentication failed. Token has expired." });
        expect(next).not.toHaveBeenCalled();
      });
    });
  
  });
  