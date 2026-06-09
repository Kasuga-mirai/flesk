let cropper;

document
.getElementById("imageInput")
.addEventListener("change", function(e) {

    let file = e.target.files[0];
    if (!file) return;

    let image =
        document.getElementById("image");

    image.src =
        URL.createObjectURL(file);

    image.onload = function() {

        if (cropper) {
            cropper.destroy();
        }

        cropper =
        new Cropper(image, {

            aspectRatio: 1,
            viewMode: 1,
            autoCropArea: 0.8,
            responsive: true,
            background: false

        });

    };

});

document
.getElementById("cropButton")
.addEventListener("click", function() {

    if (!cropper) return;

    let canvas =
    cropper.getCroppedCanvas({

        width: 128,
        height: 128

    });

    let dataURL =
        canvas.toDataURL("image/png");

    document
    .getElementById("preview")
    .src = dataURL;

document.getElementById("cropButton").addEventListener("click", function() {

    if (!cropper) return;

    let canvas = cropper.getCroppedCanvas({
        width: 128,
        height: 128
    });

    let dataURL = canvas.toDataURL("image/png");

    document.getElementById("preview").src = dataURL;

    // 🔥 ここ追加！！

    cropper.destroy();  // Cropper消す
    cropper = null;

    document.getElementById("image").style.display = "none"; // 上の画像消す

});

});