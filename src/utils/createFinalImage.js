export async function createFinalImage(photos, frameUrl) {
    const DPR = Math.min(window.devicePixelRatio || 2, 3); // 최대 3배
    const BASE_WIDTH = 4500;
    const BASE_HEIGHT = 8000;

    const canvas = document.createElement("canvas");
    canvas.width = BASE_WIDTH * DPR;
    canvas.height = BASE_HEIGHT * DPR;

    const ctx = canvas.getContext("2d");
    ctx.scale(DPR, DPR);

    const slots = [
        { x: 272,  y: 325,  w: 1930, h: 2868 },  
        { x: 2299, y: 325,  w: 1930, h: 2868 },  
        { x: 272,  y: 3287, w: 1930, h: 2868 },  
        { x: 2299, y: 3287, w: 1930, h: 2868 },      
    ];


    // 각 사진 넣기
    for (let i = 0; i < photos.length; i++) {
        const img = await loadImage(photos[i]);
        const s = slots[i];

        // keep the photo aspect ratio; scale up slightly to mimic a cover fit without stretching
        const coverScale = Math.max(s.w / img.width, s.h / img.height);
        const dw = img.width * coverScale;
        const dh = img.height * coverScale;
        const dx = s.x + (s.w - dw) / 2;
        const dy = s.y + (s.h - dh) / 2;

        // clip so photos stay inside their slot even after scaling
        ctx.save();
        ctx.beginPath();
        ctx.rect(s.x, s.y, s.w, s.h);
        ctx.clip();
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
        }

    // 프레임 덮기
    const frame = await loadImage(frameUrl);
    ctx.drawImage(frame, 0, 0, BASE_WIDTH, BASE_HEIGHT);

    return canvas.toDataURL("image/jpeg", 0.92);
}

function loadImage(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.src = src;
    });
}
