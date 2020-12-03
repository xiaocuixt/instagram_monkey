// ==UserScript==
// @name         one_iframe
// @namespace    https://www.instagram.com/gelepapa
// @include      https://www.instagram.com/gelepapa/
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

// 使用说明，在instagram网站userNames配置之外的任意页面运行该脚本。
(function() {
    // 清理缓存
    'use strict';
    const globalUserNames = [
        "belajuliana_",
        "madisonjaane",
        "hangrydiary",
        "vivacious.honey",
        "quincyandskylar",
        "millennial.motherhood",
        "thedailyjenny",
        "CelineLinarte",
        "natalia_usa",
        "huangryfoodie",
        "lindyjboymom",
        "wearshetraveled",
        "shushgirlmaria",
        "r.ashleyy",
        "misslizzy",
        "jazgurrolaa",
        "maryuribe_",
        "happilykatrina",
        "lailaluluu",
        "wenwensong",
        "bratz_i.n.c",
        "bobby.alyssa",
        "hannahfit",
        "ellacheng",
        "jasminm_",
        "longlegzk",
        "rocknroamgirl",
        "stefaniabriella",
        "elishizzle",
        "mommylexiloves",
        "gabriela_px",
        "Barbara Leme",
        "behindtheknife",
        "gabrielleirion",
        "natalienguyen_",
        "mackday",
        "nanababbbyy",
        "withlove.sandra",
        "sstephkoutss",
        "septembermondays",
        "andreakyton",
        "yogawithrona",
        "tarsilaogden",
        "kamryn.law",
        "tbhkatelyn",
        "fatinmayassi",
        "jasminekirchhoff",
        "b.nic0le__",
        "adriana.brito_",
        "trucks.plus.tiaras",
        "TheQuietGrove",
        "franklinfamilyof5",
        "lenahikaru",
        "grlinthecurl",
        "missxkoko",
        "edina.fit",
        "karenxolea",
        "ohh.miaa",
        "mamaminishow",
        "farnsworthdaisy",
        "maarisol.xo",
        "haley.lives",
        "theluxchronicles",
        "karishmadawood",
        "missaalis",
        "superpratt",
        "skyepolk",
        "sihle_stylist",
        "vivakolor",
        "officially.val",
        "littlemissradiant",
        "browngirlstyles",
        "feelinhaute",
        "karinabbingham",
        "ketlenborges",
        "iamstherfaned",
        "japaninee",
        "xoxorachelvv",
        "im_not_just_a_mom",
        "ashley.marie.andersen",
        "the.johnston.family",
        "_tomimariecook",
        "mamacopfer",
        "roseandgrace_",
        "life.with.char",
        "stylish_samantha",
        "the_optimisticgirl",
        "the.good.wife.life",
        "snenhlanhla__m",
        "clairesitchyfeet",
        "_lenadee",
        "jenniferwesley",
        "makingit_withmegan",
        "laurynlately",
        "anahysramos",
        "erin22xoxo",
        "viviepperson",
        "malorieyagelski",
        "daniellevaliente_",
        "barbarabraga85",
        "careeohhlinee",
        "marianasofiacanelas",
        "anaamg.xo",
        "girl.mom.of.1",
        "kas_active",
        "lulusbeaute",
        "simplytasheena",
        "asapmarissa",
        "mombossofboys",
        "dashofting",
        "rxc_xoxo",
        "mayraderinger",
        "deboraoehler",
        "_momentswithmeg",
        "lluciana_h",
        "keepingupwithyuli_",
        "hanzastephensblog",
        "cami_beeson",
        "imjustmeghan",
        "larissa.montana",
        "_msnerdychica",
        "summerridings",
        "fashionactivation",
        "angiefiestasc",
        "paolawarren_",
        "sabrina.tewksbury",
        "klepaczbru",
        "rachelkgrim",
        "whatboomerwore",
        "jocyburton1",
        "adenikeoadebayo",
        "murielbonnick",
        "stephovile",
        "thesincerelyasiaa",
        "daniele_luna",
        "emillyspimentel",
        "leehocampo",
        "Paigespick",
        "raysaanjos",
        "thatchicnxtdoor",
        "utah_traveling_mommy",
        "xolovelyjae",
        "andressaberrett",
        "celestesalas",
        "filgueiras.kaca",
        "natabarry",
        "natasha.yk",
        "johanaflo",
        "mimischibi",
        "adriibabbii",
        "georgianadusa",
        "king.johanna",
        "nycelescarrega",
        "dj_curves",
        "pixietalia",
        "thechiquitamack",
        "sheillyncheng",
        "rachelleyadegar",
        "kseniya_dobrev",
        "isaantelmo",
        "alexlovesablog",
        "averyfosterstyle",
        "jukiener",
        "julesalmnt",
        "leahjanemodeling",
        "lincolnsmamaaa",
        "shelbi2b",
        "with_love_dajana",
        "x_alexandra_l",
        "wilmarapierce",
        "efgallo83",
        "lexcee28",
        "saasprenger",
        "walibel",
        "tofutraveler",
        "allydeleon_",
        "barbara.teerlink",
        "brianaaa7",
        "danielabeck13",
        "deechangg",
        "huisjenn",
        "leilas_lookbook",
        "patriizzle",
        "cleane_angel",
        "fenellafit",
        "korimallett",
        "bianca_j "]
     var excludeHours = 48;//排除48小时内的posts，可自行修改
     var waitTime = globalUserNames.length * 5000// 等待时间每个按照页面4s计算
     var cachedUserNames = JSON.parse(window.localStorage.getItem("userNames")) || [];
     var cachedUserData = JSON.parse(window.localStorage.getItem("userData")) || []
    //console.log(`not ifrmae page ${self==top}`)
    //console.log(`is ifrmae page ${parent==top}`)

    // not in iframe提示时间
    if(self==top) {
        //prepareClearStorageButton()
        //$("#clearButton").on('click', function(){
        //    alert("xxxx")
        //    window.localStorage.removeItem("userData");
        //    window.localStorage.removeItem("userNames");
        //    window.location.reload();
        //    return false;
        // })
        // 重新刷新清空storage
        console.log("refreash in common window")
        window.localStorage.removeItem("userData");
        window.localStorage.removeItem("userNames");
        if(waitTime > 60000) {
          alert(`预估时间:${parseInt(waitTime / 60000)}分钟`);
        }else{
          alert(`预估时间:${parseInt(waitTime / 1000)}秒`);
        }
    }

    //alert(`预计执行时间${waitTime / 60000}分钟`);

    // arr1数组减去arr2数组剩余元素
    function restItems(arr1, arr2){
        return arr1.filter(element => !arr2.includes(element))
    }

    var reqTimer;

    function prepareIframes(){
        var usernames = restItems(globalUserNames, cachedUserNames);
        var iframes = [];

        // 跑完后清除定时器
        if(usernames.length ===0){
          window.clearInterval(reqTimer);
          alert("执行完毕");
          prepareDownloadCsv();
          return false;
        }

        // 取余下一个
        let username = usernames.sort()[0];
        let commentCountList = [];
        let likeOrViewCountList = [];
        let commentCount = 0;
        let videoViewCount = 0;
        let picViewCount = 0;
        let likeCount = 0;

        let userData = cachedUserData;
        let userNames = cachedUserNames;

        //console.log(usernames)
        //console.log(username)

        let iframe = document.getElementById(`iframe_${username}`) || document.createElement('iframe');
        iframe.id = `iframe_${username}`;
        iframe.width = "0";
        iframe.height = "0";
        iframe.src = `https://www.instagram.com/${username}/`

        document.body.appendChild(iframe);

        iframe.onload = function() {
            console.log(iframe.contentDocument.title.indexOf("Page Not Found"))
            // 非法url不处理
            if(iframe.contentDocument.title.indexOf("Page Not Found") < 0){
                console.log(`begin get data by user: ${username}`);

                let followers = iframe.contentWindow._sharedData.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count;
                //let posts = iframe.contentWindow._sharedData.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;
                let posts = filterPosts(iframe.contentWindow._sharedData.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.slice(0, 30));

                if(posts.length > 0) {
                    for(let i=0; i<posts.length; i++){
                        commentCount =posts[i].node.edge_media_to_comment.count;// 评论量
                        likeCount = posts[i].node.edge_media_preview_like.count;// 赞量
                        videoViewCount = posts[i].node.video_view_count;// 视频播放量
                        if(posts[i].node.is_video){
                            likeOrViewCountList.push(videoViewCount)
                            commentCountList.push(commentCount)
                        } else {
                            likeOrViewCountList.push(likeCount)
                            commentCountList.push(commentCount)
                        }
                    }

                    console.log("secon  yyyyyy name: ", username)
                    //console.log(!checkNameExits(userData, username))
                    if(!checkNameExits(userData, username)) {
                        userNames.push(username);
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
                } else {
                  if(!checkNameExits(userData, username)) {
                        userNames.push(username);
                        userData.push([
                            username,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ])
                    }
                }
                console.log(`粉丝量: ${convertNumber(followers)}k, 最近 10 个 post 的平均点赞数: ${avg(likeOrViewCountList)}, 最大点赞数: ${max(likeOrViewCountList)}, 最小点赞数: ${min(likeOrViewCountList)}. 平均评论数: ${avg(commentCountList)}，最高评论数: ${max(commentCountList)}，最低评论数: ${min(commentCountList)}`)
                //console.log(userData)
                window.localStorage.setItem("userData", JSON.stringify(userData))
                window.localStorage.setItem("userNames", JSON.stringify(userNames))
                console.log(`completely get data by user: ${username}`)
                iframe.remove();
            }else {
               console.log(`非法用户: ${username}，请刷新重试.`)
               userNames.push(username);
               window.localStorage.setItem("userNames", JSON.stringify(userNames))
               iframe.remove();
               //window.clearInterval(reqTimer);
            }

        };
    }

    // 默认执行完毕后自动清理storage缓存
    // 每5秒执行一次
    reqTimer = window.setInterval(prepareIframes, 5000)

    // 排除48小时内的posts
    function filterPosts(posts) {
      let total = 0;
      let resultPosts = [];
      for(let i =0; i < posts.length; i++) {
          let post = posts[i];
          let fourty_eight_hours_ago = Math.round(new Date().getTime() / 1000) - (excludeHours * 3600);
          if(posts[i].node.taken_at_timestamp <= fourty_eight_hours_ago && total <= 10){
            resultPosts.push(posts[i])
            total += 1
          }
      }
      return resultPosts
    }

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
       hiddenElement.style.width = '240px';
       hiddenElement.style.height = '40px';
       hiddenElement.style.lineHeight = '40px';
       hiddenElement.style.textAlign = 'center';
       hiddenElement.style.color = '#ffffff';
       hiddenElement.style.display = 'block';
       hiddenElement.style.background = 'orange';
       hiddenElement.innerHTML = `点击下载`;
       hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
       hiddenElement.target = '_blank';
       hiddenElement.download = 'my-data.csv';
       document.body.appendChild(hiddenElement)
       //hiddenElement.click();
   }



   function prepareClearStorageButton() {
       //console.log(csv);
       var hiddenElement = document.createElement('a');
       hiddenElement.setAttribute("id", "clearButton");
       hiddenElement.style.color = 'red';
       hiddenElement.style.position = 'fixed';
       hiddenElement.style.top = '190px';
       hiddenElement.style.right = '20px';
       hiddenElement.style.zIndex = '99999';
       hiddenElement.style.size = '30px';
       hiddenElement.style.width = '240px';
       hiddenElement.style.height = '40px';
       hiddenElement.style.lineHeight = '40px';
       hiddenElement.style.textAlign = 'center';
       hiddenElement.style.color = '#ffffff';
       hiddenElement.style.display = 'block';
       hiddenElement.style.background = 'red';
       hiddenElement.href = "javascript:void(0);"
       hiddenElement.innerHTML = `清空缓存重新获取`;
       document.body.appendChild(hiddenElement)
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
       if(array.length == 0) {
          return 0;
       }
       let sum = array.reduce((a, b) => a + b, 0);
       let avg = (sum / array.length) || 0;
       return avg
   }

   function min(array) {
       if(array.length == 0) {
          return 0;
       }
      return Math.min.apply(Math, array);
   }

   function max(array) {
       if(array.length == 0) {
          return 0;
       }
      return Math.max.apply(Math, array);
   }
})();