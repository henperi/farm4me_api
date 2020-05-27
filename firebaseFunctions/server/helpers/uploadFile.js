const admin = require('firebase-admin');

/**
 *
 * @param {{
 *  userId: string,
 *  file: Express.Multer.File,
 *  folderName: string,
 * }} uploadData
 *
 * @returns {Promise<any>} result
 */
export const uploadFile = async ({ userId, file, folderName }) => {
  const bucket = admin.storage().bucket();
  const fileName = `${folderName}/${userId}/${file.fieldname}`;

  return new Promise((resolve, reject) => {
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', error => reject(error));

    blobStream.on('finish', () => {
      fileUpload.getSignedUrl({
        action: 'read',
        expires: '03-05-3500',
      })
        .then(url => {
          resolve({ [file.fieldname]: url[0] });
        })
        .catch(error => reject(error));
    });

    blobStream.end(file.buffer);
  });
};
