import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import { dayjs } from 'element-plus';

const generateFileName = (fileName) => {
  const dateParams = {
    year: dayjs().year(),
    month: String(dayjs().month() + 1).padStart(2, '0'),
    day: String(dayjs().date()).padStart(2, '0'),
    hour: String(dayjs().hour()).padStart(2, '0'),
    minute: String(dayjs().minute()).padStart(2, '0'),
    second: String(dayjs().second()).padStart(2, '0')
  };
  const { year, day, hour, minute, month, second } = dateParams;
  return `${fileName}-${year}${month}${day}${hour}${minute}${second}`;
};

function ensureZipExtension(input) {
  // 检查字符串是否以 .zip 结尾
  if (!input.endsWith('.zip')) {
    // 如果没有 .zip 后缀，拼接 .zip
    return `${input}.zip`;
  }
  // 如果已经有 .zip 后缀，直接返回原字符串
  return input;
}
/**
 * Param1: packageName: 当前工程的名称
 * Param2: ZipName: 需要输出的Zip包名称
 *
 * */
export default function createZipPlugin(params) {
  const { packageName, ZipName = 'dist.zip' } = params;
  if (!ZipName && !packageName) throw new Error('ZipName is required');
  return {
    name: 'vite-plugin-create-zip',
    apply: 'build',
    enforce: 'post',
    closeBundle() {
      const outputDir = path.resolve(process.cwd(), 'dist'); // 打包输出目录
      const zipFileName = ZipName
        ? ensureZipExtension(ZipName)
        : `${generateFileName(packageName)}.zip`;
      const zipFilePath = path.resolve(__dirname, `../../${zipFileName}`);

      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        console.log(`Zip file created: (${archive.pointer()} bytes)`);
        // resolve(true);
      });

      archive.on('error', (err) => {
        console.error('Error while creating zip file:', err);
      });

      archive.pipe(output);
      archive.directory(outputDir + '/', packageName); // 将 dist 文件夹添加到 ZIP 中
      archive.finalize().then(() => {});
    },
    buildEnd(error) {
      console.log(error);
    }
  };
}
