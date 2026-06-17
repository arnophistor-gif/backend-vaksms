const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Mengizinkan HTML Anda untuk mengakses backend ini
app.use(cors());
app.use(express.json());

// Mengambil API Key aman dari pengaturan Render
const API_KEY = process.env.VAK_SMS_API_KEY;

// 1. Jalur Ping untuk UptimeRobot (Agar server aktif 24 jam gratis)
app.get('/ping', (req, res) => {
    res.status(200).send('Server Aktif');
});

// 2. Jalur Cek Saldo Akun Vak-SMS Anda
app.get('/api/saldo', async (req, res) => {
    try {
        const response = await axios.get(`https://vak-sms.com{API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data saldo' });
    }
});

// 3. Jalur Ambil Nomor (Contoh parameter di HTML: ?country=id&service=wa)
app.get('/api/ambil-nomor', async (req, res) => {
    const { country, service } = req.query;
    
    if (!country || !service) {
        return res.status(400).json({ error: 'Parameter country dan service wajib diisi' });
    }

    try {
        const response = await axios.get(`https://vak-sms.com{API_KEY}&service=${service}&country=${country}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil nomor' });
    }
});

// 4. Jalur Cek SMS / OTP yang Masuk (Butuh ID Transaksi dari langkah ambil nomor)
app.get('/api/cek-sms', async (req, res) => {
    const { idNum } = req.query;
    
    if (!idNum) {
        return res.status(400).json({ error: 'Parameter idNum wajib diisi' });
    }

    try {
        const response = await axios.get(`https://vak-sms.com{API_KEY}&idNum=${idNum}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengecek SMS' });
    }
});

// 5. Jalur Batalkan Nomor (Jika OTP tidak kunjung masuk / hangus)
app.get('/api/batalkan-nomor', async (req, res) => {
    const { idNum } = req.query;

    if (!idNum) {
        return res.status(400).json({ error: 'Parameter idNum wajib diisi' });
    }

    try {
        // Status 'end' digunakan untuk membatalkan nomor di Vak-SMS
        const response = await axios.get(`https://vak-sms.com{API_KEY}&status=end&idNum=${idNum}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Gagal membatalkan nomor' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend berjalan di port ${PORT}`);
});

