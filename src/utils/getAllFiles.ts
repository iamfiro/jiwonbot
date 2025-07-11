import fs from 'fs';
import path from 'path';

const getAllFiles = (directory: string, foldersOnly = false) => {
	let fileNames: string[] = [];

	const files = fs.readdirSync(directory, { withFileTypes: true });

	for (const file of files) {
		const filePath = path.join(directory, file.name);

		if (file.isDirectory()) {
			if (foldersOnly) {
				fileNames.push(filePath);
			} else {
        fileNames = fileNames.concat(getAllFiles(filePath, false));
      }
		} else {
      if(file.name.endsWith('.ts') || file.name.endsWith('.js')) {
        fileNames.push(filePath);
      }
		}
	}

	return fileNames;
};

export default getAllFiles;
