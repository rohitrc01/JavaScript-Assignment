import { createWriteStream } from 'node:fs';
import { basename } from 'node:path';
import https from 'node:https';
import http from 'node:http';

const downloads = new Map();

function render() {
    process.stdout.write('\x1b[2J\x1b[0f'); // Clear screen and move cursor to top
    console.log('Downloading:');
    for (const [, data] of downloads) {
        console.log( `${data.fileName}: ${data.percent}%`);
    }
}

function downloadFile(url, index) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const fileName = basename(new URL(url).pathname);
        let chunks = 0, downloaded = 0;

        downloads.set(index, { fileName, percent: 0 });

        client.get(url, (res) => {
            res.pipe(createWriteStream(fileName))
                .on('finish', () => {
                    render();
                    resolve();
                });

            res.on('data', chunk => {
                downloaded += chunk.length;
                downloads.set(index, { fileName, percent: Math.round(downloaded / 1024 / 1024) });
                if (++chunks % 100 === 0) render();
            });
        });
    });
}

async function main() {
    const urls = [
        'https://ash-speed.hetzner.com/100MB.bin',
        'https://ash-speed.hetzner.com/1GB.bin'
    ];

    const promises = urls.map((url, index) => downloadFile(url, index));

    await Promise.all(promises);

    console.log('\nAll downloads completed.');
}

main().catch(console.error);


