const express = require("express");
const User = require("./models/User");
const Driver = require("./models/Driver");
const Adduser = require("./models/Adduser");
const Car = require("./models/Car");
const File = require("./models/File");
const bodyParser = require("body-parser");
const multer = require("multer");
const Brand = require("./models/Brand");
const Varient = require("./models/Varient");
const Passenger = require("./models/Passenger");
const Hotel = require("./models/Hotel");
const Discount = require("./models/Discount");
const Notification = require("./models/Notification");
const Banner = require("./models/Banner");
const Model = require("./models/Model");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();
require("./db/Config.js");
const app = express();
const PORT = process.env.PORT || 3004;
app.use(express.json());

const corsOptions = {
  origin: "https://admin-live-project.onrender.com",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

const _dirname = path.resolve();

app.use(express.static(path.join(_dirname, "Frontend/build")));

app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "Frontend/build", "index.html"));
});

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/CarImage", express.static(path.join(__dirname, "/CarImage")));
app.use("/DriverImage", express.static(path.join(__dirname, "/DriverImage")));
app.use("/BrandImage", express.static(path.join(__dirname, "/BrandImage")));
app.use(
  "/PassengerImage",
  express.static(path.join(__dirname, "/PassengerImage"))
);
app.use("/HotelImage", express.static(path.join(__dirname, "/HotelImage")));
app.use("/BannerImage", express.static(path.join(__dirname, "/BannerImage")));

//Signup

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Name, email, and password are required fields.",
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "failed",
        message: "Email is already registered. Please log in.",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      status: "success",
      message: "Signup successful",
      user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("Error in /signup:", error);
    res.status(500).json({
      status: "failed",
      message: "Unable to sign up. Internal server error.",
    });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    console.log("Received credentials:", email, password);
    if (email && password) {
      const user = await User.findOne({ email: email });
      if (user) {
        // Check if the provided password matches the stored password
        if (user.password === password) {
          res.json({
            status: "success",
            message: "Login successful",
            user: {
              _id: user._id,
              email: user.email,
              // Include other user properties if needed
            },
          });
        } else {
          res.status(401).json({
            status: "failed",
            message: "Email or password does not match",
          });
        }
      } else {
        res.status(404).json({
          status: "failed",
          message: "Email is not registered",
        });
      }
    } else {
      res.status(400).json({
        status: "failed",
        message: "Email and password are required fields",
      });
    }
    console.log("Finished userLogin successfully");
  } catch (error) {
    console.error("Error in userLogin:", error);
    res.status(500).json({
      status: "failed",
      message: "Unable to login. Internal server error.",
    });
  }
});
// Update password route
app.post("/changePassword", async (req, res) => {
  try {
    const { oldPassword, newPassword, userEmail } = req.body;
    console.log(oldPassword, newPassword, userEmail);

    if (!userEmail) {
      return res.status(400).json({
        status: "failed",
        message: "User email not found in session.",
      });
    }

    // Fetch the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
    }

    // Check if old password is correct
    // const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (oldPassword != user.password) {
      return res.status(401).json({
        status: "failed",
        message: "Old password is incorrect.",
      });
    }

    // Hash the new password before storing it
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const updatedUser = await User.updateOne(
      { email: userEmail },
      { password: newPassword }
    );

    console.log("USER:::::::::", updatedUser);

    if (updatedUser) {
      return res.json({
        status: "success",
        message: "Password updated successfully.",
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: "Internal server error. Unable to update password.",
      });
    }
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({
      status: "failed",
      message: "Unable to update password. Internal server error.",
    });
  }
});

//adduser api
app.post("/Adduser", async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    technology,
    age,
    gender,
    phoneNumber,
    address,
  } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await Adduser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new user
    const newUser = new Adduser({
      firstname,
      lastname,
      email,
      technology,
      age,
      gender,
      phoneNumber,
      address,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get users api
app.get("/User", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await Adduser.find().sort({ timeTemps: -1 });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users.", error: error.message });
  }
});

//users delete api
app.delete("/User/:_id", async (req, resp) => {
  const result = await Adduser.deleteOne({ _id: req.params._id });
  resp.send(result);
});

