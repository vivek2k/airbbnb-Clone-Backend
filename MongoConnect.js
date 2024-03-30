const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const format = require('date-fns')



const app = express();
const port = 4000;
app.use(cors())
const uri = "mongodb+srv://vivek_2e3:test@fakeairbnb.vuhltlh.mongodb.net/?retryWrites=true&w=majority"

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
}

// Connect to MongoDB Atlas
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "reservationData"

});

// Create a mongoose model
const reservationDetails = mongoose.model('reservationDetails', {
  startDate: String,
  endDate: String,
  numGuests: Number,
});

const bookingDetails = mongoose.model('BookingDetails',{
  checkInDate: String,
  checkOutDate: String,
  numberOfGuests: Number,
  bookieName: String,
  bookieAge: Number,
  accommodationPlace: String
});




// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Route to handle form submission
app.post('/api/submit-dates', async (req, res) => {
  try {
    let { startDate, endDate, numGuests} = req.body;
    // console.log(req.body)
    // console.log(startDate)
    // console.log(endDate)
    // console.log(typeof endDate)
    endDate = endDate.slice(0,10)
    // console.log(endDate)
    startDate = startDate.slice(0,10)




    const dateRange = new reservationDetails({ startDate, endDate, numGuests});
    await dateRange.save();

    res.json({ message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*******************************************************************************************************************************/

app.post('/api/submit-data', async (req, res) => {
  try {
    let { checkInDate, checkOutDate, numberOfGuests, bookieName, bookieAge, accommodationPlace} = req.body.bookingDetails;
    checkOutDate = checkOutDate.slice(0,10)
    checkInDate = checkInDate.slice(0,10)

    console.log(req.body.bookingDetails)



    const formData = new bookingDetails({ checkInDate, checkOutDate, numberOfGuests, bookieName, bookieAge, accommodationPlace});
    await formData.save();

    res.json({ message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*******************************************************************************************************************************/
const bookingSchema = new mongoose.Schema({
  checkInDate: String,
  checkOutDate: String,
  numberOfGuests: Number,
  // Add more fields as needed
});

const Booking = mongoose.model('Bookingdetails', bookingSchema);

app.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    // res.json(bookings);
    // console.log(bookings)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



app.get('/reservations', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
    console.log(bookings)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


/*******************************************************************************************************************************/





// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
