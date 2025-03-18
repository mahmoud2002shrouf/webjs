const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware to parse JSON body
app.use(express.json());
app.use(cors());  // Enable CORS

// Create a new client instance for WhatsApp Web
const client = new Client({
    puppeteer: {
        headless: true, // Run in headless mode
    },
    authStrategy: new LocalAuth({
        clientId: "myClient", // Use a unique clientId
    }),
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED');
    qrcode.generate(qr, { small: true }); // Display QR code in terminal
});

client.on('ready', () => {
    console.log('WhatsApp Web client is ready!');
});

// Endpoint to get all contacts
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await client.getContacts();
        const contactList = contacts.map(contact => ({
            id: contact.id._serialized, // The unique contact ID
            name: contact.pushname, // Contact name
            number: contact.id.user, // Contact phone number
        }));
        res.status(200).json(contactList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts.' });
    }
});

// Send message to all contacts
app.post('/send-message-to-all', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        // Get all contacts
        const contacts = await client.getContacts();

        // Send message to all contacts
        for (let contact of contacts) {
            await client.sendMessage(`${contact.id.user}@c.us`, message);
        }

        res.status(200).json({ success: 'Message sent to all contacts!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message to all contacts.' });
    }
});

client.initialize();

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
