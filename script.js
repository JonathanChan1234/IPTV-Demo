var hls = new Hls();
function playHLSStream(source, width) {
    if (Hls.isSupported()) {
        hls.destroy();
        hls = new Hls();
        const video = document.getElementById('video');
        video.style.width = width;
        video.pause();
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            var isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
            if (isPlaying) video.pause();
            video.play();
        });
        hls.on(Hls.Events.MANIFEST_PARSED, function (_, data) {});
        hls.on(Hls.Events.ERROR, function (_, data) {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        // try to recover network error
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        hls.recoverMediaError();
                        break;
                    default:
                        // cannot recover
                        hls.destroy();
                        break;
                }
            }
        });
        hls.loadSource(source);
        // bind them together
        hls.attachMedia(video);
    }
}

function changeStream(event) {
    event.preventDefault();
    const streamSelect = document.getElementById('stream-source-select');
    const playerWidth = document.getElementById('player-select');
    playHLSStream(streamSelect.value, playerWidth.value);
}

function changePlayerSize(event) {
    const video = document.getElementById('video');
    video.style.width = event.target.value;
}

function toggleSettings() {
    const settingContainer = document.getElementById('settings-container');
    settingContainer.classList.toggle('hide');
}

function formatForecastDate(date) {
    return `${date.substring(6, 8)}/${date.substring(4, 6)}`;
}

function fetchForecastData() {
    fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc', { method: 'GET' })
        .then((response) => {
            if (response.status === 200) return response.json();
            const errorText = document.getElementById('error-text');
            errorText.innerText = 'Fail to fetch data from HKO';
        })
        .then((response) => {
            const forecast = response.weatherForecast.map((data) => ({
                date: formatForecastDate(data.forecastDate),
                maxTemp: data.forecastMaxtemp.value,
                minTemp: data.forecastMintemp.value,
                icon: data.ForecastIcon,
                dayOfWeek: data.week,
                maxRh: data.forecastMaxrh.value,
                minRh: data.forecastMinrh.value,
            }));
            const forecastContainer = document.getElementById('forecast-container');
            let forecastElements = '';
            forecast.forEach((data) => {
                forecastElements += `
               <div class="daily-forecast-container">
                   <div class="forecast-date">${data.date}</div>
                   <div class="forecast-dayOfWeek">(${data.dayOfWeek})</div>
                   <img
                       class="forecast-icon"
        src="./assets/pic${data.icon}.png"
                       style="
                           background-color: #1b5397;
                           width: 50px;
                           border-radius: 15px;
                           padding: 5px;
                       "
                       border="0"
                   />
                   <div class="forecast-temp">${data.minTemp}&#8451; | ${data.maxTemp}&#8451;</div>
                   <div class="forecast-temp">${data.minRh}-${data.maxRh}%</div>
               </div>
        `;
            });
            forecastContainer.innerHTML = forecastElements;
        });
}

fetchForecastData();
playHLSStream('https://rthktv32-live.akamaized.net/hls/live/2036819/RTHKTV32/master.m3u8', '768px');
setInterval(function () {
    fetchForecastData();
}, 300000);
