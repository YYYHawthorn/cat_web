
    //*************************** Youtube Initial *****************************//
      // 2. This code loads the IFrame Player API code asynchronously.


      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      //randomize playlist
      var randomnumber = Math.floor(Math.random() * 11) ;

      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player'
          , {
            // height: '300px',
            // width: '400px',
            playerVars:{listType: 'playlist',
            list:'PLW1bZqF7FVSN31ILibwTRdYinMq4mx8Vp',
            controls:1,
            autoplay:1,
            loop:1,
            index:randomnumber,
            showinfo:1,
            rel: 0,
            modestbranding:1, 
                    // suggestedQuality:'hd720'
                  },
                  events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                  }
                });        
      }


      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
        saveVideoInfo();

        var playNextBtn = document.getElementById('playNext'); 
        playNextBtn.onclick= function(){
         player.nextVideo();
       }
     }

      // 5. The API calls this function when the player's state changes.
      function onPlayerStateChange(event) {
        //when a video ends(state=0), redirect to next page. Otherwise play next automatically
        if (event.data == YT.PlayerState.ENDED) {
          // redirect to C3
          // window.location = "c3.html";
        }

        //save video info before it starts
        else if ( event.data == YT.PlayerState.UNSTARTED){
          saveVideoInfo();        
        }
      }
      
      function stopVideo() {
        player.stopVideo();
      }
      
    //*********************** IMPORTANT part to get video info **********************
      var videoInfo = [];
      var videoId;
      function saveVideoInfo() {
        var videoUrl = player.getVideoUrl();
        videoId = getParameterByKey(videoUrl, 'v');
        // console.log('video id: '+videoId);

        addVideoData(videoId);
      }


      // parse the url to get the id of a video
      function getParameterByKey(url, name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec('?'+url.split('?')[1]);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
      }

      //get the title and view number of this video using Google API, and add them to the variable videoInfo
      function addVideoData(urlId){

        var key = 'AIzaSyDPUqAa8ZkqTuiYshHqI5L9BjX1WVOuQvk';
        var url = 'https://www.googleapis.com/youtube/v3/videos?id='+urlId+'&key='+key+'&fields=items(id,snippet(channelId,title,categoryId),statistics)&part=snippet,statistics';

        reqwest({
         url: url
         , type: 'json'
         , crossOrigin: true
         , success: function(data){
          var title = data.items[0].snippet.title;
          var view = data.items[0].statistics.viewCount;
          videoInfo.push({title:title, view:view});
          // console.log(videoInfo);
              //save  the data, so you can get it later in c3.html
              localStorage.setItem("videoInfo", JSON.stringify(videoInfo));

              // console.log(videoInfo);
              loadVideoInfo();

            }
          })
      }

    //*************************** OUTPUT of video info ***************************
      var bigcat={ 

        XfIl1EibKaM: ['1', 'Tiger','<3,000','tiger','Endangered'],
        EDg_yHKrRcA: ['2', 'African Lion ','<32,000','lion','Vulnerable'],
        qqH6V4cfUaY: ['3', 'Cheetah','9,000~12,000','cheetah','Vulnerable'],
        EjxvrHDaxKc: ['4', 'Snow Leopard','4,080~6,590','sleopard','Endangered'],
        ot8q0OUnUwI: ['5', 'Clouded Leopard','<10,000','cleopard','Vulnerable'],
        ZiLyDbjEkgw: ['6', 'Sunda Clouded Ledopard','<10,000','scleopard','Vulnerable'],
        rv436cpA8vE: ['7', 'Iberian Lynx','84~143','lynx','Critically Endangered'],
        IjoycRq3r0c: ['8', 'Fishing Cat','<10,000','fishingcat','Endangered'],
        H4Tt796djv4: ['9', 'Flat-headed Cat','<2,500','flatheadcat','Endangered']
      }

      var score=[];
      
      function loadVideoInfo(){

        var info = videoInfo[videoInfo.length-1];

          if (videoId in bigcat) {
            
            var card = bigcat[videoId];
            // console.log(bigcat[videoId]);
            
            var imgNum = card[0];
            var catName = card[1];
            var population = card[2];
            var catId = card[3];
            var rating = card[4];
            // console.log(imgNum);

            //information stream
            $('#count').prepend('<p class="notice"><b>' + catName +'</b> you are watching has</br> <span class="bigCatBold"> only '+population+' left</span></p></br>');
            $('#count').prepend('<p class="notice">***  Found Rare Cat Species!!!  ***</p>');

            // document.getElementById("panelAbove").style.borderColor="blue";
      		 
      		$( document ).ready(function() {
			  $( "#panelAbove" ).effect( "shake");
			});
      		
            
            //card
            document.getElementById(catId).style.display = "block";
            //counter, avoid repeating
            if (jQuery.inArray(videoId, score) == -1 && score.length <=9 ) {
              score.push(videoId); 
              document.getElementById("scoreNum").innerHTML = "("+ score.length + "/9)";       
            }
            else{};

          }
          else {

          	document.getElementById("panelAbove").style.borderColor="rgb(227, 231, 217)";

            var views = Number(info.view).toLocaleString()
            // console.log(views);
            $('#count').prepend($('<p>'+'<b class="viewCount">'+views+'  views</b>'+'</p>'+ '</br>').fadeIn('slow'));
            $('#count').prepend('<p>"'+info.title+'" you are watching has</p>');
            return info;
          };
      }

    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));




   function involved(){
    window.open("http://animals.nationalgeographic.com/animals/big-cats-initiative/get-involved/");
  }