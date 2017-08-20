$(document).ready(function() {
    console.log(window.location.href);
      var videos=[];
      $.ajax( {
                url: "getVideos",
                type: "get",
                dataType: "json",
                success: function(data){
                for(index in data) {
                  videos.push({
                  name: data[index].name,
                  date: data[index].date,
                  likes: data[index].likes,
                  dislikes: data[index].dislikes,
                  views: data[index].views,
                })
                }

                for(i=0;i<videos.length;i++){
                  $("#main").append('<div class="videopan"><div class="images-rotation" data-images=\'["/thumbnails/'+videos[i].name+'/'+videos[i].name+'_1.png", "/thumbnails/'+videos[i].name+'/'+videos[i].name+'_2.png", "/thumbnails/'+videos[i].name+'/'+videos[i].name+'_3.png", "/thumbnails/'+videos[i].name+'/'+videos[i].name+'_4.png","/thumbnails/'+videos[i].name+'/'+videos[i].name+'_5.png"]\'><img class="videoimg" src="/thumbnails/'+videos[i].name+"/"+videos[i].name+'_1.png" alt=""></div><div class="videoname">'+videos[i].name+'</div></div>');
                  $('.images-rotation').imagesRotation();
                }
                }
        });
   if(window.location.href.localeCompare("http://localhost:8080/watch.html")==0){
    $('#videoplayer').attr("src","/videos/"+localStorage.getItem("name")+".mp4");
    $('.videocap').text(localStorage.getItem("name"));
    $('.videoview').text(valo("4651323546")+/*+localStorage.getItem("views")+*/" views");
    $('.likes').text("Likes: "+valo("5412")+/*+localStorage.getItem("likes")+*/"    ");
    $('.dislikes').text("Dislikes: "+valo("142")/*+localStorage.getItem("dislikes")*/);
  }
  $(document).on( "click",'.videopan', function() {
      var name=String(jQuery(this).find(".videoname").text());
      var index=0;
      for(i=0;i<videos.length;i++){
        if(videos[i].name.localeCompare(name)==0){
          index=i;
        }
      }
      $.ajax( {
                url: "/view",
                type: "post",
                dataType: "json",
                data: JSON.stringify({
                  ind: index
                }),
                contentType: "application/json",
                success: function(data) {
                      console.log('success');
                      console.log(data);
                  }
        });
      localStorage.setItem("name",videos[index].name);
      localStorage.setItem("likes",videos[index].likes);
      localStorage.setItem("dislikes",videos[index].dislikes);
      localStorage.setItem("views",videos[index].views);

      window.location.href="watch.html";
    });

  });
  function valo(s) {
      var test=String(s).substring(String(s).length-3);
      s=Math.floor(s/1000);
      while(s!=0){
        test=String(s).substring(String(s).length-3)+","+test;
  	  console.log(test);
        s=Math.floor(s/1000);
      }
      return test;
  }
