// Handle image upload and display
const imageInput = document.getElementById('imageInput');
const imageCanvas = document.getElementById('imageCanvas');
const ctx = imageCanvas.getContext('2d');
const rgbValuesDiv = document.getElementById('rgbValues');

// Plotly 3D RGB graph for hovered pixel
function plotRGB(r, g, b) {
    const trace = {
        x: [r],
        y: [g],
        z: [b],
        mode: 'markers',
        marker: {
            size: 12,
            color: `rgb(${r},${g},${b})`,
        },
        type: 'scatter3d',
        name: 'Pixel RGB'
    };
    const layout = {
        scene: {
            xaxis: {title: 'R', range: [0,255]},
            yaxis: {title: 'G', range: [0,255]},
            zaxis: {title: 'B', range: [0,255]},
        },
        margin: {l:0, r:0, b:0, t:0}
    };
    Plotly.newPlot('rgbGraph', [trace], layout, {displayModeBar: false});
}

// Plotly 3D RGB graph for all pixels
function plotAllRGBs(rgbList) {
    const xs = rgbList.map(rgb => rgb[0]);
    const ys = rgbList.map(rgb => rgb[1]);
    const zs = rgbList.map(rgb => rgb[2]);
    const colors = rgbList.map(rgb => `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
    const trace = {
        x: xs,
        y: ys,
        z: zs,
        mode: 'markers',
        marker: {
            size: 3,
            color: colors,
        },
        type: 'scatter3d',
        name: 'All Pixels RGB'
    };
    const layout = {
        scene: {
            xaxis: {title: 'R', range: [0,255]},
            yaxis: {title: 'G', range: [0,255]},
            zaxis: {title: 'B', range: [0,255]},
        },
        margin: {l:0, r:0, b:0, t:0}
    };
    Plotly.newPlot('allRgbGraph', [trace], layout, {displayModeBar: false});
}

imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            imageCanvas.width = img.width;
            imageCanvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Get all pixel RGBs
            const imgData = ctx.getImageData(0, 0, img.width, img.height).data;
            const rgbList = [];
            for (let i = 0; i < imgData.length; i += 4) {
                rgbList.push([imgData[i], imgData[i+1], imgData[i+2]]);
            }
            plotAllRGBs(rgbList);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Mouse move event to get pixel RGB
imageCanvas.addEventListener('mousemove', function(e) {
    const rect = imageCanvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    if (x >= 0 && y >= 0 && x < imageCanvas.width && y < imageCanvas.height) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const [r, g, b] = pixel;
        rgbValuesDiv.textContent = `R: ${r}, G: ${g}, B: ${b}`;
        plotRGB(r, g, b);
    }
});

// Initial empty graphs
plotRGB(0,0,0);
plotAllRGBs([]);
