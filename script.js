const title = document.querySelector("header h2");
const thumb = document.querySelector(".cd-thumb");
const audio = document.querySelector("#audio");
const cd = document.querySelector(".cd");
const playBtn = document.querySelector(".btn-toggle-play");
const player = document.querySelector(".player");
const progress = document.querySelector(".progress");
const nextBtn = document.querySelector(".btn-next");
const prevBtn = document.querySelector(".btn-prev");
const randBtn = document.querySelector(".btn-random");
const repeatBtn = document.querySelector(".btn-repeat");
const playlist = document.querySelector(".playlist");
const LOCAL_STORAGE_KEY="SEMICOF_PLAYER"
const cdAnimate = cd.animate(
  [
    {
      transform: "rotate(360deg)",
    },
  ],
  {
    duration: 10000,
    iterations: Infinity,
  }
);

const app = {
  //all songs
  songs: [
    {
      name: "Cô ta",
      singer: "Vũ",
      musicPath: "/MusicPlayer/assets/music/ct.mp3",
      imgPath: "/MusicPlayer/assets/img/mainImg.jpg",
      played: true,
    },
    {
      name: "Ánh sao và bầu trời",
      singer: "Trim",
      musicPath: "/MusicPlayer/assets/music/asvbt.mp3",
      imgPath: "/MusicPlayer/assets/img/mainImg.jpg",
      played: false,
    },
    {
      name: "Có chàng trai viết lên cây",
      singer: "Phan Mạnh Quỳnh",
      musicPath: "/MusicPlayer/assets/music/cctvlc.mp3",
      imgPath: "/MusicPlayer/assets/img/mainImg.jpg",
      played: false,
    },
    {
      name: "Bước qua mùa cô đơn",
      singer: "Vũ",
      musicPath: "/MusicPlayer/assets/music/bqmcd.mp3",
      imgPath: "/MusicPlayer/assets/img/mainImg.jpg",
      played: false,
    },
    {
      name: "Ngây thơ",
      singer: "Tăng Duy Tân",
      musicPath: "/MusicPlayer/assets/music/nt.mp3",
      imgPath: "/MusicPlayer/assets/img/mainImg.jpg",
      played: false,
    },
    {
      name: "Tình đầu",
      singer: "Tăng Duy Tân",
      musicPath: "/MusicPlayer/assets/music/td.mp3",
      imgPath: "/MusicPlayer/assets/img/mainImg.jpg",
      played: false,
    },
    {
      name: "Nhạt",
      singer: "Phan Mạnh Quỳnh",
      musicPath: "/MusicPlayer/assets/music/n.mp3",
      imgPath: "/MusicPlayer/assets/img/mainImg.jpg",
      played: false,
    },
  ],
  configs:JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))||{}
  ,
  currentIndex: 0,
  isRandom: false,
  isRepeated: false,
  setConfig: function(key,val){
    this.configs[key]=val;
    localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(this.configs));
  }
  ,
  //Render default music info & img
  render: function () {
    const html = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index == this.currentIndex ? "active" : ""
            }"  data-index="${index}">
            <div class="thumb" style="background-image: url('${song.imgPath}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `;
    });
    playlist.innerHTML = html.join("");
  },

  //Event Handler
  handleEvent: function () {
    const cdWidth = cd.offsetWidth;

    // handle scroll event
    document.onscroll = function () {
      const scrollY = window.scrollY;
      const newCdWidth = cdWidth - scrollY;
      cd.style.width = newCdWidth > 85 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // handle play event
    playBtn.addEventListener("click", () => {
      if (player.classList.contains("playing")) {
        audio.pause();
        cdAnimate.pause();
        player.classList.remove("playing");
      } else {
        audio.play();
        cdAnimate.play();
        player.classList.add("playing");
      }
    });

    // update current song progress value
    audio.ontimeupdate = () => {
      if (audio.duration) {
        const percent = Math.floor((audio.currentTime / audio.duration) * 100);
        progress.value = percent;
      }
    };

    // set current song progress value
    progress.onchange = (e) => {
      const seekTime = (audio.duration * e.target.value) / 100;
      audio.currentTime = seekTime;
    };

    cdAnimate.pause();

    nextBtn.addEventListener("click", () => {
      if (this.isRandom) {
        this.playRandomSong();
      } else {
        if (this.currentIndex < this.songs.length - 1) {
          this.currentIndex++;
          progress.value = 0;
          this.loadCurrentSong();
        } else {
          this.currentIndex = 0;
          progress.value = 0;
          this.loadCurrentSong();
        }
      }
      if (player.classList.contains("playing")) {
        audio.play();
      }
      this.render();
      this.scrollToActiveSong();
    });

    prevBtn.addEventListener("click", () => {
      if (this.isRandom) {
        this.playRandomSong();
      } else {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          progress.value = 0;
          this.loadCurrentSong();
        } else {
          this.currentIndex = this.songs.length - 1;
          progress.value = 0;
          this.loadCurrentSong();
        }
      }
      if (player.classList.contains("playing")) {
        audio.play();
      }
      this.render();
      this.scrollToActiveSong();
    });

    // random play function
    randBtn.addEventListener("click", () => {
      this.isRandom = !this.isRandom;
      randBtn.classList.toggle("active", this.isRandom);
      this.setConfig("isRandom",this.isRandom);
    });

    repeatBtn.addEventListener("click", () => {
      this.isRepeated = !this.isRepeated;
      repeatBtn.classList.toggle("active", this.isRepeated);
      this.setConfig("isRepeated",this.isRepeated);
    });

    // handle audio when song ended
    audio.onended = () => {
      if (this.isRepeated) {
        progress.value = 0;
        audio.play();
      } else {
        this.currentIndex++;
        this.loadCurrentSong();
        progress.value = 0;
        audio.play();
        cdAnimate.play();
      }
    };

    playlist.addEventListener("click", (e) => {
      const songNode = e.target.closest(".song:not(.active");
      if (songNode || e.target.closest(".option")) {
        if (e.target.closest(".option")) {
        }
        if (songNode) {
          this.currentIndex = songNode.getAttribute("data-index");
          console.log(songNode.getAttribute("data-index"));
          this.loadCurrentSong();
          this.render();
          player.classList.add("playing");
          audio.play();
        }
      }
    });
  },
  loadConfig:function(){
    this.isRandom=this.configs.isRandom;
    this.isRepeated=this.configs.isRepeated;
    randBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeated);
  }
  ,

  currentSong: function () {
    return this.songs[this.currentIndex];
  },

  loadCurrentSong: function () {
    title.textContent = this.currentSong().name;
    thumb.style.backgroundImage = `url('${this.currentSong().imgPath}')`;
    audio.src = this.currentSong().musicPath;
  },

  playRandomSong: function () {
    let num = 0;
    while (this.songs[num].played == true) {
      num = Math.floor(Math.random() * this.songs.length);
    }
    this.currentIndex = num;
    this.songs[num].played = true;
    this.loadCurrentSong();
  },

  scrollToActiveSong: () => {
    setTimeout(() => {
      if (this.currentIndex < 4) {
        document.querySelector(".song.active").scrollIntoView({
          behavior: "smooth",
        });
      } else {
        document.querySelector(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100);
  },
  start: function () {
    this.loadConfig();
    this.handleEvent();
    this.loadCurrentSong();
    this.render();
  },
};

//test code
console.log(app.configs);
// start application
app.start();
