const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const app = express()

// Basic setup
app.use(express.json())
app.use(express.static('public'))

// MongoDB connection with updated options
const mongoConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/animal-pictures', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        })
        console.log('Connected to MongoDB!')
    } catch (err) {
        console.log('MongoDB connection error:', err)
        // Retry connection
        setTimeout(mongoConnect, 5000)
    }
}

mongoConnect()

// Create picture model
const Picture = mongoose.model('Picture', {
    animalType: String,
    url: String,
    timestamp: { type: Date, default: Date.now }
})

// Get random number between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get picture from API with error handling
async function getPictureUrl(animalType) {
    try {
        if (animalType === 'cat') {
            const response = await axios.get('https://api.thecatapi.com/v1/images/search')
            return response.data[0].url
        } else if (animalType === 'dog')  {
            const response = await axios.get('https://dog.ceo/api/breeds/image/random')
            return response.data.message
        } else {
            // Generate random dimensions between 200-400
            const width = getRandomInt(200, 400)
            const height = 300  // Keep height constant or you can randomize this too
            return `https://placebear.com/${width}/${height}`
        }
    } catch (error) {
        console.log('Error fetching image:', error)
        throw new Error('Failed to fetch image URL')
    }
}

// Save new pictures
app.post('/save-pictures', async (req, res) => {
    try {
        const { animalType, count = 1 } = req.body
        
        if (!animalType || !['cat', 'dog', 'bear'].includes(animalType)) {
            return res.status(400).json({ message: 'Invalid animal type' })
        }
        
        const savedPictures = []
        
        for (let i = 0; i < Math.min(count, 10); i++) {
            const url = await getPictureUrl(animalType)
            const picture = new Picture({
                animalType,
                url
            })
            await picture.save()
            savedPictures.push(picture)
        }
        
        res.json(savedPictures)
    } catch (err) {
        console.log('Error saving pictures:', err)
        res.status(500).json({ message: 'Could not save pictures' })
    }
})
// Get last picture
app.get('/last-picture/:animalType', async (req, res) => {
    try {
        const { animalType } = req.params
        
        if (!['cat', 'dog', 'bear'].includes(animalType)) {
            return res.status(400).json({ message: 'Invalid animal type' })
        }

        const picture = await Picture
            .findOne({ animalType })
            .sort({ timestamp: -1 })
            .exec()
        
        if (picture) {
            res.json(picture)
        } else {
            res.status(404).json({ message: 'No pictures found' })
        }
    } catch (err) {
        console.log('Error getting last picture:', err)
        res.status(500).json({ message: 'Could not get picture' })
    }
})

// Get all pictures of the desired animal
app.get('/all-pictures/:animalType', async (req, res) => {
    try {
        const { animalType } = req.params
        
        if (!['cat', 'dog', 'bear'].includes(animalType)) {
            return res.status(400).json({ message: 'Invalid animal type' })
        }

        const pictures = await Picture
            .find({ animalType })
            .sort({ timestamp: -1 })
            .exec()
        
        res.json(pictures)
    } catch (err) {
        console.log('Error getting pictures:', err)
        res.status(500).json({ message: 'Could not get pictures' })
    }
})

// Start server
const port = 3000
app.listen(port, () => {
    console.log(`Server started! Listening on port ${port}`)
    console.log(`To access the app open your browser to http://localhost: ${port}`)
    console.log('Verify MongoDB connection http://localhost:27017')
    console.log('Press Ctrl+C to stop the server')
})