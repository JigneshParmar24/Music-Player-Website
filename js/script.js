let currentSong = new Audio;
let songs;
let currFolder;

console.log("Running script");

// this will get songs from the songs directory using 
async function getSongs(folder) {
    currFolder = folder;

    // using fetch to get all the info from "http://127.0.0.1:5500/songs/"
    let a = await fetch(`http://127.0.0.1:5500/${folder}`);
    // then storing text of a in response
    let response = await a.text();

    // creating a empty div
    let div = document.createElement("div");
    // which will store all the text from response
    div.innerHTML = response;
    // then storing all the elements with tag a is as
    let as = div.getElementsByTagName("a");
    songs = [];

    // using a for loop to store the href which ends with .mp3 in songs array
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    // Show all the songs in 'Your Lirbrary' section
    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const element of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li class = "tracklist">
                                <img src="svg/music.svg">
                                <div class = "track" >${element.replaceAll("%20", ' ')}</div>
                                <button class = "playsvg"><img src="svg/play.svg" alt="play" ></button>
                                </li>`;
    }


    // Attach a event listener to each song
    Array.from(document.querySelector(".songul").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".track").innerHTML);
            playMusic(e.querySelector(".track").innerHTML);
        })
    })
}

// A function that will play our music
function playMusic(track, pause = false) {
    currentSong.src = `/${currFolder}/` + track;
    currentSong.play();
    playimg.src = "svg/pause.svg";
    document.querySelector(".songsinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = `00:00 / 00:00`;
}


// converting seconds to minutes function written by ai 
function convertSeconds(seconds) {
    // Round off the seconds to the nearest integer
    const totalSeconds = Math.round(seconds);

    // Calculate minutes
    const minutes = Math.floor(totalSeconds / 60);

    // Calculate remaining seconds
    const remainingSeconds = totalSeconds % 60;

    // Pad minutes and seconds with leading zero if needed
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time as mm:ss
    return `${paddedMinutes}:${paddedSeconds}`;
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    let al = Array.from(anchors);
    for (let index = 0; index < al.length; index++) {
        const element = al[index];

        if (element.href.includes("/songs")) {
            let folder = element.href.split("/").slice(-2)[1];

            if (folder == "songs") {
                continue;
            }
            // Getting Meta data of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json();

            cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card" data-folder="${folder}">
                        <img src="/songs/${folder}/cover.jpg" alt="cover image">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>

                        <div class="playButCon">
                            <button class="playBut">
                              <svg style="width: 32px; height: 32px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-6.4-3.692a1 1 0 00-1.5.866v7.384a1 1 0 001.5.866l6.4-3.692a1 1 0 000-1.732z"></path>
                              </svg>
                            </button>
                        </div>
                    </div>`
        }

        // adding event listener to chose albums
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            })
        })
    }
}

async function main() {
    // Getting list 
    await getSongs("songs/Nier-Replicant-OST");

    await displayAlbums();

    // Attach a event listener to play, next, previous 
    // document.getElementById("play") === play
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playimg.src = "svg/pause.svg";
        }
        else {
            currentSong.pause();
            playimg.src = "svg/play.svg";
        }
    })

    // time update even
    currentSong.addEventListener("timeupdate", () => {
        console.log(convertSeconds(currentSong.currentTime), currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${convertSeconds(currentSong.currentTime)} / ${convertSeconds(currentSong.duration)}`;
        percentage = (currentSong.currentTime / currentSong.duration) * 100
        document.querySelector(".circle").style.left = percentage + "%";
    })


    // add an event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    // adding event listener to hub button 
    document.querySelector(".humburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })

    // adding event listener to close button 
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    })

    // adding event listener to next button
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        console.log(index);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1].replaceAll("%20", " "));
        }
    })

    // adding event listener to previous button
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        console.log(index);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1].replaceAll("%20", " "));
        }
    })

    // adding event listener for volume slider
    document.querySelector(".range").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        document.querySelector(".volume>img").src = "svg/volume.svg";
    })

    // adding mute feature 
    document.querySelector(".volume>img").addEventListener("click", (e) => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .5;
            document.querySelector(".range").value = 50;
        }
    })

}

main();

