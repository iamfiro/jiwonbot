import fs from 'fs';
import path from 'path';

const getAllFiles = (directory: string, foldersOnly = true) => {
	let fileNames: string[] = [];

	const files = fs.readdirSync(directory, { withFileTypes: true });

	for (const file of files) {
		const filePath = path.join(directory, file.name);

		if (foldersOnly) {
			if (file.isDirectory()) {
				fileNames.push(filePath);
			}
		} else {
			fileNames.push(filePath);
		}
	}

	return fileNames;
};

export default getAllFiles;
