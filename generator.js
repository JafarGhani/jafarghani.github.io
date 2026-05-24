// Global state system tracking variables across layout switches
let currentImage = new Image();
let canvas, ctx, nameInput, downloadBtn, shareButton, fontSelect, colorPicker;

// Master structural map configuration defining defaults per card
const CARD_TEMPLATES = {
    card1: {
        backgroundImageSrc: 'eid1.jpg',
        defaultColor: '#000000',
        fontSize: 50,
        textPositionX: 2,
        textPositionY: 1405
    },
    card2: {
        backgroundImageSrc: 'eid2.jpg',
        defaultColor: '#000000',
        fontSize: 50,
        textPositionX: 2,
        textPositionY: 965
    },
    card3: {
        backgroundImageSrc: 'eid3.jpg',
        defaultColor: '#f3ecd9',
        fontSize: 50,
        textPositionX: 2,
        textPositionY: 1220
    }
};
function updateFontSizeUI(size) {
    const sizeInput = document.getElementById('font-size-input');
    if (sizeInput) {
        sizeInput.value = size;
    }
}
// Central execution painting engine
function drawCard() {
    if (!currentImage.complete) return; 

    const selectedRadio = document.querySelector('input[name="card"]:checked').value;
    const config = CARD_TEMPLATES[selectedRadio];

    // Clear and redraw canvas image sheet
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

    // Pull directly from the DOM fields to reflect current choices instantly
    const chosenFont = fontSelect.value;
    const chosenColor = colorPicker.value;

    ctx.font = `bold ${config.fontSize}px ${chosenFont}`;
    ctx.fillStyle = chosenColor;
    ctx.textAlign = "center";

    if (nameInput.value.trim() !== "") {
        ctx.fillText(nameInput.value, canvas.width / config.textPositionX, config.textPositionY);
    }
}

// Dynamically registers layout typography assets safely using the Web FontFace API
async function loadFont(fontName) {
    const option = fontSelect.querySelector(`option[value="${fontName}"]`);
    if (!option) return;
    
    const fontUrl = option.getAttribute('data-url');
    if (!fontUrl) return;

    try {
        const fontResource = new FontFace(fontName, `url(${fontUrl})`);
        const processedFont = await fontResource.load();
        document.fonts.add(processedFont);
    } catch (error) {
        console.error(`Typography registration failed for: ${fontName}`, error);
    }
}

// Inside initializeApp() function...

const btnIncrease = document.getElementById('font-increase');
const btnDecrease = document.getElementById('font-decrease');
const fontSizeInput = document.getElementById('font-size-input');

// 1. Handle "+" Button Click
btnIncrease.addEventListener('click', () => {
    const selectedCardKey = document.querySelector('input[name="card"]:checked').value;
    CARD_TEMPLATES[selectedCardKey].fontSize += 1;
    updateFontSizeUI(CARD_TEMPLATES[selectedCardKey].fontSize);
    drawCard();
});

// 2. Handle "-" Button Click
btnDecrease.addEventListener('click', () => {
    const selectedCardKey = document.querySelector('input[name="card"]:checked').value;
    if (CARD_TEMPLATES[selectedCardKey].fontSize > 1) { 
        CARD_TEMPLATES[selectedCardKey].fontSize -= 1;
        updateFontSizeUI(CARD_TEMPLATES[selectedCardKey].fontSize);
        drawCard();
    }
});

// 3. Handle Typing Directly into the Text Input Field
fontSizeInput.addEventListener('input', (e) => {
    const selectedCardKey = document.querySelector('input[name="card"]:checked').value;
    let parsedSize = parseInt(e.target.value, 10);
    
    // Safety handling for empty fields or zeros while typing
    if (isNaN(parsedSize) || parsedSize < 1) {
        parsedSize = 1; 
    }

    CARD_TEMPLATES[selectedCardKey].fontSize = parsedSize;
    drawCard();
});
// Function triggered when switching cards — updates color defaults but respects chosen font
async function handleCardSwitch() {
    const selectedCardKey = document.querySelector('input[name="card"]:checked').value;
    const template = CARD_TEMPLATES[selectedCardKey];

    // Force update the color input field to match the card's theme default
    colorPicker.value = template.defaultColor;

    // Sync size text readout to match the template configuration size
    updateFontSizeUI(template.fontSize);

    // Switch the canvas image template asset source
    currentImage.src = template.backgroundImageSrc;
    currentImage.onload = drawCard;
}

// Initialize application setup and register unified reactive control streams
function initializeApp() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    nameInput = document.getElementById('name');
    downloadBtn = document.getElementById('download-btn');
    shareButton = document.getElementById('share1');
    fontSelect = document.getElementById('font-select');
    colorPicker = document.getElementById('color-picker');

    // Live styling changes trigger canvas updates instantly
    nameInput.addEventListener('input', drawCard);
    colorPicker.addEventListener('input', drawCard);
    
    // Changing font via dropdown drops into loadFont sequence then redraws
    fontSelect.addEventListener('change', async () => {
        await loadFont(fontSelect.value);
        drawCard();
    });

    // Monitor card design selection adjustments
    document.querySelectorAll('input[name="card"]').forEach((radio) => {
        radio.addEventListener('change', handleCardSwitch);
    });

    // Prevent enter key default actions, mapping straight into a quick layout download
    nameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            downloadBtn.click();
        }
    });

    // Export generated canvas stream to high quality JPEG format file assets
    downloadBtn.addEventListener('click', function() {
        const targetOutputName = nameInput.value.trim() || 'بطاقة_تهنئة';
        downloadBtn.href = canvas.toDataURL('image/jpeg', 0.95);
        downloadBtn.download = `${targetOutputName}.jpeg`;
    });

    // Mobile Web Share API implementation logic handles native sheet distributions
    shareButton.addEventListener('click', async function(e) {
        e.preventDefault();
        try {
            const trackingDataUrl = canvas.toDataURL('image/png');
            const nativeBlob = await (await fetch(trackingDataUrl)).blob();
            const compiledFile = new File([nativeBlob], 'EID-Greeting.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [compiledFile] })) {
                await navigator.share({
                    files: [compiledFile],
                    title: 'بطاقة تهنئة عائلة البن عيسى',
                    text: 'نهنئكم بمناسبة العيد المبارك'
                });
            } else {
                alert('المشاركة المباشرة غير مدعومة على هذا المتصفح حالياً، يرجى حفظ وتنزيل البطاقة عبر زر التحميل الذكي.');
            }
        } catch (failError) {
            console.error('System security intercept on WebShare routine: ', failError);
        }
    });

    // Run baseline font load and structure updates on startup configuration
    loadFont(fontSelect.value).then(() => {
        handleCardSwitch();
    });
}

// Securely run everything once DOM parsing has finished cleanly
window.addEventListener('DOMContentLoaded', initializeApp);
