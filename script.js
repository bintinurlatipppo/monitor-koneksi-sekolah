document.addEventListener('DOMContentLoaded', () => {

    // --- Elemen DOM ---
    const pingStatusEl = document.getElementById('ping-status');
    const pingIndicatorEl = document.getElementById('ping-indicator');
    const downloadSpeedEl = document.getElementById('download-speed');
    const uploadSpeedEl = document.getElementById('upload-speed');
    const startSpeedtestBtn = document.getElementById('start-speedtest-btn');
    const speedtestProgressEl = document.getElementById('speedtest-progress');
    const chartCanvas = document.getElementById('connection-chart').getContext('2d');

    // --- Data & Konfigurasi ---
    const PING_GATEWAY_URL = 'https://ipv4.google.com'; // Menggunakan Google sebagai target ping
    const PING_INTERVAL = 3000; // Cek ping setiap 3 detik
    let chart;
    let chartData = {
        labels: [],
        datasets: [{
            label: 'Latensi Ping (ms)',
            data: [],
            borderColor: '#e94560',
            backgroundColor: 'rgba(233, 69, 96, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    // --- Fungsi ---

    /**
     * Fungsi untuk Ping Otomatis (Simulasi)
     * Browser tidak bisa melakukan ICMP ping. Ini adalah simulasi dengan mengukur
     * waktu respons dari sebuah request kecil ke server.
     */
    async function checkPing() {
        const startTime = Date.now();
        try {
            // Menambahkan timestamp untuk mencegah caching
            await fetch(`${PING_GATEWAY_URL}?t=${startTime}`, { mode: 'no-cors' }); 
            const latency = Date.now() - startTime;
            
            updatePingStatus(latency);
            updateChart(latency);

        } catch (error) {
            updatePingStatus(-1); // Menandakan error
        }
    }

    /**
     * Memperbarui tampilan status ping
     */
    function updatePingStatus(latency) {
        if (latency === -1) {
            pingStatusEl.textContent = 'Gagal';
            pingIndicatorEl.textContent = 'Offline';
            pingIndicatorEl.className = 'indicator red';
        } else {
            pingStatusEl.textContent = `${latency} ms`;
            pingIndicatorEl.textContent = 'Online';
            if (latency < 100) {
                pingIndicatorEl.className = 'indicator green';
            } else if (latency < 300) {
                pingIndicatorEl.className = 'indicator orange';
            } else {
                pingIndicatorEl.className = 'indicator red';
            }
        }
    }
    
    /**
     * Fungsi untuk menjalankan Speed Test (Simulasi)
     * API Speedtest.net memerlukan sisi server. Ini adalah simulasi sederhana.
     */
    function runSpeedTest() {
        startSpeedtestBtn.disabled = true;
        speedtestProgressEl.style.display = 'block';
        downloadSpeedEl.textContent = '...';
        uploadSpeedEl.textContent = '...';

        // Simulasi proses download
        setTimeout(() => {
            const downloadSpeed = (Math.random() * (95 - 50) + 50).toFixed(2);
            downloadSpeedEl.textContent = `${downloadSpeed} Mbps`;

            // Simulasi proses upload
            setTimeout(() => {
                const uploadSpeed = (Math.random() * (30 - 10) + 10).toFixed(2);
                uploadSpeedEl.textContent = `${uploadSpeed} Mbps`;

                // Selesai
                startSpeedtestBtn.disabled = false;
                speedtestProgressEl.style.display = 'none';
            }, 2000); // Jeda 2 detik untuk simulasi upload

        }, 3000); // Jeda 3 detik untuk simulasi download
    }

    /**
     * Inisialisasi Grafik Chart.js
     */
    function initializeChart() {
        chart = new Chart(chartCanvas, {
            type: 'line',
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Milidetik (ms)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Waktu'
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    /**
     * Memperbarui data pada grafik
     */
    function updateChart(latency) {
        const now = new Date();
        const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

        chartData.labels.push(timeLabel);
        chartData.datasets[0].data.push(latency);

        // Batasi jumlah data di grafik agar tidak terlalu padat
        const maxDataPoints = 20;
        if (chartData.labels.length > maxDataPoints) {
            chartData.labels.shift();
            chartData.datasets[0].data.shift();
        }

        chart.update();
    }


    // --- Event Listeners & Inisialisasi ---
    startSpeedtestBtn.addEventListener('click', runSpeedTest);

    // Jalankan fungsi saat halaman dimuat
    initializeChart();
    setInterval(checkPing, PING_INTERVAL);
    checkPing(); // Jalankan sekali di awal
});
