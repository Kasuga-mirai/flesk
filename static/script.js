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
        latestText + "\n未来ちゃんかわいい！！2026(URL)";

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

function countClick() {

    fetch("/count")
    .then(response => response.text())
    .then(data => {

        document
        .getElementById("countNumber")
        .innerText = data;

    });

    // 画像跳ねる
    let img =
    document.getElementById("bounceImage");

    if (img) {

        img.classList.remove("bounce");

        void img.offsetWidth;

        img.classList.add("bounce");

    }

    // 💬 吹き出し表示
    let bubble =
    document.getElementById("speechBubble");

    if (bubble) {

        bubble.classList.remove("showBubble");

        void bubble.offsetWidth;

        bubble.classList.add("showBubble");

        // 2秒後に消える
        setTimeout(function() {

            bubble.classList.remove("showBubble");

        }, 2000);

    }

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
        "未来ちゃんかわいい！！2026(URL)";

    let url =
        "https://twitter.com/intent/tweet?text="
        + encodeURIComponent(shareText);

    window.open(url, "_blank");
    
}

