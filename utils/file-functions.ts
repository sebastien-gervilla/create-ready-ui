import tar from 'tar';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import tempy from 'tempy';
import axios from 'axios';

export const downloadFile = async (url: string) => {
    try {
        const tmpFilePath = tempy.temporaryFile();
        const file = fs.createWriteStream(tmpFilePath);
    
        const response = await axios.get(url, { responseType: 'stream' });
        response.data.pipe(file);
    
        return tmpFilePath;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const extractTemplate = async (directoryPath: string, filePath: string) => {
    try {
        await tar.extract({ 
            cwd: directoryPath, 
            file: filePath 
        });
    } catch (extractArchiveError) {
        console.log(extractArchiveError);
        return false;
    }
    return true;
}

export const tryRenameFile = async (oldPath: string, newPath: string) => {
    try {
        tryCrossPartitionRename(oldPath, newPath);
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

const tryCrossPartitionRename = async (oldPath: string, newPath: string) => {
    try {
        await fsp.rename(oldPath, newPath);
    } catch (error) {
        if (error.code === 'EXDEV')
            await fsp.copyFile(oldPath, newPath);
    }
}