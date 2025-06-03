function createGreetingCard(canvasId, nameInputId, downloadBtnId, shareBtnId, backgroundImageSrc, fontUrl, fontSize, textColor,textPositionX = 2, textPositionY) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const nameInput = document.getElementById(nameInputId);
    const downloadBtn = document.getElementById(downloadBtnId);
    const shareButton = document.getElementById(shareBtnId);
    const image = new Image();
    const newFont = new FontFace('myFont', `url(${fontUrl})`);

    newFont.load().then(function(font) {
        document.fonts.add(font);
    });

    // Set up the card background image
    image.src = backgroundImageSrc;

    image.onload = function() {
        drawImage();
    }

    function drawImage() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas before drawing
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.font = `bold ${fontSize}px myFont`;
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.fillText(nameInput.value, (canvas.width) / textPositionX, textPositionY); // Use the passed Y position
    }

    // Type the input in real time
    nameInput.addEventListener('input', function() {
        drawImage();
    });

    // Download the image if the download button is pressed.
    downloadBtn.addEventListener('click', function() {
        downloadBtn.href = canvas.toDataURL('image/jpeg').replace("image/jpeg", "image/octet-stream");
        downloadBtn.download = `تهنئة - ${nameInput.value}.png`;
    });

    // Download the picture if "Enter" key is pressed in the input field
    nameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            downloadBtn.click();
        }
    });

    // Share the canvas image
    shareButton.addEventListener('click', function() {
        shareCanvas();
    });

    async function shareCanvas() {
        const dataUrl = canvas.toDataURL();
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'fileName.png', { type: blob.type });
        navigator.share({
            files: [file],
        });
    }
}

// Function to get the selected card properties
function getCardProperties() {
    const selectedCard = document.querySelector('input[name="card"]:checked').value;
    if (selectedCard === 'card1') {
        return {
            backgroundImageSrc: 'eid1.png',     // Card 1 background image
            fontUrl: 'fonts/F-DIN.ttf',            // Card 1 font
            fontSize: 50,                        // Card 1 font size
            textColor: '#3f72a0',               // Card 1 text color
            textPositionX:2,                 //text X-axis position
            textPositionY: 1427                    // Card 1 text Y-axis position
        };
    } else if (selectedCard === 'card2') {
        return {
            backgroundImageSrc: 'eid2.png',     // Card 2 background image
            fontUrl: 'fonts/F-DIN.ttf',            // Card 2 font (or different if needed)
            fontSize: 50,                        // Card 2 font size
            textColor: '#3f72a0',             // Card 2 text color
            textPositionX:2,                  //text X-axis position
            textPositionY: 1447                    // Card 2 text Y-axis position
        };
      } else if (selectedCard ==='card3'){
        return {
            backgroundImageSrc: 'eid3.png',     // Card 3 background image
            fontUrl: 'fonts/F-DIN.ttf',            // Card 3 font (or different if needed)
            fontSize: 50,                        // Card 3 font size
            textColor: '#3f72a0',             // Card 3 text color
            textPositionX:2,                  //text X-axis position
            textPositionY: 1237                   // Card 2 text Y-axis position
        };

      };

}

// Initialize the greeting card on load
function initializeGreetingCard() {
    const cardProps = getCardProperties(); // Get initial card properties
    createGreetingCard(
        'canvas',
        'name',
        'download-btn',
        'share1',
        cardProps.backgroundImageSrc,
        cardProps.fontUrl,
        cardProps.fontSize,
        cardProps.textColor,
        cardProps.textPositionX,
          cardProps.textPositionY // Pass the Y-axis position as an argument
    );
}


document.querySelectorAll('input[name="card"]').forEach((radio) => {
    radio.addEventListener('change', function() {
        //document.fonts.clear(); // Clear font cache on selector change
        initializeGreetingCard(); // Re-initialize the greeting card based on selection
    });
});

// Call initialize on page load
window.onload = initializeGreetingCard;
