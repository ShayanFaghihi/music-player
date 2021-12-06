const musicCover = document.getElementById('musicCover');
const musicTitle = document.querySelector(".music-title");
const singer = document.querySelector(".singer");
const playBtn = document.querySelector(".play");
const pauseBtn = document.querySelector(".pause");
const forwardBtn = document.querySelector(".forward");
const backwardBtn = document.querySelector(".backward");
const musicAudio = document.getElementById("musicAudio");
const timeline = document.getElementById('timeLine');
const currentTag = document.querySelector('.timeline-before');
const durationTag = document.querySelector('.timeline-after');

let index = 0;
let data;


// Retrieving Music Data From The Json File in the Directory
async function getMusicTracks() {
    const reuqest = await fetch('musics.json');
    data = await reuqest.json();
    showTrack(data);
}

// Show cover, title, singer, and music Duration / Load Music Src based on the current index
function showTrack(data) {
    let i = 0;
    if(index < (data.tracks.length) && index >= 0) {
       i = index;
    } else if (index >= (data.tracks.length)) {
        index = 0;
        i == 0;
    } else {
        index = data.tracks.length - 1;
        i = index;
    }

    musicCover.setAttribute('src',data.tracks[i].cover);
    musicTitle.textContent = data.tracks[i].title;
    singer.textContent = data.tracks[i].singer;
    musicAudio.setAttribute('src',data.tracks[i].music);
    // After 100ms loads the music duration / in minute and 2-decimal second
    setTimeout(()=> {
        durationTag.textContent = ((musicAudio.duration)/60).toFixed(2);
    }, 100)
}

// Loads music data as soon as the page loads
getMusicTracks();



// Play Event Handler
playBtn.addEventListener('click',playMusic)

// Pause Event Handler
pauseBtn.addEventListener('click', pauseMusic)


// Play Music Event
function playMusic() {
    playBtn.hidden = true;
    pauseBtn.hidden = false;
    musicAudio.play();
    // Change Time Interval As soon as it is playing
    changeTimeline();
}


// Pause Music Event
function pauseMusic() {
    playBtn.hidden = false;
    pauseBtn.hidden = true;
    musicAudio.pause();
}

// Forward Event handler
forwardBtn.addEventListener('click', () => {
    index += 1;
    showTrack(data);
    playMusic();
})


// Backward Event Handler
backwardBtn.addEventListener('click', () => {
    index -= 1;
    showTrack(data);
    playMusic();
})


// Time Line Scripts
function changeTimeline() {
    const timelineInterval = setInterval( () => {
        const audioDuration = musicAudio.duration;
        const timelineValue = musicAudio.currentTime;
        const valueInPercent = (timelineValue * 100) / audioDuration;
        timeline.setAttribute('value', valueInPercent);
        // Change current track time in minute and 2-decimal second
        currentTag.textContent = (timelineValue/60).toFixed(2);

        // Go to next track when it is completed
        if(timelineValue == audioDuration) {
            index += 1;
            showTrack(data);
            playMusic();
        }
    },1000);
}



// Changing Progress Bar When it is clicked
timeline.addEventListener('click', (e)=> {
    // substracting the Total Window Width and the timeline width, Devided by 2  => The start point of timeline in px
    const timelineStartPoint = (window.innerWidth - timeline.clientWidth) / 2;
    // To check the clicked point we need to substract the start point from the x-coordination
    let clickedPoint = e.pageX - timelineStartPoint;
    clickedPoint = Math.floor((clickedPoint/timeline.clientWidth) * 100)
    // Changing the value attribute of the audio
    timeline.setAttribute('value',clickedPoint);
    // Converting the clicked point to the seconds
    musicAudio.currentTime = (musicAudio.duration * clickedPoint) / 100;
    
})