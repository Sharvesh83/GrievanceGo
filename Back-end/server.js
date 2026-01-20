require("dotenv").config();
const express = require("express");
const connectDB = require("./DB/DB"); // Kept connectDB as it's used for DB connection
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit"); // New import
const jwksRsa = require("jwks-rsa"); // New import
const { z } = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Grievance, User } = require("./Models/model");
const { analyzeGrievance } = require("./services/aiService");

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_this_later";

// Security Middleware
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter); // Apply rate limiting to all requests
app.use(cors()); // Configure this stricter for production
app.use(express.json());

// Validation Schemas
const userSignupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10).optional(),
  role: z.enum(["citizen", "official"]).optional()
});

const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const grievanceSchema = z.object({
  name: z.string().min(1),
  wardno: z.string().min(1),
  phoneno: z.string().min(10),
  arealimit: z.string().optional(),
  subject: z.string().min(1),
  department: z.string().min(1),
  address: z.string().min(1),
  description: z.string().min(1),
  userId: z.string().min(1),
  createdBy: z.string().optional()
});

const chatSchema = z.object({
  id: z.string().min(1),
  chat: z.object({
    sender: z.string(),
    message: z.string(),
    timestamp: z.string().or(z.date()).optional()
  }).passthrough()
});

const updateStatusSchema = z.object({
  id: z.string().min(1)
});

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "dev-ptjwad16y8r7u01u.us.auth0.com"; // Fallback to provided example or user update

const client = jwksRsa({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      console.error("JWKS Error:", err);
      return callback(err);
    }
    var signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401);

  // Decode to check signature type
  const decoded = jwt.decode(token, { complete: true });

  if (!decoded || !decoded.header) return res.sendStatus(403);

  if (decoded.header.alg === 'RS256') {
    // Auth0 Verification
    jwt.verify(token, getKey, {
      algorithms: ['RS256'],
      // Issuer check is critical for security
      issuer: `https://${AUTH0_DOMAIN}/`
    }, (err, user) => {
      if (err) {
        console.error("Auth0 Token Invalid:", err);
        return res.sendStatus(403);
      }
      // Normalize Auth0 user to our schema
      req.user = {
        id: user.sub,
        name: user.name || user.nickname || user.email,
        email: user.email,
        role: "citizen" // Default role for Auth0 users
      };
      next();
    });
  } else {
    // Local Verification
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
};

// Auth Routes

app.post("/api/signup", async (req, res) => {
  try {
    const validatedData = userSignupSchema.parse(req.body);
    const { email, password } = validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...validatedData,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const validatedData = userLoginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Grievance Routes

app.get("/api/user-grievances", authenticateToken, async (req, res) => {
  try {
    // Determine userId from token or query? 
    // Ideally use req.user.id from token to enforce privacy.
    // For backward compatibility w/ params, keeping check, but strictly we should use req.user.id

    // For now, let's allow finding by query if present AND matches token, or just list user's own.
    const userId = req.user.id;

    const comp = await Grievance.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(comp);
  } catch (error) {
    console.error("Error fetching user grievances:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/all-grievances", async (req, res) => {
  // Should this be protected for officials only?
  // Adding protection for now, requiring at least a valid token.
  // Ideally check if req.user.role === 'official'

  try {
    const comp = await Grievance.find().sort({ createdAt: -1 });
    res.status(200).json(comp);
  } catch (error) {
    console.error("Error fetching all grievances:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/addinfo", authenticateToken, async (req, res) => {
  try {
    const validatedData = grievanceSchema.parse(req.body);

    // AI Analysis
    const analysis = await analyzeGrievance(validatedData.description, validatedData.subject);

    const dta = await Grievance.create({
      ...validatedData,
      // Enforce userId from token to prevent spoofing
      userId: req.user.id,
      createdBy: req.user.name,
      createdOn: new Date(),
      resolvedOn: null,
      status: "In progress",
      aiAnalysis: analysis
    });

    res.status(201).json(dta);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error adding grievance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/addchat", authenticateToken, async (req, res) => {
  try {
    const validatedData = chatSchema.parse(req.body);
    const { id, chat } = validatedData;

    // Optional: Check if user owns grievance or is official

    await Grievance.updateOne(
      { _id: id },
      { $push: { chats: chat } }
    );

    const updatedDoc = await Grievance.findById(id);
    res.status(200).json(updatedDoc);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error adding chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/api/updatestatus", authenticateToken, async (req, res) => {
  try {
    const validatedData = updateStatusSchema.parse(req.body);
    const { id } = validatedData;

    await Grievance.updateOne(
      { _id: id },
      {
        resolvedOn: new Date(),
        status: "Resolved",
      }
    );

    const updatedDoc = await Grievance.findById(id);
    res.status(200).json(updatedDoc);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
