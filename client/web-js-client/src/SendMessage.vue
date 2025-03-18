<template>
    <div>
        <h1>Send WhatsApp Message to All Contacts</h1>

        <!-- Button to fetch contacts -->
        <button @click="getContacts">Get All Contacts</button>

        <!-- Show list of contacts -->
        <ul v-if="contacts.length">
            <li v-for="contact in contacts" :key="contact.id">
                {{ contact.name || 'No Name' }} - {{ contact.number }}
            </li>
        </ul>

        <!-- Message form -->
        <form @submit.prevent="sendMessageToAll">
            <textarea v-model="message" placeholder="Enter message" required></textarea>
            <button type="submit">Send to All</button>
        </form>

        <p v-if="statusMessage">{{ statusMessage }}</p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                contacts: [],
                message: '',
                statusMessage: '',
            };
        },
        methods: {
            // Get all contacts from backend
            async getContacts() {
                this.statusMessage = 'Fetching contacts...';
                try {
                    const response = await fetch('http://localhost:3001/contacts');
                    const data = await response.json();
                    if (response.ok) {
                        this.contacts = data;
                        this.statusMessage = 'Contacts fetched successfully!';
                    } else {
                        this.statusMessage = `Error: ${data.error}`;
                    }
                } catch (error) {
                    this.statusMessage = 'Failed to fetch contacts.';
                }
            },

            // Send message to all contacts
            async sendMessageToAll() {
                if (!this.message) {
                    this.statusMessage = 'Please enter a message!';
                    return;
                }

                this.statusMessage = 'Sending message to all contacts...';
                try {
                    const response = await fetch('http://localhost:3001/send-message-to-all', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: this.message }),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        this.statusMessage = data.success;
                    } else {
                        this.statusMessage = `Error: ${data.error}`;
                    }
                } catch (error) {
                    this.statusMessage = 'Failed to send message.';
                }
            },
        },
    };
</script>

<style scoped>
    /* Add your styles here */
</style>
