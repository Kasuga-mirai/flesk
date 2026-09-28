let latestText = "";

async function generateText() {

    // ローディング表示
    document
      .getElementById("loading")
      .style.display = "block";

    let response = await fetch("/markov");

    let text = await response.text();

    latestText = text;

    document
      .getElementById("result")
      .innerHTML += text + "<br>";

    // ローディング非表示
    document
      .getElementById("loading")
      .style.display = "none";
}
function shareOnX() {


    let shareText =
        latestText + "\n未来ちゃんかわいいサイト!!\nhttps://www.mirai-cha.link/markoving";

    let url =
        "https://twitter.com/intent/tweet?text="
        + encodeURIComponent(shareText);

    window.open(url, "_blank");
}

let imageInput =
document.getElementById("imageInput");

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function(e) {

            let file = e.target.files[0];

            let img = new Image();

            img.onload = function() {

                let canvas =
                document.createElement("canvas");

                let ctx =
                canvas.getContext("2d");

                let size =
                Math.min(img.width, img.height);

                let sx =
                (img.width - size) / 2;

                let sy =
                (img.height - size) / 2;

                let outputSize = 128;

                canvas.width = outputSize;
                canvas.height = outputSize;

                ctx.drawImage(
                    img,
                    sx, sy, size, size,
                    0, 0,
                    outputSize,
                    outputSize
                );

                let dataURL =
                canvas.toDataURL("image/png");

                document
                .getElementById("preview")
                .src = dataURL;

                fetch("/upload", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({
                        image: dataURL
                    })

                });

            };

            img.src =
            URL.createObjectURL(file);

        }
    );

}


// ========================================
// 音声ファイル
// ========================================

const soundFiles = [
    "/static/pajama.mp3",
    "/static/harukana.mp3"
];


// ========================================
// サイトに入ったときにランダム選択
// ========================================

const selectedSound =
    soundFiles[Math.floor(Math.random() * soundFiles.length)];


// ========================================
// 音声設定
// ========================================

let soundEnabled = false;

// Web Audio API
let audioContext = null;

// 読み込んだ音声データ
let audioBuffer = null;


// ========================================
// 音声を読み込む
// ========================================

async function loadSound() {

    // AudioContextを作成
    if (!audioContext) {

        audioContext =
            new (window.AudioContext ||
                 window.webkitAudioContext)();

    }

    // 音声ファイルを取得
    const response =
        await fetch(selectedSound);

    // ArrayBufferに変換
    const arrayBuffer =
        await response.arrayBuffer();

    // 音声データとしてデコード
    audioBuffer =
        await audioContext.decodeAudioData(arrayBuffer);
}


// ========================================
// 音声 ON / OFF
// ========================================

async function toggleSound() {

    soundEnabled = !soundEnabled;

    const button =
        document.getElementById("soundButton");


    if (soundEnabled) {

        button.innerText = "音声 ON!!";
        button.classList.add("sound-on");


        // 初回だけ音声を読み込む
        if (!audioBuffer) {

            await loadSound();

        }


        // iPhoneなどでAudioContextが停止していた場合
        if (audioContext.state === "suspended") {

            await audioContext.resume();

        }


    } else {

        button.innerText = "音声 OFF";
        button.classList.remove("sound-on");

    }

}


// ========================================
// 音声を再生
// ========================================

function playSound() {

    if (!soundEnabled) {
        return;
    }

    if (!audioContext || !audioBuffer) {
        return;
    }


    // 音声再生用のノードを毎回作る
    const source =
        audioContext.createBufferSource();

    source.buffer = audioBuffer;

    source.connect(audioContext.destination);


    // 再生
    source.start();

}


// ========================================
// なでなでボタン
// ========================================

function countClick() {

    // ====================================
    // カウント
    // ====================================

    fetch("/count")
    .then(response => response.text())
    .then(data => {

        document
            .getElementById("countNumber")
            .innerText = data;

    });


    // ====================================
    // 画像を跳ねさせる
    // ====================================

    let img =
        document.getElementById("bounceImage");

    if (img) {

        img.classList.remove("bounce");

        void img.offsetWidth;

        img.classList.add("bounce");

    }


    // ====================================
    // 音声
    // ====================================

    playSound();

}





// ページ読み込み時
window.addEventListener("load", function () {

    fetch("/get_count")
    .then(response => response.text())
    .then(data => {

        document
        .getElementById("countNumber")
        .innerText = data;

    });

});

function shareCountOnX() {

    let count =
        document.getElementById("countNumber")
        .textContent;

    let shareText =
        "みんなで未来ちゃんを " +
        count +
        " 回なでなでしました！\n" +
        "未来ちゃんかわいいサイト!!\nhttps://www.mirai-cha.link";

    let url =
        "https://twitter.com/intent/tweet?text="
        + encodeURIComponent(shareText);

    window.open(url, "_blank");
    
}

let currentSong = null;

function getsound() {

    fetch("/random_song_api")
    .then(res => res.json())
    .then(data => {

        currentSong = data;

            document.getElementById("songArea").innerHTML =
            "<div class='song-card'>" +

                "<img src='" + data.image + "' class='song-image'><br>" +

                "<h2>" + data.title + "</h2>" +

                "<p>" + data.comment + "</p>" +

                (data.apple
                    ? "<a href='" + data.apple + "' target='_blank'>Apple Music</a><br>"
                    : "Apple Music：配信していません!<br>") +

                (data.youtube
                    ? "<a href='" + data.youtube + "' target='_blank'>YouTube</a><br>"
                    : "YouTube：配信していません!<br>") +

                (data.spotify
                    ? "<a href='" + data.spotify + "' target='_blank'>Spotify</a>"
                    : "Spotify：配信していません!") +

            "</div>";
    });
}

function shareOnXsong() {

    if (!currentSong) {
        alert("先に曲を選んでください！");
        return;
    }

    let shareText =
        `今日の1曲は「${currentSong.title}」！\n` +
        "未来ちゃんかわいいサイト!!\n" +
        "https://www.mirai-cha.link/song";

    let url =
        "https://twitter.com/intent/tweet?text="
        + encodeURIComponent(shareText);

    window.open(url, "_blank");
}



// function shareEvent(button){

//     const eventDiv = button.closest('.event');

//     // ① タイトル（そのままpから取る）
//     const title =
//         eventDiv.querySelector('.nenpyo-text').innerText;

//     // ② URL（自動付与されたid使用）
//     const pageUrl =
//         location.origin +
//         location.pathname +
//         "#" +
//         eventDiv.id;

//     const shareText =
//         title +
//         "\n\n未来ちゃんかわいいサイト!!\n" +
//         "#未来ちゃんかわいい大会\n" +
//         pageUrl;

//     window.open(
//         "https://twitter.com/intent/tweet?text=" +
//         encodeURIComponent(shareText),
//         "_blank"
//     );
// }

function shareEvent(button){
    alert("クリックされた！");
}