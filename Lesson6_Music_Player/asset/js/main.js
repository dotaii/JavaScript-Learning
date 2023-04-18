

/*
    1. Render song
    2. Scroll top
    3. Play/ pause/ seek
    4. Cd Rotate
    5. Next/ Previous
    6. Randomize
    7. Next/Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when clicked
*/

    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)
    const cd = $('.cd');
    const heading = $('header h2');
    const cdThumb = $('.cd-thumb')
    const audio = $('#audio')
    const playBtn = $('.btn-toggle-play')
    const player = $('.player')
    const progress = $('.progress')
    const nextBtn = $('.btn-next')
    const prevBtn = $('.btn-prev')
    const randomBtn = $('.btn-random')
    const repeatBtn = $('.btn-repeat')
    const playlist = $('.play-list')
    const dasboard = $('.dasboard')


    const app = {
        songs: [
            {
                name: 'Flower',
                singer: 'JISOO',
                path: '/asset/musics/Flower-JISOO-8949069.mp3',
                image: '/asset/images/JISOO.jpg'
            },
            {
                name: 'La Anh',
                singer: 'Pham Lich',
                path: '/asset/musics/LaAnh-PhamLichBMZ-8811329.mp3',
                image: '/asset/images/PhamLich.jpg'
            },
            {
                name: 'Ngoai 30',
                singer: 'Thai Hoc',
                path: '/asset/musics/Ngoai30-ThaiHoc-8781059.mp3',
                image: '/asset/images/ThaiHoc.jpg'
            },
            
            {
                name: 'ThichHayLaYeuConChuaBiet',
                singer: 'CongThanhRemix',
                path: '/asset/musics/ThichHayLaYeuConChuaBiet.mp3',
                image: '/asset/images/CongThanhRemmix.jpg'
            },
            {
                name: 'YeuAnhDiMeAnhBanBanhMi',
                singer: 'Phuc Du',
                path: '/asset/musics/YeuAnhDiMeAnhBanBanhMi.mp3',
                image: '/asset/images/PhucDu.jpg'
            },

        ],
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        render: function() {
            var htmls = this.songs.map((song, index)=>{
                return`
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="thumb" style="background-image: url(${song.image})"></div>
                    <div class="body">
                        <h3 class="tiltle">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    </div>
                `})
            playlist.innerHTML = htmls.join('');
        },
        handleEvents: function() {
            const _this = this;
            const cdWidth = cd.offsetWidth;
            //Xu ly cd quay/ dung
            const cdThumbAnimate = cdThumb.animate([
                {transform: 'rotate(360deg)'}
            ],{
                duration: 10000,
                iterations: Infinity,
            });
            cdThumbAnimate.pause();


            //Xu ly phong to/ thu nho CD
            document.onscroll = function(){
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const newCdWidth = cdWidth - Math.round(scrollTop);

                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                cd.style.opacity = newCdWidth/cdWidth;

            }

            //Xu ly khi click play
            playBtn.onclick = function(){
                if(_this.isPlaying){
                    audio.pause();
                }else{
                    audio.play();
                }
                
            }
            audio.onplay = function(){
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }
            audio.onpause = function(){
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }
            
            //Khi tien do bai hat thay doi
            audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPercent = Math.floor((audio.currentTime*100/audio.duration))
                    progress.value = progressPercent;
                    progress.style.background = `linear-gradient(to right,#ec1f55 ${progress.value}%, #d3d3d3 ${progress.value}%)`;
                }
                
            }
            //Tua nhac
            progress.onchange = function(e){
                const seekTime = e.target.value/100*audio.duration;
                audio.currentTime = seekTime;
                
            }
            progress.onmousedown = function(){
                audio.pause();
            }
            progress.onmouseup = function(){
                audio.play();
            }
            //Next song
            nextBtn.onclick = function(){
                if(_this.isRandom){
                    _this.randomSong();
                }else{
                    _this.nextSong();
                }
                audio.play();
                _this.render();
                _this.scrollActiveSong();
            }
            //Previous song
            prevBtn.onclick = function(){

                if(_this.isRandom){
                    _this.randomSong();
                }else{
                    _this.prevSong();
                }
                audio.play();
                _this.render();
                _this.scrollActiveSong();
            }
            //End song
            audio.onended = function(){
                if(_this.isRepeat){
                    audio.play();
                }else{
                    nextBtn.click();           
                }
            }
            //Random button
            randomBtn.onclick = function(){
                _this.isRandom = !_this.isRandom;
                randomBtn.classList.toggle('active');
            }
            //Repeat button
            repeatBtn.onclick = function(){
                _this.isRepeat = !_this.isRepeat;
                repeatBtn.classList.toggle('active')
            }
            playlist.onclick = function(e){
                const songNode = e.target.closest('.song:not(.active)');
                const option = e.target.closest('.option')
                if(songNode || option){
                    if(option){
                        //Xu ly khi click vao option ...
                    }
                    else if(songNode){
                        _this.currentIndex = Number(songNode.dataset.index);
                        _this.loadCurrentSong();
                        _this.render();
                        audio.play();
                    }
                }
                
            }

        },
        scrollActiveSong: function(){
            setTimeout(()=>{
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'nearest'
                });
            },300)
        },
        defineProperties: function(){
            Object.defineProperty(this,'currentSong', {
                get:function(){
                    return this.songs[this.currentIndex];
                }
            })
        },
        loadCurrentSong: function(){
            heading.innerText = this.currentSong.name;
            cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
            audio.src = this.currentSong.path;
        },
        nextSong: function(){
            this.currentIndex++;
            if(this.currentIndex > this.songs.length-1){
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
        },
        prevSong: function(){
            this.currentIndex--;
            if(this.currentIndex < 0){
                this.currentIndex = this.songs.length-1;
            }
            this.loadCurrentSong();
        },
        randomSong: function(){
            let newIndex = 0;
            do{
                newIndex = Math.floor(Math.random() * this.songs.length)
            }while(newIndex === this.currentIndex)
                
            this.currentIndex = newIndex;
            this.loadCurrentSong();
        },

        start: function (){
            this.defineProperties();
            this.handleEvents();
            this.loadCurrentSong();
            
            this.render();
        }
    }

        app.start();