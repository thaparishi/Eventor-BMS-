// Importing models
import banquetModel from "../models/banquet.js";
import bookedSchema from "../models/book.js";
import AdminModel from "../models/admin.js";
import registerModel from "../models/register.js";
import nodemailer from "nodemailer";

// Importing jwt to create a token.
import jwt from "jsonwebtoken";
import { generatePassword } from "../utils/passwordGenerator.js";

export const getBanquet = async (req, res) => {
  try {
    const { token } = req.params;
    let decoded = await jwt.verify(token, "jwtsecret");

    const { date } = decoded;

    const bookData = await bookedSchema.findOne({ date: date });

    if (bookData !== null) {
      const banquetData = await banquetModel.find({
        banquet_name: { $ne: bookData.banquetName },
      });
      return res.json(banquetData);
    }
    const banquetData = await banquetModel.find({});
    res.json(banquetData);
  } catch (error) {
    console.log(error);
  }
};

export const createBanquet = async (req, res) => {
  try {
    // Destructing the objects.
    const { name, desc, location, price, location_lat, location_lon } = req.body;
    const newName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const { path } = req.file;

    console.log(path);
    if (path) {
      const splitedData = path.split("\\");
      const newPath = splitedData[5];
      console.log(newPath);
      if (name && desc) {
        // Creating a token.
        const token = jwt.sign(
          {
            userId: req.signedCookies.userId,
            banquet_name: newName,
            banquet_description: desc,
            banquet_location: location,
            location_coordinates: {
              lat: location_lat,
              lon: location_lon
            },
            banquet_price: price,
            image_location: filename,
          },
          "jwtsecret",
          {
            expiresIn: "1200s",
          }
        );
        return res.redirect(`http://localhost:3000/menu/${token}`);
      }
    }
    res.json("Unsucessful");
  } catch (error) {
    console.log(error);
  }
};

// Add this new function to get nearby banquets
export const getNearbyBanquets = async (req, res) => {
  try {
    const { lat, lon } = req.params;
    
    // Get all banquets
    const banquets = await banquetModel.find({});
    
    // Calculate distance for each banquet
    const banquetsWithDistance = banquets.map(banquet => {
      // Calculate distance using Haversine formula
      const distance = calculateDistance(
        parseFloat(lat), 
        parseFloat(lon),
        parseFloat(banquet.location_coordinates.lat),
        parseFloat(banquet.location_coordinates.lon)
      );
      
      return {
        ...banquet._doc,
        distance: distance
      };
    });
    
    // Sort by distance
    banquetsWithDistance.sort((a, b) => a.distance - b.distance);
    
    res.json(banquetsWithDistance);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get nearby banquets" });
  }
};

// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
}

export const filterBanquetName = async (req, res) => {
  try {
    const { name } = req.params;
    const searchTerm = name.toLowerCase();
    const getBanquetName = await banquetModel.find({
      banquet_name: { $regex: `.*${searchTerm}.*`, $options: "i" },
    });

    if (getBanquetName.length === 0) {
      return res.send("unsucessful");
    }

    const results = getBanquetName.filter((banquet) => {
      const sentence = banquet.banquet_name.toLowerCase();
      const words = sentence.split(" ");
      return words.some((word) => {
        return word.includes(searchTerm) || searchTerm.includes(word);
      });
    });

    res.json(results);
  } catch (error) {
    console.log(error);
  }
};

export const filterBanquetLocation = async (req, res) => {
  try {
    // Destructing the objects.
    const { name } = req.params;
    console.log(name);
    const getBanquetLocation = await banquetModel.find({
      banquet_location: name,
    });
    if (getBanquetLocation.length === 0) {
      return res.send("unsucessful");
    }
    res.json(getBanquetLocation);
  } catch (error) {
    console.log(error);
  }
};

export const filterBanquetPrice = async (req, res) => {
  try {
    const { range } = req.params;
    console.log(range);
    const [lessValue, greaterValue] = range.split(",");
    const getBanquetRange = await banquetModel.find({
      banquet_price: { $gte: lessValue, $lte: greaterValue },
    });
    // console.log(getBanquetRange);
    if (getBanquetRange.length === 0) {
      return res.send("unsucessful");
    }
    res.json(getBanquetRange);
  } catch (error) {
    console.log(error);
  }
};

export const filterBanquetAscending = async (req, res) => {
  try {
    const getBanquetRange = await banquetModel.aggregate([
      { $sort: { banquet_price: 1 } },
    ]);
    if (getBanquetRange.length === 0) {
      return res.send("unsucessful");
    }
    console.log(getBanquetRange);
    res.json(getBanquetRange);
  } catch (error) {
    console.log(error);
  }
};

export const filterBanquetDescending = async (req, res) => {
  try {
    const getBanquetRange = await banquetModel.aggregate([
      { $sort: { banquet_price: -1 } },
    ]);
    // console.log(getBanquetRange);
    if (getBanquetRange.length === 0) {
      return res.send("unsucessful");
    }
    res.json(getBanquetRange);
  } catch (error) {
    console.log(error);
  }
};