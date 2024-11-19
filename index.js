const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.connect");
const Hotels = require("./models/hotel.models");

app.use(express.json());

initializeDatabase();

// const newHotel = {
//   name: "Sunset Resort",
//   category: "Resort",
//   location: "12 Main Road, Anytown",
//   rating: 4.0,
//   reviews: [],
//   website: "https://sunset-example.com",
//   phoneNumber: "+1299655890",
//   checkInTime: "2:00 PM",
//   checkOutTime: "11:00 AM",
//   amenities: [
//     "Room Service",
//     "Horse riding",
//     "Boating",
//     "Kids Play Area",
//     "Bar"
//   ],
//   priceRange: "$$$$ (61+)",
//   reservationsNeeded: true,
//   isParkingAvailable: true,
//   isWifiAvailable: true,
//   isPoolAvailable: true,
//   isSpaAvailable: true,
//   isRestaurantAvailable: true,
//   photos: [
//     "https://example.com/hotel2-photo1.jpg",
//     "https://example.com/hotel2-photo2.jpg"
//   ]
// };

async function createHotel(newHotel) {
  try {
    const hotel = new Hotels(newHotel);
    const saveHotel = await hotel.save();
    console.log("New Hotel Data", saveHotel);
  } catch (error) {
    throw error;
  }
}


app.post("/hotels", async (req, res) => {
try {
  const savedHotel = await createHotel(req.body);
  res.status(201).json({message: "Hotel Added successfully.", hotel: savedHotel})
} catch (error) {
  res.status(500).json({error: "Failed to add hotel."})
}
})

//to get all the hotels in the database

async function readAllHotels() {
  try {
    const readHotels = await Hotels.find();
    return readHotels;
  } catch (error) {
    throw error
  }
}

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();
    if(hotels.length != 0) {
      res.json(hotels)
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant." });
  }
})


// readAllHotels();

// find a hotel with a particular name

async function readByHotelName(hotelName) {
  try {
    const hotelsByName = await Hotels.findOne({name: hotelName});
    return hotelsByName;
  } catch (error) {
    console.log(error)
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotelByName = await readByHotelName(req.params.hotelName);
    if(hotelByName.length != 0) {
      res.json(hotelByName)
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant." });
  }
})

// readByHotelName("Lake View");

//

async function hotelsOffersParking(isOfferParking) {
  try {
    const hotelsOffersParking = await Hotels.find({isParkingAvailable: isOfferParking});
    console.log(hotelsOffersParking)
  } catch (error) {
    console.log(error)
  }
}

// hotelsOffersParking(true);


//

async function restaurantavailability(isRestaurantAvailable) {
  try {
    const hotelsAvailabilityName = await Hotels.find({ isRestaurantAvailable: isRestaurantAvailable});
    console.log(hotelsAvailabilityName);
  } catch {
    console.log(error)
  }
}

// restaurantavailability(true);

//

async function midRangeHotels(midRange) {
  try {
    const hotelsMidRange = await Hotels.find({priceRange: midRange});
    console.log(hotelsMidRange)
  } catch (error) {
    console.log(error)
  }
}

// midRangeHotels("$$$ (31-60)");

//

async function hotelsPriceRange(priceRange) {
  try {
    const allPriceRangeHotels = await Hotels.find({priceRange: priceRange});
    console.log(allPriceRangeHotels)
  } catch (error) {
    console.log(error)
  }
}

// hotelsPriceRange("$$$$ (61+)");

async function hotelsRating(rating) {
  try {
    const hotelRating = await Hotels.find({rating: rating});
    return hotelRating;
  } catch (error) {
    console.log(error)
  }
}

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotelByRating = await hotelsRating(req.params.hotelRating);
    if(hotelByRating != 0) {
      res.json(hotelByRating)
    } else {
      res.status(404).json({ error: "No hotel found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant." });
  }
})
// hotelsRating(4.0);

//

async function hotelsByPhone(phoneNumber) {
  try {
    const hotelsByPhone = await Hotels.findOne({phoneNumber: phoneNumber})
    return hotelsByPhone;
  } catch (error) {
    console.log(error)
  }
}

app.get("/hotels/directory/:phoneNumber",  async (req, res) => {
  try {
    const hotelsByPhoneNumber = await hotelsByPhone(req.params.phoneNumber);
    if(hotelsByPhoneNumber != 0) {
      res.json(hotelsByPhoneNumber)
    } else {
      res.status(404).json({ error: "No hotel found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant." });
  }
})


async function hotelsByCategory(category) {
  try {
    const hotelsByCategory = await Hotels.findOne({category: category})
    return hotelsByCategory;
  } catch (error) {
    console.log(error)
  }
}

app.get("/hotels/category/:hotelCategory",  async (req, res) => {
  try {
    const hotelsByCategoryName = await hotelsByCategory(req.params.hotelCategory);
    if(hotelsByCategoryName != 0) {
      res.json(hotelsByCategoryName)
    } else {
      res.status(404).json({ error: "No hotel found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant." });
  }
})

// hotelsByPhone("+1299655890");

async function hotelUpdate(hotelId, dataToUpdate) {
  try {
    const updatedHotel = await Hotels.findByIdAndUpdate(hotelId, dataToUpdate, {new: true})
    return updatedHotel;
  } catch (error) {
    console.log("Error in updating Hotel data", error)
  }
}

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const hotelUpdatedById = await hotelUpdate(req.params.hotelId, req.body);
    if(hotelUpdatedById) {
      res.status(200).json({message: "Hotel updated successfully.", hotelUpdatedById: hotelUpdatedById});
    } else {
      res.status(404).json({message: "Hotel not found."});
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Hotel." });
  }
})

// hotelUpdate("671f74d2f145e1b243c3bf0f", {checkOutTime: "11:00 AM"})


async function updateHotelByName(hotelName, dataToUpdateByname) {
  try {
    const updatedHotelByName = await Hotels.findOneAndUpdate({name: hotelName}, dataToUpdateByname, {new: true})
    console.log(updatedHotelByName)
  } catch (error) {
    console.log("Error in updating Hotel data", error)
  }
}

// updateHotelByName("Sunset Resort", {rating: 4.2})

async function updateHotelByPhone(hotelNumber, dataUpdateByPhone) {
  try {
    const updatedHotelByPhone = await Hotels.findOneAndUpdate({phoneNumber: hotelNumber}, dataUpdateByPhone, {new: true});
    console.log(updatedHotelByPhone)
  } catch (error) {
    console.log("Error in updating Hotel data", error);
  }
}

// updateHotelByPhone("+1299655890", {phoneNumber: "+1997687392"})

async function deleteHotelById (restaurantId) {
  try {
    const deleteHotel = await Hotels.findByIdAndDelete(restaurantId);
    console.log(deleteHotel);
  } catch (error) {
    console.log("Error in Deleting Hotel data", error)
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotelById(req.params.hotelId);
    if (deletedHotel) {
      res.status(200).json({message: "Hotel deleted successfully."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to delete Hotel."})
  }
})


// deleteHotelById("671f3d89c08bc90e9ca79ad1");

async function deleteHotelByPhoneNumber (restaurantNumber) {
  try {
    const deleteHotel = await Hotels.findOneAndDelete({phoneNumber: restaurantNumber});
    console.log("This Hotel was Deleted:", deleteHotel)
  } catch (error) {
    console.log("Error in Deleting Hotel data", error)
  }
}

// deleteHotelByPhoneNumber("+1234555890");


const PORT = 3000;
app.listen(PORT, ()=> {
  console.log("Server running on port", PORT)
})