const apiKey = "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";
const maxImage = 4;
const selectedImageNumber = undefined;

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (min - max + 1)) + min;
}

function disableGenerateButton() {
    document.getElementById("generate").disabled = true;
}

function clearImageGrid() {
    const imageGrid = document.getElementById("image");
    imageGrid.innerHTML = "";
}

async function generateImages(input) {
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for (let i = 0; i < maxImage; i++) {
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/SG161222/Realistic_Vision_V1.4", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            const error = document.createElement("h2");
            error.style.color = "red";
            error.style.fontSize = "1.2rem";
            const result = document.getElementById("result");
            error.innerHTML = response.text();
            result.appendChild(error);
        }
        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);

        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }
    loading.style.display = "none";
    enableGenerateButton();
    selectedImageNumber = null;
}

document.getElementById("generate").addEventListener("click", () => {
    const input = document.getElementById("user-prompt").value;
    console.log(input);
    generateImages(input);
});

document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("prompt").value;
    console.log(input);
    generateImages(input);
});
