self.onmessage = async (event) => {
  const { url, chunkSize, fileSize } = event.data;

  try {
    // 获取文件总大小
    let start = 0;
    let end = chunkSize - 1;
    let index = 0;

    while (start < fileSize) {
      // 下载分片
      const chunk = await downloadChunk(url, start, end);

      // 发送分片数据到主线程
      self.postMessage({ type: 'chunk', data: { chunk: new Uint8Array(chunk), index } });

      // 更新进度
      const progress = ((end + 1) / fileSize) * 100;
      self.postMessage({ type: 'progress', data: progress.toFixed(2) });

      // 更新分片范围
      start = end + 1;
      end = Math.min(start + chunkSize - 1, fileSize - 1);
      index++;
    }

    // 下载完成
    self.postMessage({ type: 'chunk', data: { chunk: null, index: 'final' } });
    self.postMessage({ type: 'done', data: null });
  } catch (error) {
    self.postMessage({ type: 'error', data: error.message });
  }
};

// 下载分片
const downloadChunk = async (url, start, end) => {
  const response = await fetch(url, {
    headers: { Range: `bytes=${start}-${end}` }
  });

  if (response.status !== 206) throw new Error('服务器不支持分片下载');
  return await response.arrayBuffer();
};