//user update api
app.get("/UpdateUser/:_id", async (req, resp) => {
  const result = await Adduser.findOne({ _id: req.params._id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No Record Found" });
  }
});

app.put("/UpdateUser/:_id", async (req, resp) => {
  try {
    const result = await Adduser.updateOne(
      { _id: req.params._id }, // Filter to find the document with the given _id
      { $set: req.body } // Update with the data from req.body
    );
    resp.send(result);
  } catch (error) {
    resp.status(500).send(error);
  }
});

//search api user
app.get("/search/:key", async (req, res) => {
  try {
    const { key } = req.params;
    // Perform a case-insensitive search for users whose firstname, lastname, or email match the search value
    const filteredUsers = await Adduser.find({
      $or: [
        { firstname: { $regex: new RegExp(key, "i") } },
        { lastname: { $regex: new RegExp(key, "i") } },
        { email: { $regex: new RegExp(key, "i") } },
      ],
    });
    res.json(filteredUsers);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//total users api
app.get("/api/total-users", async (req, res) => {
  try {
    const totalUsers = await Adduser.countDocuments();
    res.json({ totalUsers });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//active deactive api user
app.patch("/Active/:id", async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const user = await Adduser.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the active state in the database
    user.active = active;
    await user.save();

    res.json({ message: "Active state updated successfully" });
  } catch (error) {
    console.error("Error updating active state:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//image uplaod api
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      file.originalname.slice(-4); // Append a unique suffix to the filename
    cb(null, uniqueSuffix); // Generate a unique filename for the uploaded file
  },
});

const upload = multer({ storage: storage });

// Endpoint to handle image upload
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    // Save the file path to the database
    const newFile = new File({ path: req.file.path });
    await newFile.save();
    console.log(newFile);
    res.json({ imagePath: req.file.path });
  } catch (error) {
    console.error("Error saving file path to database:", error);
    res.status(500).json({ error: "Failed to save file path to database" });
  }
});
//image get api
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/user/image", async (req, res) => {
  const userEmail = req.query.email; // Get the email from the query parameter

  try {
    // Call your function to get user image by email from the database
    const imageUrl = await getUserImageByEmail(userEmail);

    if (!imageUrl) {
      // If user image not found, send a 404 response
      return res.status(404).json({ error: "User image not found" });
    }

    // If image found, send the image URL in the response
    res.json({ imageUrl });
  } catch (error) {
    // If an error occurs, send a 500 response with the error message
    console.error("Error fetching user image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Drivers add api
const storageDriver = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "DriverImage/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      file.originalname.slice(-4); // Append a unique suffix to the filename
    cb(null, uniqueSuffix); // Generate a unique filename for the uploaded file
  },
});

const uploadDriver = multer({ storage: storageDriver });

app.post("/AddDriver", uploadDriver.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Extract car data from the request body
    const { carId, driverName, licenseNumber, phoneNumber, address, email } =
      req.body;

    // Validate required fields
    if (
      !carId ||
      !driverName ||
      !licenseNumber ||
      !phoneNumber ||
      !address ||
      !email
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save the file path and other car data to the database
    const newDriver = new Driver({
      car: carId,
      driverName,
      licenseNumber,
      phoneNumber,
      address,
      email,
      image: req.file.path, // Assuming req.file.path contains the path to the uploaded image
    });

    await newDriver.save();
    res.json({
      message: "driver details and image uploaded successfully",
      car: newDriver,
    });
  } catch (error) {
    console.error(
      "Error saving driver details and file path to database:",
      error
    );
    res.status(500).json({
      error: "Failed to save driver details and file path to database",
    });
  }
});

//get all drivers api
app.get("/Driver", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await Driver.find().sort({ timeTemps: -1 });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users.", error: error.message });
  }
});

