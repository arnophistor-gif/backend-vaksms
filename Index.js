const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());

// Masukkan API Key Vak-SMS Anda
const API_KEY = 'MASUKKAN_API_KEY_VAK_SMS_ANDA'; 
const BASE_URL = 'https://vak-sms.com';

// Endpoint untuk melayani halaman utama index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// 1. ENDPOINT: Pesan Nomor Virtual Baru
app.get('/api/get-number', async (req, res) => {
    const { service, country } = req.query;
    try {
        const response = await axios.get(`${BASE_URL}/getNumber/?apiKey=${API_KEY}&service=${service}&country=${country}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Gagal memesan nomor virtual' });
    }
});

// 2. ENDPOINT: Cek SMS OTP yang Masuk
app.get('/api/get-sms', async (req, res) => {
    const { idNum } = req.query;
    try {
        const response = await axios.get(`${BASE_URL}/getSmsCode/?apiKey=${API_KEY}&idNum=${idNum}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengecek SMS' });
    }
});

// Ekspor aplikasi agar dikenali oleh Vercel
module.exports = app;
