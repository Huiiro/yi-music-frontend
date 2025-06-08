export function getImageTopBottomColors(img: HTMLImageElement): {
    topColor: string;
    bottomColor: string;
} {
    const canvas = document.createElement('canvas');
    // 消除浏览器警告 启用浏览器的读缓存优化机制
    const ctx = canvas.getContext('2d', {willReadFrequently: true});

    if (!ctx) return {topColor: '#000', bottomColor: '#000'};

    const width = img.naturalWidth;
    const height = img.naturalHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    // 取上半部分
    const topData = ctx.getImageData(0, 0, width, height / 2).data;
    // 取下半部分
    const bottomData = ctx.getImageData(0, height / 2, width, height / 2).data;

    function averageColor(data: Uint8ClampedArray): string {
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        return `rgb(${r}, ${g}, ${b})`;
    }

    return {
        topColor: averageColor(topData),
        bottomColor: averageColor(bottomData),
    };
}
