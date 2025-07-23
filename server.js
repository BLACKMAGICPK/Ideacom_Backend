const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ✅ Declare MongoClient first
const uri = "mongodb+srv://Innothon25:Innothon%402025@innothon25.rwslhpe.mongodb.net/?retryWrites=true&w=majority&appName=Innothon25";
const client = new MongoClient(uri);

// ✅ Declare a global variable for mongoosePS
let mongoosePS;

async function startServer() {
  try {
    // ✅ Connect to MongoDB using MongoClient
    await client.connect();
    console.log("✅ Connected to MongoDB (MongoClient)");

    // ✅ Create mongoose connection for Problem_Statements database
    mongoosePS = await mongoose.createConnection(
      "mongodb+srv://Innothon25:Innothon%402025@innothon25.rwslhpe.mongodb.net/Problem_Statements?retryWrites=true&w=majority&appName=Innothon25",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ Connected to Problem_Statements (Mongoose)");

    // Routes
    app.get("/", (req, res) => {
      res.send("API is running...");
    });

    app.post("/get_WD_PS", async (req, res) => {
    const database = client.db("Problem_Statements");
    const collection = database.collection("PS_WD");

    try {
        const data = await collection.find().toArray(); // Fetch all PS
        if (!data.length) return res.status(404).json({ message: "No problem statements found" });
        res.status(200).json(data);
    } catch (error) {
        console.error("❌ Error fetching problem statements:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    });

    app.post("/get_APP_PS", async (req, res) => {
    const database = client.db("Problem_Statements");
    const collection = database.collection("PS_WD");

    try {
        const data = await collection.find().toArray(); // Fetch all PS
        if (!data.length) return res.status(404).json({ message: "No problem statements found" });
        res.status(200).json(data);
    } catch (error) {
        console.error("❌ Error fetching problem statements:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    });

    app.post("/get_AIML_PS", async (req, res) => {
    const database = client.db("Problem_Statements");
    const collection = database.collection("PS_AIML");

    try {
        const data = await collection.find().toArray(); // Fetch all PS
        if (!data.length) return res.status(404).json({ message: "No problem statements found" });
        res.status(200).json(data);
    } catch (error) {
        console.error("❌ Error fetching problem statements:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    });

    app.post("/get_CS_PS", async (req, res) => {
    const database = client.db("Problem_Statements");
    const collection = database.collection("PS_AIML");

    try {
        const data = await collection.find().toArray(); // Fetch all PS
        if (!data.length) return res.status(404).json({ message: "No problem statements found" });
        res.status(200).json(data);
    } catch (error) {
        console.error("❌ Error fetching problem statements:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    });

    app.post("/get_CC_PS", async (req, res) => {
    const database = client.db("Problem_Statements");
    const collection = database.collection("PS_AIML");

    try {
        const data = await collection.find().toArray(); // Fetch all PS
        if (!data.length) return res.status(404).json({ message: "No problem statements found" });
        res.status(200).json(data);
    } catch (error) {
        console.error("❌ Error fetching problem statements:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    });

    app.post("/get_ARVR_PS", async (req, res) => {
    const database = client.db("Problem_Statements");
    const collection = database.collection("PS_AIML");

    try {
        const data = await collection.find().toArray(); // Fetch all PS
        if (!data.length) return res.status(404).json({ message: "No problem statements found" });
        res.status(200).json(data);
    } catch (error) {
        console.error("❌ Error fetching problem statements:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    });


    
    // 🔧 Generate Unique User ID
   async function generateUserId() {
  const db = client.db("Registered_User");
  const collection = db.collection("user_details");

  const prefix = "IC25";

  // Find all userIds starting with "us25"
  const users = await collection.find({ userId: { $regex: `^${prefix}` } }).toArray();

  // Extract the numeric part after "us25", e.g. from "us25001" get 001
  const numbers = users
    .map((u) => parseInt(u.userId?.slice(4))) // slice(4) removes "us25"
    .filter((num) => !isNaN(num));

  let maxNumber = numbers.length ? Math.max(...numbers) : 0;
  const nextNumber = String(maxNumber + 1).padStart(3, "0");

  return `${prefix}${nextNumber}`; // e.g., us25004
}


app.post("/register", async (req, res) => {
  try {
    const data = req.body;

    const {
      teamName,
      leadName,
      leadPhone,
      leadEmail,
      password,
      confirmPassword,
      gender,
      state,
      college,
      department,
      projectDomain,
      teamCount,
      paymentScreenshot,
      member1Name,
      member1Phone,
      member1Email,
      member1Dept,
      member2Name,
      member2Phone,
      member2Email,
      member2Dept
    } = data;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const db = client.db("Registered_User");
    const collection = db.collection("user_details");

    // 🔍 Check for duplicate lead email
    const existing = await collection.findOne({ "lead.email": leadEmail });
    if (existing) {
      return res.status(409).json({ message: "This email is already registered" });
    }

    const userId = await generateUserId();

    const teamMembers = [];
    if (teamCount >= 2) {
      teamMembers.push({
        name: member1Name,
        phone: member1Phone,
        email: member1Email,
        department: member1Dept,
      });
    }
    if (teamCount >= 3) {
      teamMembers.push({
        name: member2Name,
        phone: member2Phone,
        email: member2Email,
        department: member2Dept,
      });
    }

    const entry = {
      userId,
      teamName,
      lead: {
        name: leadName,
        phone: leadPhone,
        email: leadEmail,
        college,
        department,
        gender,
      },
      password, // Consider hashing
      state,
      projectDomain,
      teamCount,
      teamMembers,
      paymentScreenshot,
      createdAt: new Date(),
    };

    await collection.insertOne(entry);

    res.status(201).json({ message: "Team registered successfully", userId });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const database = client.db("Registered_User");
  const collection = database.collection("user_details");

  try {
    // Find user where lead.email matches and password matches
    const user = await collection.findOne({
      "lead.email": email,
      password: password,
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", userId: user.userId });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// File: routes/profileRoutes.js (or inside app.js if you're keeping all routes together)

app.post("/getUser", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const database = client.db("Registered_User");
    const collection = database.collection("user_details");

    const user = await collection.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude password from response
    const { password, ...userData } = user;

    res.status(200).json(userData);
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const problemStatementSchema = new mongoose.Schema({
  ps_id: String,
  ps_title: String,
  objective: String,
  background: String,
  industry_logo: String,
  industry_name: String,
  sdg1: String,
  sdg2: String
});

// Mapping of domain codes to model
const domainModels = {
  WD: mongoose.model('PS_WD', problemStatementSchema, 'PS_WD'),
  AIML: mongoose.model('PS_AIML', problemStatementSchema, 'PS_AIML'),
  APP: mongoose.model('PS_APP', problemStatementSchema, 'PS_APP'),
  ARVR: mongoose.model('PS_ARVR', problemStatementSchema, 'PS_ARVR'),
  CC: mongoose.model('PS_CC', problemStatementSchema, 'PS_CC'),
  CS: mongoose.model('PS_CS', problemStatementSchema, 'PS_CS'),
  OS: mongoose.model('PS_OS', problemStatementSchema, 'PS_OS')
};


app.post("/getProblemStatementById", async (req, res) => {
  const { ps_id } = req.body;

  try {
    if (!ps_id || typeof ps_id !== "string") {
      return res.status(400).json({ error: "Invalid ps_id format" });
    }

    const parts = ps_id.split("-");
    if (parts.length !== 2) {
      return res.status(400).json({ error: "Invalid ps_id format" });
    }

    const domainCode = parts[1].substring(0, 2).toUpperCase(); // WD, CC, etc.
    const collectionName = `PS_${domainCode}`;
    console.log("🔍 ps_id:", ps_id);
    console.log("📂 Collection:", collectionName);

    // ✅ Use your dedicated mongoosePS connection
    const ProblemStatement = mongoosePS.model(
      collectionName,
      new mongoose.Schema({}, { strict: false }),
      collectionName
    );

    const result = await ProblemStatement.findOne({ ps_id });

    if (!result) {
      return res.status(404).json({ error: "Problem statement not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/checkuser", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const db = client.db("Registered_User");
    const collection = db.collection("user_details");

    const user = await collection.findOne({ "lead.email": email });

    if (user) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (err) {
    console.error("❌ checkuser error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


const otpStorage = {}; // { [email]: { otp: string, expiresAt: timestamp } }

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).send({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  const nodemailer = require("nodemailer");

  // Store OTP in memory for 5 mins
  otpStorage[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 mins from now
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "innothon25@gmail.com",
      pass: "qsgykwwfnhcniohl", // App password
    },
  });

  const mailOptions = {
    from: '"Innocom Support Team" <innothon25@gmail.com>',
    to: email,
    subject: "OTP for Ideacom Reset Password",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Dear User,</h2>
        <p>We received a request to reset the password for your <strong>Ideacom</strong> website account.</p>
        <p>Your One-Time Password (OTP) is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #2d89ef;">${otp}</span>
        </div>
        <p><strong>Note:</strong> This OTP is valid for <strong>5 minutes only</strong>.</p>
        <p>If you did <strong>not</strong> request a password reset, you can safely ignore this email. No changes will be made to your account.</p>
        <br>
        <p>Thank you for being a part of Ideacom!</p>
        <p style="margin-top: 30px;">– Innocom Support Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "OTP sent successfully", otp }); // Optional: Don't send OTP in production
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ message: "Failed to send OTP" });
  }
});


app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const stored = otpStorage[email];

  if (!stored) {
    return res.status(400).json({ message: "OTP not found or expired" });
  }

  if (Date.now() > stored.expiresAt) {
    delete otpStorage[email]; // Clean up expired OTP
    return res.status(400).json({ message: "OTP has expired" });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // OTP is valid, one-time use
  delete otpStorage[email];

  res.json({ message: "OTP verified successfully" });
});

app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password required" });
  }

  try {
    const db = client.db("Registered_User");
    const collection = db.collection("user_details");

    const result = await collection.updateOne(
      { "lead.email": email },
      { $set: { password: newPassword } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/submit-help", async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const db = client.db("Queries");
    const collection = db.collection("user_queries");

    await collection.insertOne({
      firstName,
      lastName,
      email,
      phone,
      message,
      submittedAt: new Date(),
    });

    res.status(200).json({ message: "Help query submitted successfully!" });
  } catch (err) {
    console.error("Error submitting query:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




// Start server only after DB connection
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});

} catch (error) {
console.error("❌ Failed to connect to MongoDB:", error);
}
}
startServer();
