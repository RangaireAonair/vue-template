import { createWriteStream } from 'streamsaver';

// 获取文件大小
const getFileSize = async (url) => {
  const response = await fetch(url, { method: 'HEAD' });
  const contentLength = response.headers.get('content-length');
  const fileName = response.headers.get('Content-Disposition').match(/filename="(.+)"/)[1];

  if (!contentLength) throw new Error('无法获取文件大小');
  return [parseInt(contentLength, 10), decodeURIComponent(fileName)];
};

export async function download(url) {
  const worker = new Worker(new URL('./downloadWorker.js', import.meta.url), {
    type: 'module'
  });
  const [fileSize, fileName] = await getFileSize(url);
  const fileStream = createWriteStream(fileName);
  const writer = fileStream.getWriter();
  // 监听 Worker 的消息
  worker.onmessage = (event) => {
    const { type, data } = event.data;

    if (type === 'progress') {
      console.log(`下载进度: ${data}%`);
    } else if (type === 'chunk') {
      const { chunk, index } = data;
      saveChunk(chunk, index);
    } else if (type === 'done') {
      console.log('文件下载完成:', data);
      writer.close();
      worker.terminate();
    } else if (type === 'error') {
      writer.abort();
      console.error('下载出错:', data);
    }
  };

  worker.onerror = (event) => {
    console.log(event);
    throw event;
  };
  const saveChunk = (chunk) => {
    writer.write(new Uint8Array(chunk));
  };

  // 启动下载
  worker.postMessage({
    url: url,
    fileSize: fileSize,
    chunkSize: 1024 * 1024 * 10 // 每片 1MB
  });
}
