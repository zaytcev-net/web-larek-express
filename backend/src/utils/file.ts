import fs from 'fs/promises';
import path from 'path';
import config from '../config';

const publicPath = path.join(__dirname, '../public');

const moveFileToImages = async (fileName: string) => {
  const sourcePath = path.join(publicPath, config.uploadPathTemp, fileName);

  const destinationPath = path.join(publicPath, config.uploadPath, fileName);

  try {
    await fs.access(sourcePath);
  } catch {
    return;
  }

  await fs.rename(sourcePath, destinationPath);
};

export default moveFileToImages;
