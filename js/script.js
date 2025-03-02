let currentSong = new Audio;
let songs;

console.log("Running script");

// this will get songs from the songs directory using 
async function getSongs() 
{
    // using fetch to get all the info from "http://127.0.0.1:5500/songs/"
    let a = await fetch("http://127.0.0.1:5500/songs");
    // then storing text of a in response
    let response = await a.text();

    // creating a empty div
    let div = document.createElement("div");
    // which will store all the text from response
    div.innerHTML = response;
    // then storing all the elements with tag a is as
    let as = div.getElementsByTagName("a");
    let songs = [];

    // using a for loop to store the href which ends with .mp3 in songs array
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3"))
        {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs
}

// A function that will play our music
function playMusic(track, pause = false)
{
    currentSong.src = "/songs/" + track;
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

async function main(){
    // Getting list 
    songs = await getSongs();
    console.log(songs);

    // Show all the songs in 'Your Lirbrary' section
    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]
    for (const element of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li class = "tracklist">
                            <img src="svg/music.svg">
                            <div class = "track" >${element.replaceAll("%20", ' ')}</div>
                            <button class = "playsvg"><img src="svg/play.svg" alt="play" ></button>
                            </li>`;
    }


    // Attach a event listener to each song
    Array.from(document.querySelector(".songul").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element =>{
            console.log(e.querySelector(".track").innerHTML);
            playMusic(e.querySelector(".track").innerHTML);
        })
    }) 

    // Attach a event listener to play, next, previous 
    // document.getElementById("play") === play
    play.addEventListener("click", ()=>{
        if(currentSong.paused)
        {
            currentSong.play();
            playimg.src = "svg/pause.svg";
        }
        else{
            currentSong.pause();
            playimg.src = "svg/play.svg";
        }
    })

    // time update even
    currentSong.addEventListener("timeupdate", ()=>{
    console.log(convertSeconds(currentSong.currentTime), currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${convertSeconds(currentSong.currentTime)} / ${convertSeconds(currentSong.duration)}`;
    percentage = (currentSong.currentTime / currentSong.duration) * 100
    document.querySelector(".circle").style.left = percentage + "%";
    })
    

    // add an event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", (e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    // adding event listener to hub button 
    document.querySelector(".humburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = 0;
    })

    // adding event listener to close button 
    document.querySelector(".cross").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-110%";
    })

    // adding event listener to next button
    next.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
        
        console.log(index);
        if((index+1) < songs.length)
        {
            playMusic(songs[index+1].replaceAll("%20", " "));
        }        
    })

    // adding event listener to previous button
    previous.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
        
        console.log(index);
        if((index-1) >= 0)
        {
            playMusic(songs[index-1].replaceAll("%20", " "));
        }        
    })

    document.querySelector(".range").addEventListener("change", (e)=>{
        currentSong.volume = parseInt(e.target.value)/100;
    })
}

main();

