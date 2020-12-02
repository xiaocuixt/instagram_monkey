// ==UserScript==
// @name         inns
// @namespace    https://www.instagram.com/gelepapa/
// @include      https://www.instagram.com/*
// @version      0.1.0
// @description  获取instagram用户数据
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js
// @resource     SEMANTIC_CSS https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css
// @author       cui
// @match        https://expertise.jetruby.com/how-to-extract-and-process-data-from-social-media-integration-with-ruby-on-rails-part-1-8e5aa8cefcd0
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==
// 需求
// 1. 粉丝量（k 为单位），如果不是以 k 为单位的（1 万粉以下），换算成 k，小数点后一位
// 2. 最近 10 个 post 的平均点赞数（如果是图文，就取点赞数，如果是视频，就取观看数），最高点赞数，最低点赞数，平均评论数，最高评论数，最低评论数。如果不到 10 个 post 就按实际数字计算平均。

// 使用说明，在instagram网站userSlugs配置之外的任意页面运行该脚本。
(function() {
    'use strict';
    const userSlugs = ["reducewastenow", "dashofting", "barackobama", "autocompany.tv", "barrycohenhomes"]
    const excludeHours = 48;//排除48小时内的posts，可自行修改
    var waitTime = userSlugs.length * 3000// 等待时间每个按照页面3s计算

    function prepareIframes(){
        // 清理缓存
        window.localStorage.removeItem("userData")
        var userData = [];
        for(let i = 0; i < userSlugs.length; i++){
            let slug = userSlugs[i];

            let iframe = document.createElement('iframe');
            iframe.id = `iframe_${slug}`;
            iframe.width = "300";
            iframe.height = "300";
            iframe.src = `https://www.instagram.com/${slug}/`
            document.body.append(iframe);
        }
      return false;
    }

    // 排除48小时内的posts
    function filterPosts(posts) {
      let total = 0;
      let resultPosts = [];
      for(let i =0; i < posts.length; i++) {
          let post = posts[i];
          let fourty_eight_hours_ago = Math.round(new Date().getTime() / 1000) - (excludeHours * 3600);
          if(posts[i].node.taken_at_timestamp <= fourty_eight_hours_ago && total <= 10){
            console.log(`posts by ddddddddddddd: ${posts[i].node.shortcode}`);
            resultPosts.push(posts[i])
            total += 1
          }
      }
      return resultPosts
    }

    function exportMainData(){
      var userData = [];
      for(let i = 0; i < userSlugs.length; i++){
          let slug = userSlugs[i];
          let showList = [];
          let commentCountList = [];
          let likeOrViewCountList = [];
          let commentCount = 0;
          let videoViewCount = 0;
          let picViewCount = 0;
          let likeCount = 0;
          let username = slug;
          let iframe = document.getElementById(`iframe_${slug}`);
          console.log(`iframe_${slug}`)
          console.log(iframe.parent)


          iframe.onload = function() {
              console.log("secon xxxxxxxxxxx name: ", username)
              let followers = iframe.contentWindow._sharedData.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count;
              //console.log(`user name is: ${username}, has followers: ${followers}`)
              //var posts = window._sharedData.entry_data.ProfilePage[0].graphql.user.edge_felix_video_timeline.edges.slice(0, 9)
              let posts = iframe.contentWindow._sharedData.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;
              posts = filterPosts(posts);

              if(posts.length > 0) {
                  for(let i=0; i<posts.length; i++){
                      let _post = posts[i].node;

                      commentCount =_post.edge_media_to_comment.count;// 评论量
                      likeCount = _post.edge_media_preview_like.count;// 赞量
                      videoViewCount = _post.video_view_count;// 视频播放量
                      if(_post.is_video){
                          likeOrViewCountList.push(videoViewCount)
                          commentCountList.push(commentCount)
                          // debug
                          showList.push(`shortcode is: ${_post.shortcode}, commentCount is: ${commentCount}, videoViewCount is: ${videoViewCount}`);
                      } else {
                          likeOrViewCountList.push(likeCount)
                          commentCountList.push(commentCount)
                          // debug
                          showList.push(`shortcode is: ${_post.shortcode}, likeCount is: ${likeCount}, commentCount is: ${commentCount}`);
                      }
                  }

                  var storageUserData = JSON.parse(window.localStorage.getItem("userData")) || []
                  userData = storageUserData
                  console.log("secon  yyyyyy name: ", username)
                  console.log(!checkNameExits(userData, username))
                  if(!checkNameExits(userData, username)) {
                      userData.push([
                          username,
                          convertNumber(followers),
                          avg(likeOrViewCountList),
                          max(likeOrViewCountList),
                          min(likeOrViewCountList),
                          avg(commentCountList),
                          max(commentCountList),
                          min(commentCountList)
                      ])
                  }
              }
              //console.log(`粉丝量: ${convertNumber(followers)}k, 最近 10 个 post 的平均点赞数: ${avg(likeOrViewCountList)}, 最大点赞数: ${max(likeOrViewCountList)}, 最小点赞数: ${min(likeOrViewCountList)}. 平均评论数: ${avg(commentCountList)}，最高评论数: ${max(commentCountList)}，最低评论数: ${min(commentCountList)}`)

              //userData.push(window.localStorage.getItem("userData"))
              //console.log(userData)
              window.localStorage.setItem("userData", JSON.stringify(userData))
          };
          iframe.remove();
      }
      prepareDownloadCsv();
    }

    prepareIframes();
    setTimeout(exportMainData, waitTime)
 
    // 打开500次，放到localstorage里面
    // 转化为单位"千"

   function prepareDownloadCsv() {
       //console.log(data)
       var csv = '昵称,粉丝数(k),平均点赞数,最大点赞数,最小点赞数,平均评论数,最高评论数,最低评论数\n';
       var data = JSON.parse(window.localStorage.getItem("userData"))
       if(!data){ return false; }
       data.forEach(function(row) {
           csv += row.join(',');
           csv += "\n";
       });
       console.log(csv)

       //console.log(csv);
       var hiddenElement = document.createElement('a');
       hiddenElement.style.color = 'red';
       hiddenElement.style.position = 'fixed';
       hiddenElement.style.top = '90px';
       hiddenElement.style.right = '20px';
       hiddenElement.style.zIndex = '99999';
       hiddenElement.style.size = '30px';
       hiddenElement.style.width = '100px';
       hiddenElement.style.height = '40px';
       hiddenElement.style.lineHeight = '40px';
       hiddenElement.style.textAlign = 'center';
       hiddenElement.style.color = '#ffffff';
       hiddenElement.style.display = 'block';
       hiddenElement.style.background = 'orange';
       hiddenElement.innerHTML = '点击下载';
       hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
       hiddenElement.target = '_blank';
       hiddenElement.download = 'my-data.csv';
       document.body.appendChild(hiddenElement)
       //hiddenElement.click();
   }

   function checkNameExits(nexted_array, item) {
       var arr = nexted_array || [];
       if(arr.length <= 0){
         return false;
       }

       for(let i=0; i < arr.length; i++){
          if(arr[i].includes(item)){
            return true
          }
       }

       return false
   }
   function convertNumber(number) {
     return (number / 1000).toFixed(1)
   }
   function avg(array) {
       let sum = array.reduce((a, b) => a + b, 0);
       let avg = (sum / array.length) || 0;
       return avg
   }

   function min(array) {
      return Math.min.apply(Math, array);
   }

   function max(array) {
      return Math.max.apply(Math, array);
   }
})();
