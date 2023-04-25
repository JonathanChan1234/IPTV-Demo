// var hls = new Hls();
// function playHLSStream(source, width) {
//     if (Hls.isSupported()) {
//         hls.destroy();
//         hls = new Hls();
//         const video = document.getElementById('video');
//         video.style.width = width;
//         video.pause();
//         hls.on(Hls.Events.MEDIA_ATTACHED, function () {
//             var isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
//             if (isPlaying) video.pause();
//             video.play();
//         });
//         hls.on(Hls.Events.MANIFEST_PARSED, function (_, data) {});
//         hls.on(Hls.Events.ERROR, function (_, data) {
//             if (data.fatal) {
//                 switch (data.type) {
//                     case Hls.ErrorTypes.NETWORK_ERROR:
//                         // try to recover network error
//                         hls.startLoad();
//                         break;
//                     case Hls.ErrorTypes.MEDIA_ERROR:
//                         hls.recoverMediaError();
//                         break;
//                     default:
//                         // cannot recover
//                         hls.destroy();
//                         break;
//                 }
//             }
//         });
//         hls.loadSource(source);
//         // bind them together
//         hls.attachMedia(video);
//     }
// }

// function changeStream(event) {
//     event.preventDefault();
//     const streamSelect = document.getElementById('stream-source-select');
//     const playerWidth = document.getElementById('player-select');
//     playHLSStream(streamSelect.value, playerWidth.value);
// }

// function changePlayerSize(event) {
//     const video = document.getElementById('video');
//     video.style.width = event.target.value;
// }

// function toggleSettings() {
//     const settingContainer = document.getElementById('settings-container');
//     settingContainer.classList.toggle('hide');
// }

// function formatForecastDate(date) {
//     return `${date.substring(6, 8)}/${date.substring(4, 6)}`;
// }

// function fetchForecastData() {
//     fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc', { method: 'GET' })
//         .then((response) => {
//             if (response.status === 200) return response.json();
//             const errorText = document.getElementById('error-text');
//             errorText.innerText = 'Fail to fetch data from HKO';
//         })
//         .then((response) => {
//             const forecast = response.weatherForecast.map((data) => ({
//                 date: formatForecastDate(data.forecastDate),
//                 maxTemp: data.forecastMaxtemp.value,
//                 minTemp: data.forecastMintemp.value,
//                 icon: data.ForecastIcon,
//                 dayOfWeek: data.week,
//                 maxRh: data.forecastMaxrh.value,
//                 minRh: data.forecastMinrh.value,
//             }));
//             const forecastContainer = document.getElementById('forecast-container');
//             let forecastElements = '';
//             forecast.forEach((data) => {
//                 forecastElements += `
//                <div class="daily-forecast-container">
//                    <div class="forecast-date">${data.date}</div>
//                    <div class="forecast-dayOfWeek">(${data.dayOfWeek})</div>
//                    <img
//                        class="forecast-icon"
//         src="./assets/pic${data.icon}.png"
//                        style="
//                            background-color: #1b5397;
//                            width: 50px;
//                            border-radius: 15px;
//                            padding: 5px;
//                        "
//                        border="0"
//                    />
//                    <div class="forecast-temp">${data.minTemp}&#8451; | ${data.maxTemp}&#8451;</div>
//                    <div class="forecast-temp">${data.minRh}-${data.maxRh}%</div>
//                </div>
//         `;
//             });
//             forecastContainer.innerHTML = forecastElements;
//         });
// }

// fetchForecastData();
// playHLSStream('https://rthktv32-live.akamaized.net/hls/live/2036819/RTHKTV32/master.m3u8', '768px');
// // setInterval(function () {
// //     fetchForecastData();
// // }, 300000);

function getMonthShortForm(month) {
    switch (month) {
        case 0:
            return 'Jan';
        case 1:
            return 'Feb';
        case 2:
            return 'Mar';
        case 3:
            return 'Apr';
        case 4:
            return 'May';
        case 5:
            return 'Jun';
        case 6:
            return 'Jul';
        case 7:
            return 'Aug';
        case 8:
            return 'Sep';
        case 9:
            return 'Oct';
        case 10:
            return 'Nov';
        case 11:
            return 'Dec';
    }
}

function updateDateTimeText() {
    const dateText = document.getElementById('date-text');
    const timeText = document.getElementById('time-text');
    const date = new Date();
    dateText.innerHTML = `${date.getDate()} ${getMonthShortForm(date.getMonth())}, ${date.getFullYear()}`;
    timeText.innerHTML = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function updateTimeslotStatus() {
    const timeslots = document.getElementsByClassName('timeslot');
    for (const timeslot of timeslots) {
        const random = Math.floor(Math.random() * 3);
        timeslot.classList.remove('occupied');
        timeslot.classList.remove('closed');
        timeslot.innerHTML = '';
        switch (random) {
            case 0:
                break;
            case 1:
                timeslot.innerHTML = 'Occupied';
                timeslot.classList.add('occupied');
                break;
            case 2:
                timeslot.classList.add('closed');
                break;
        }
    }
}

updateDateTimeText();
updateTimeslotStatus();
setInterval(updateDateTimeText, 1000);
setInterval(updateTimeslotStatus, 10000);
