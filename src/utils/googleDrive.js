import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const KEYFILEPATH = path.join(process.cwd(), 'smged-account-google.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

export async function uploadFileToDrive({ filePath, fileName, mimeType, folderId }) {
    const fileMetadata = {
        name: fileName,
        parents: folderId ? [folderId] : [],
    };
    const media = {
        mimeType,
        body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id, webViewLink, webContentLink',
    });

    // Hacer el archivo público
    await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        },
    });

    return {
        id: response.data.id,
        webViewLink: response.data.webViewLink,
        webContentLink: response.data.webContentLink,
    };
}

export async function getOrCreateFolder(folderName, parentId = null) {
    // Buscar si la carpeta ya existe
    const q = `'${parentId || 'root'}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const res = await drive.files.list({
        q,
        fields: 'files(id, name)',
        spaces: 'drive',
    });

    let folderId;
    if (res.data.files.length > 0) {
        folderId = res.data.files[0].id;
    } else {
        // Crear la carpeta si no existe
        const fileMetadata = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: parentId ? [parentId] : [],
        };

        const folder = await drive.files.create({
            resource: fileMetadata,
            fields: 'id',
        });

        folderId = folder.data.id;
    }

    // Compartir la carpeta con tu correo personal
    await drive.permissions.create({
        fileId: folderId,
        requestBody: {
            type: 'user',
            role: 'writer',
            emailAddress: 'ericchaparro1409@gmail.com',
        },
    });

    return folderId;
}