app.get("/get-driver/:id", async (req, res) => {
  try {
    const driverId = req.params.id;
    const driver = await Driver.findById(driverId).populate({
      path: "car",
      populate: [{ path: "brand" }, { path: "model" }, { path: "variant" }],
    });

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.json({ driver });
  } catch (error) {
    console.error("Error fetching driver and car details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/Driver/:_id", async (req, resp) => {
  const result = await Driver.deleteOne({ _id: req.params._id });
  resp.send(result);
});

//driver update api
app.get("/UpdateDriver/:_id", async (req, resp) => {
  const result = await Driver.findOne({ _id: req.params._id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No Record Found" });
  }
});

// const uploadup = multer({ storage: storageup });
const uploadD = multer({ dest: "DriverImage/" });
app.put("/UpdateDriver/:id", uploadD.single("image"), async (req, res) => {
  try {
    const { driverName, licenseNumber, phoneNumber, address, email, car } =
      req.body;
    let imagePath = null;

    // Check if a new image was uploaded
    if (req.file) {
      imagePath = req.file.path;
    } else {
      // If no new image was uploaded, check if a previous image path was provided
      imagePath = req.body.prevImage || null;
    }
    // Store the image path if uploaded

    // Update the car data in the database using Mongoose
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      {
        driverName,
        licenseNumber,
        phoneNumber,
        address,
        email,
        car,
        image: imagePath, // Update the image path in the database
      },
      { new: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ error: "Driver not found" });
    } else {
      res.json({
        success: true,
        message: "Driver data updated successfully",
        updatedDriver,
      });
    }
  } catch (error) {
    console.error("Error updating Driver data:", error);
    res.status(500).json({ error: "Failed to update Driver data" });
  }
});
//search api driver
app.get("/searchDriver/:key", async (req, res) => {
  const key = req.params.key.toLowerCase();
  try {
    const result = await Driver.find({
      $or: [
        { driverName: { $regex: key, $options: "i" } }, // Case-insensitive search for driverName
        { licenseNumber: { $regex: key, $options: "i" } }, // Case-insensitive search for licenseNumber
        { phoneNumber: { $regex: key } }, // Exact match for phoneNumber
        { address: { $regex: key, $options: "i" } }, // Case-insensitive search for address
      ],
    });
    res.json(result);
  } catch (error) {
    console.error("Error searching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//total drivers api show
app.get("/api/total-drivers", async (req, res) => {
  try {
    const totalDrivers = await Driver.countDocuments();
    res.json({ totalDrivers });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//total Passenger Api
app.get("/api/total-cars", async (req, res) => {
  try {
    const totalDrivers = await Car.countDocuments();
    res.json({ totalDrivers });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Total Cars api
app.get("/api/total-passenger", async (req, res) => {
  try {
    const totalDrivers = await Passenger.countDocuments();
    res.json({ totalDrivers });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//active deactive api user
app.patch("/ActiveDriver/:id", async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Update the active state in the database
    driver.active = active;
    await driver.save();

    res.json({ message: "Active state updated successfully" });
  } catch (error) {
    console.error("Error updating active state:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//add car image api
const storagecar = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "CarImage/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      file.originalname.slice(-4); // Append a unique suffix to the filename
    cb(null, uniqueSuffix); // Generate a unique filename for the uploaded file
  },
});
const uploadCar = multer({ storage: storagecar });
app.post("/Addcar", uploadCar.single("image"), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract car data from the request body
    const {
      modelId,
      brandId,
      variantId,
      carName,
      year,
      price,
      color,
      registrationDate,
    } = req.body;

    // Validate required fields
    if (
      !modelId ||
      !brandId ||
      !variantId ||
      !carName ||
      !year ||
      !price ||
      !color ||
      !registrationDate
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save the file path and other car data to the database
    const newCar = new Car({
      model: modelId,
      brand: brandId,
      variant: variantId,
      carName,
      year,
      price,
      color,
      registrationDate,
      image: req.file.path,
    });

    await newCar.save();
    return res.status(201).json({
      message: "Car details and image uploaded successfully",
      car: newCar,
    });
  } catch (error) {
    console.error("Error saving car details and file path to database:", error);
    return res.status(500).json({
      error: "Failed to save car details and file path to database",
      actualError: error.message || error,
    });
  }
});

//get car api
app.get("/Car", async (req, res) => {
  try {
    // Fetch all users from the database
    const cars = await Car.find()
      .sort({ timeTemps: -1 })
      .populate({ path: "brand" })
      .populate({ path: "model" })
      .populate({ path: "variant" });
    res.status(200).json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users.", error: error.message });
  }
});
//car delete api
app.delete("/Car/:_id", async (req, resp) => {
  const result = await Car.deleteOne({ _id: req.params._id });
  resp.send(result);
});
//car update api
app.get("/UpdateCars/:id", async (req, resp) => {
  try {
    const result = await Car.findOne({ _id: req.params.id });
    if (result) {
      resp.send(result);
    } else {
      resp.status(404).send({ error: "No Record Found" });
    }
  } catch (error) {
    console.error("Error fetching car details:", error);
    resp.status(500).send({ error: "Failed to fetch car details" });
  }
});
// const uploadup = multer({ storage: storageup });
const uploadup = multer({ dest: "uploads/" });
app.put("/UpdateCar/:id", uploadup.single("image"), async (req, res) => {
  try {
    const {
      model,
      brand,
      variant,
      carName,
      year,
      color,
      price,
      registrationDate,
    } = req.body;
    // const imagePath = req.file ? req.file.path : null;
    let imagePath = null;

    // Check if a new image was uploaded
    if (req.file) {
      imagePath = req.file.path;
    } else {
      // If no new image was uploaded, check if a previous image path was provided
      imagePath = req.body.prevImage || null;
    }
    // Store the image path if uploaded

    // Update the car data in the database using Mongoose
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      {
        model,
        brand,
        variant,
        carName,
        year,
        color,
        price,
        registrationDate,
        image: imagePath, // Update the image path in the database
      },
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    } else {
      res.json({
        success: true,
        message: "Car data updated successfully",
        updatedCar,
      });
    }
  } catch (error) {
    console.error("Error updating car data:", error);
    res.status(500).json({ error: "Failed to update car data" });
  }
});
//search api car
app.get("/searchCar/:key", async (req, res) => {
  try {
    const { key } = req.params;
    // Perform a case-insensitive search for models containing the search keyword
    const filteredCar = await Car.find({
      color: { $regex: new RegExp(key, "i") },
    })
      .populate("model")
      .populate("brand")
      .populate("variant"); // Populate the 'brand' field from the Brand collection
    res.json(filteredCar);
  } catch (error) {
    console.error("Error searching models:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//new brand add api
const storagelogo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "BrandImage/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      file.originalname.slice(-4); // Append a unique suffix to the filename
    cb(null, uniqueSuffix); // Generate a unique filename for the uploaded file
  },
});
const uploadBrand = multer({ storage: storagelogo });
app.post("/AddBrand", uploadBrand.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Extract car data from the request body
    const { brand, description } = req.body;

    // Validate required fields
    if (!brand || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save the file path and other car data to the database
    const newBrand = new Brand({
      brand,
      description,
      image: req.file.path, // Assuming req.file.path contains the path to the uploaded image
    });

    await newBrand.save();
    res.json({
      message: "Brand details and image uploaded successfully",
      brand: newBrand,
    });
  } catch (error) {
    console.error(
      "Error saving brand details and file path to database:",
      error
    );
    res.status(500).json({
      error: "Failed to save brand details and file path to database",
    });
  }
});

//brands get api
app.get("/brands", async (req, res) => {
  try {
    // Retrieve all brands from the database
    const brands = await Brand.find().sort({ timeTemps: -1 });

    // Send the brands as a JSON response
    res.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});
//brand search api
app.get("/searchBrand/:key", async (req, res) => {
  try {
    const { key } = req.params;
    // Perform  match the search value
    const filteredCars = await Brand.find({
      $or: [{ brand: { $regex: new RegExp(key, "i") } }],
    });
    res.json(filteredCars);
  } catch (error) {
    console.error("Error searching brand:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//brand delete api
app.delete("/Brand/:_id", async (req, resp) => {
  const result = await Brand.deleteOne({ _id: req.params._id });
  resp.send(result);
});
//brand update api
app.get("/UpdateBrand/:_id", async (req, resp) => {
  const result = await Brand.findOne({ _id: req.params._id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No Record Found" });
  }
});
const uploadB = multer({ dest: "PassengerImage/" });
app.put("/UpdateBrand/:id", uploadB.single("image"), async (req, res) => {
  try {
    const { brand, description } = req.body;
    let imagePath = null;

    // Check if a new image was uploaded
    if (req.file) {
      imagePath = req.file.path;
    } else {
      // If no new image was uploaded, check if a previous image path was provided
      imagePath = req.body.prevImage || null;
    }

    // Update the brand data in the database using Mongoose
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        brand,
        description,
        image: imagePath, // Update the image path in the database
      },
      { new: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({ error: "Brand not found" });
    } else {
      res.json({
        success: true,
        message: "Brand data updated successfully",
        updatedBrand,
      });
    }
  } catch (error) {
    console.error("Error updating brand data:", error);
    res.status(500).json({ error: "Failed to update brand data" });
  }
});
//add model api
app.post("/AddModel", async (req, res) => {
  try {
    const { model, brandId } = req.body;

    // Validate input
    if (!model) {
      return res.status(400).json({ error: "Model is required" });
    }

    let brand = null;
    if (brandId) {
      // Check if the brand exists
      const existingBrand = await Brand.findById(brandId);
      if (!existingBrand) {
        // If brand doesn't exist, set brand to null
        brand = null;
      } else {
        // If brand exists, assign the brand ID
        brand = brandId;
      }
    }
    // Create a new model document
    const newModel = new Model({ model, brand });
    // Save the model to the database
    await newModel.save();
    // Send a success response
    res
      .status(201)
      .json({ message: "Model added successfully", model: newModel });
  } catch (error) {
    console.error("Error adding model:", error);
    res.status(500).json({ error: "Failed to add model" });
  }
});
//get models api
app.get("/models", async (req, res) => {
  try {
    const { brandId } = req.query;
    let query = {};
    if (brandId) {
      query.brand = brandId;
    }
    // Retrieve all models from the database
    const models = await Model.find(query)
      .sort({ timeTemps: -1 })
      .populate({ path: "brand" });

    // Send the models as a JSON response
    res.json(models);
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});
app.get("/Allmodels", async (req, res) => {
  try {
    // Retrieve all models from the database
    const models = await Model.find().sort({ timeTemps: -1 });

    // Send the models as a JSON response
    res.json(models);
  } catch (error) {
    console.error("Error fetchingmodels:", error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

//model update api
app.get("/UpdateModel/:_id", async (req, resp) => {
  try {
    const result = await Model.findOne({ _id: req.params._id });
    if (result) {
      resp.send(result);
    } else {
      resp.status(404).send({ error: "No Record Found" });
    }
  } catch (error) {
    console.error("Error fetching model details:", error);
    resp.status(500).send({ error: "Failed to fetch model details" });
  }
});

app.put("/UpdateModel/:id", async (req, res) => {
  const { id } = req.params;
  const { model, brand } = req.body;

  try {
    // Find the model by ID and update its data
    const updatedModel = await Model.findByIdAndUpdate(
      id,
      { model, brand },
      { new: true }
    );

    // Check if the model exists
    if (!updatedModel) {
      return res.status(404).json({ error: "Model not found" });
    }

    // Send the updated model as a JSON response
    res.json(updatedModel);
  } catch (error) {
    console.error("Error updating model data:", error);
    res.status(500).json({ error: "Failed to update model data" });
  }
});

//search model api
app.get("/searchModel/:key", async (req, res) => {
  try {
    const { key } = req.params;
    // Perform a case-insensitive search for models containing the search keyword
    const filteredModels = await Model.find({
      model: { $regex: new RegExp(key, "i") },
    }).populate("brand"); // Populate the 'brand' field from the Brand collection
    res.json(filteredModels);
  } catch (error) {
    console.error("Error searching models:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//delete model api
app.delete("/Model/:_id", async (req, resp) => {
  const result = await Model.deleteOne({ _id: req.params._id });
  resp.send(result);
});

//add  varient api
app.post("/variants", async (req, res) => {
  try {
    // Extract data from the request body
    const { variant, brandId, modelId } = req.body;

    // Validate input
    if (!variant || !brandId || !modelId) {
      return res
        .status(400)
        .json({ error: "Variant, brand ID, and model ID are required" });
    }

    // Create a new variant document
    const newVariant = new Varient({ variant, brand: brandId, model: modelId });

    // Save the variant to the database
    await newVariant.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "Variant added successfully", variant: newVariant });
  } catch (error) {
    console.error("Error adding variant:", error);
    res.status(500).json({ error: "Failed to add variant" });
  }
});
//get varient api
app.get("/variants", async (req, res) => {
  try {
    const { modelId } = req.query;
    let query = {};
    if (modelId) {
      query.model = modelId;
    }
    // Retrieve all variants from the database
    const variants = await Varient.find(query)
      .sort({ timeTemps: -1 })
      .populate({ path: "brand" })
      .populate({ path: "model" });

    // Send the variants as a JSON response
    res.json(variants);
  } catch (error) {
    console.error("Error fetching variants:", error);
    res.status(500).json({ error: "Failed to fetch variants" });
  }
});
app.get("/Allvariants", async (req, res) => {
  try {
    // Retrieve all varients from the database
    const varients = await Varient.find().sort({ timeTemps: -1 });

    // Send the varients as a JSON response
    res.json(varients);
  } catch (error) {
    console.error("Error fetching varients:", error);
    res.status(500).json({ error: "Failed to fetch varients" });
  }
});
//search varient api
app.get("/searchVariant/:key", async (req, res) => {
  try {
    const { key } = req.params;
    // Perform a case-insensitive search for models containing the search keyword
    const filteredVariants = await Varient.find({
      variant: { $regex: new RegExp(key, "i") },
    })
      .populate("model")
      .populate("brand"); // Populate the 'brand' field from the Brand collection
    res.json(filteredVariants);
  } catch (error) {
    console.error("Error searching models:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//varient dalete api
app.delete("/Varient/:_id", async (req, resp) => {
  const result = await Varient.deleteOne({ _id: req.params._id });
  resp.send(result);
});
//varinet update api
app.get("/VarientUpdate/:_id", async (req, resp) => {
  const result = await Varient.findOne({ _id: req.params._id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No Record Found" });
  }
});

app.put("/variants/:id", async (req, res) => {
  const { id } = req.params;
  const { variant, brandId, modelId } = req.body;

  try {
    // Find the variant by ID and update its data
    const updatedVariant = await Varient.findByIdAndUpdate(
      id,
      { variant, brandId, modelId },
      { new: true }
    );

    // Check if the variant exists
    if (!updatedVariant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    // Send the updated variant as a JSON response
    res.json(updatedVariant);
  } catch (error) {
    console.error("Error updating variant data:", error);
    res.status(500).json({ error: "Failed to update variant data" });
  }
});

// Passenger add api
const storagePassenger = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "PassengerImage/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      file.originalname.slice(-4); // Append a unique suffix to the filename
    cb(null, uniqueSuffix); // Generate a unique filename for the uploaded file
  },
});

const uploadPassenger = multer({ storage: storagePassenger });

app.post("/Addpassenger", uploadPassenger.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Extract car data from the request body
    const { name, email, phoneNumber, address } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !address) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save the file path and other car data to the database
    const newPassenger = new Passenger({
      name,
      email,
      phoneNumber,
      address,
      image: req.file.path, // Assuming req.file.path contains the path to the uploaded image
    });

    await newPassenger.save();
    res.json({
      message: "passenger details and image uploaded successfully",
      car: newPassenger,
    });
  } catch (error) {
    console.error(
      "Error saving passenger details and file path to database:",
      error
    );
    res.status(500).json({
      error: "Failed to save passenger details and file path to database",
    });
  }
});

//get Passenger api
app.get("/Passenger", async (req, res) => {
  try {
    // Fetch all users from the database
    const passenger = await Passenger.find().sort({ timeTemps: -1 });
    res.status(200).json(passenger);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users.", error: error.message });
  }
});

//passenger update api
app.get("/UpdatePassengerData/:_id", async (req, resp) => {
  const result = await Passenger.findOne({ _id: req.params._id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No Record Found" });
  }
});

const uploadP = multer({ dest: "PassengerImage/" });
app.put("/UpdatePassenger/:id", uploadP.single("image"), async (req, res) => {
  try {
    const { name, email, phoneNumber, address } = req.body;
    let imagePath = null;

    // Check if a new image was uploaded
    if (req.file) {
      imagePath = req.file.path;
    } else {
      // If no new image was uploaded, check if a previous image path was provided
      imagePath = req.body.prevImage || null;
    }
    // Store the image path if uploaded

    // Update the car data in the database using Mongoose
    const updatedPassenger = await Passenger.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phoneNumber,
        address,
        image: imagePath, // Update the image path in the database
      },
      { new: true }
    );

    if (!updatedPassenger) {
      return res.status(404).json({ error: "Passenger not found" });
    } else {
      res.json({
        success: true,
        message: "Passenger data updated successfully",
        updatedPassenger,
      });
    }
  } catch (error) {
    console.error("Error updating Passenger data:", error);
    res.status(500).json({ error: "Failed to update Passenger data" });
  }
});
//passenger delete api
app.delete("/Passenger/:_id", async (req, resp) => {
  const result = await Passenger.deleteOne({ _id: req.params._id });
  resp.send(result);
});

//Active Passenger api
app.patch("/ActivePassenger/:id", async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const passenger = await Passenger.findById(id);
    if (!passenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    // Update the active state in the database
    passenger.active = active;
    await passenger.save();

    res.json({ message: "Active state updated successfully" });
  } catch (error) {
    console.error("Error updating active state:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//search passenger api
app.get("/searchPassenger/:key", async (req, res) => {
  try {
    const { key } = req.params;
    // Perform  match the search value
    const filteredP = await Passenger.find({
      $or: [{ name: { $regex: new RegExp(key, "i") } }],
    });
    res.json(filteredP);
  } catch (error) {
    console.error("Error searching passenger:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Add hotel Post Api
const storageHotel = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "HotelImage/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      file.originalname.slice(-4); // Append a unique suffix to the filename
    cb(null, uniqueSuffix); // Generate a unique filename for the uploaded file
  },
});

const uploadHotel = multer({ storage: storageHotel });
app.post("/AddHotel", uploadHotel.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Extract hotel data from the request body
    const { name, personName, email, phoneNumber } = req.body;

    // Validate required fields
    if (!name || !personName || !email || !phoneNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save the file path and other car data to the database
    const newHotel = new Hotel({
      name,
      personName,
      email,
      phoneNumber,
      image: req.file.path, // Assuming req.file.path contains the path to the uploaded image
    });

    await newHotel.save();
    res.json({
      message: "hotel details and image uploaded successfully",
      Hotel: newHotel,
    });
  } catch (error) {
    console.error(
      "Error saving hotel details and file path to database:",
      error
    );
    res.status(500).json({
      error: "Failed to save hotel details and file path to database",
    });
  }
});

//Get Hotel Api
app.get("/Hotel", async (req, res) => {
  try {
    // Fetch all users from the database
    const hotels = await Hotel.find().sort({ timeTemps: -1 });
    res.status(200).json(hotels);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching hotels.", error: error.message });
  }
});

//Hotel Update api
app.get("/UpdateHotelFetch/:_id", async (req, resp) => {
  const result = await Hotel.findOne({ _id: req.params._id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No Record Found" });
  }
});

const uploadH = multer({ dest: "HotelImage/" });
app.put("/UpdateHotel/:id", uploadH.single("image"), async (req, res) => {
  try {
    const { name, personName, email, phoneNumber } = req.body;
    let imagePath = null;

    // Check if a new image was uploaded
    if (req.file) {
      imagePath = req.file.path;
    } else {
      // If no new image was uploaded, check if a previous image path was provided
      imagePath = req.body.prevImage || null;
    }
    // Store the image path if uploaded

    // Update the car data in the database using Mongoose
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        personName,
        email,
        phoneNumber,
        image: imagePath, // Update the image path in the database
      },
      { new: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({ error: "Hotel not found" });
    } else {
      res.json({
        success: true,
        message: "Hotel data updated successfully",
        updatedHotel,
      });
    }
  } catch (error) {
    console.error("Error updating Hotel data:", error);
    res.status(500).json({ error: "Failed to update Hotel data" });
  }
});

//Hotel delete api
app.delete("/deleteHotel/:_id", async (req, resp) => {
  const result = await Hotel.deleteOne({ _id: req.params._id });
  resp.send(result);
});

//Search Hotel api
app.get("/searchHotel/:key", async (req, res) => {
  try {
    const { key } = req.params;
    // Perform  match the search value
    const filteredP = await Hotel.find({
      $or: [{ name: { $regex: new RegExp(key, "i") } }],
    });
    res.json(filteredP);
  } catch (error) {
    console.error("Error searching hotel:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Post Discount Api
app.post("/AddDiscount", async (req, res) => {
  try {
    const {
      couponCode,
      totalCoupon,
      discountType,
      discountAmount,
      userType,
      maxUsers,
      minAmount,
      maxAmount,
      startDate,
      endDate,
    } = req.body;

    // Check if the coupon code already exists
    const existingDiscount = await Discount.findOne({ couponCode });
    if (existingDiscount) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }

    // Create a new discount
    const newDiscount = new Discount({
      couponCode,
      totalCoupon,
      discountType,
      discountAmount,
      userType,
      maxUsers,
      minAmount,
      maxAmount,
      startDate,
      endDate,
    });

    // Save the discount to the database
    await newDiscount.save();

    res.status(201).json({ message: "Discount added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get Discount Api
app.get("/Discount", async (req, res) => {
  try {
    // Fetch all discounts from the database
    const discounts = await Discount.find().sort({ timeTemps: -1 });
    res.status(200).json(discounts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching discounts.", error: error.message });
  }
});

app.get("/discountUpdateFetch/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    res.status(200).json(discount);
  } catch (error) {
    console.error("Error fetching discount:", error);
    res.status(500).json({ message: "Failed to fetch discount" });
  }
});
app.put("/discountUpdate/:id", async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    const updatedDiscount = await Discount.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!updatedDiscount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    res.status(200).json(updatedDiscount);
  } catch (error) {
    console.error("Error updating discount:", error);
    res
      .status(500)
      .json({ message: "Failed to update discount", error: error.message });
  }
});

//Delete Discount api
app.delete("/deleteDiscount/:_id", async (req, resp) => {
  const result = await Discount.deleteOne({ _id: req.params._id });
  resp.send(result);
});

//Notifiction Post Api
app.post("/notifications", async (req, res) => {
  try {
    // Extract data from the request body
    const {
      recipientType,
      title,
      messageText,
      selectedUsers,
      selectedDrivers,
    } = req.body;

    // Create a new notification instance
    const newNotification = new Notification({
      recipientType,
      title,
      messageText,
      selectedUsers,
      selectedDrivers,
    });

    // Save the notification to the database
    await newNotification.save();

    // Send a success response
    res.status(201).json({
      message: "Notification created successfully",
      notification: newNotification,
    });
  } catch (error) {
    // If there's an error, send an error response
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Get Notifications api
app.get("/notifications", async (req, res) => {
  try {
    // Fetch all discounts from the database
    const notifications = await Notification.find().sort({ timeTemps: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notifications.", error: error.message });
  }
});
app.get("/notifications/:id", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Search Notification api
app.get("/searchNotification/:key", async (req, res) => {
  try {
    const { key } = req.params;
    // Perform  match the search value
    const filteredP = await Notification.find({
      $or: [{ title: { $regex: new RegExp(key, "i") } }],
    });
    res.json(filteredP);
  } catch (error) {
    console.error("Error searching hotel:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Add New Banner Post Api
const storageB = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "BannerImage/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      file.originalname.slice(-4); // Append a unique suffix to the filename
    cb(null, uniqueSuffix); // Generate a unique filename for the uploaded file
  },
});
const uploadBanner = multer({ storage: storageB });
app.post("/AddBanner", uploadBanner.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Extract car data from the request body
    const { title } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save the file path and other car data to the database
    const newBanner = new Banner({
      title,
      image: req.file.path, // Assuming req.file.path contains the path to the uploaded image
    });

    await newBanner.save();
    res.json({
      message: "Banner details and image uploaded successfully",
      title: newBanner,
    });
  } catch (error) {
    console.error(
      "Error saving banner details and file path to database:",
      error
    );
    res.status(500).json({
      error: "Failed to save banner details and file path to database",
    });
  }
});
//Get Api Banner
app.get("/banners", async (req, res) => {
  try {
    // Retrieve all banners from the database
    const banners = await Banner.find().sort({ timeTemps: -1 });

    // Send the banners as a JSON response
    res.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ error: "Failed to fetch banners" });
  }
});

//Banner update api
app.get("/UpdateBanner/:_id", async (req, resp) => {
  const result = await Banner.findOne({ _id: req.params._id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No Record Found" });
  }
});

const uploadBa = multer({ dest: "BannerImage/" });
app.put("/UpdateBanner/:id", uploadBa.single("image"), async (req, res) => {
  try {
    const { title } = req.body;
    let imagePath = null;

    // Check if a new image was uploaded
    if (req.file) {
      imagePath = req.file.path;
    } else {
      // If no new image was uploaded, check if a previous image path was provided
      imagePath = req.body.prevImage || null;
    }
    // Store the image path if uploaded

    // Update the car data in the database using Mongoose
    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        title,
        image: imagePath, // Update the image path in the database
      },
      { new: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({ error: "banner not found" });
    } else {
      res.json({
        success: true,
        message: "Banner data updated successfully",
        updatedBanner,
      });
    }
  } catch (error) {
    console.error("Error updating Banner data:", error);
    res.status(500).json({ error: "Failed to update Banner data" });
  }
});
//Dekete api banner
app.delete("/Banner/:_id", async (req, resp) => {
  const result = await Banner.deleteOne({ _id: req.params._id });
  resp.send(result);
});

//Active Api Petch
app.patch("/ActiveBanner/:id", async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Update the active state in the database
    banner.active = active;
    await banner.save();

    res.json({ message: "Active state updated successfully" });
  } catch (error) {
    console.error("Error updating active state:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
