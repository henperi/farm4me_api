const admin = require('firebase-admin');


/**
 *
 * @param {{
 *  userId: string,
 *  imageFile: File,
 *  folderName: string,
 * }} uploadData
 *
 * @returns {Promise<string>} result
 */
export const uploadFile = async ({ userId, imageFile, folderName }) => {
  console.log(imageFile);

  const bucket = admin.storage().bucket();
  const fileName = `${folderName}/${userId}/${imageFile.name}`;
  const file = bucket.file(fileName);

  return file.save(imageFile)
    .then(() => file.getSignedUrl({
      action: 'read',
      expires: '03-09-2500',
    }))
    .then((urls) => {
      const url = urls[0];
      console.log(`media url = ${url}`);

      return url;
    })
    .catch((err) => {
      console.log(`Unable to upload encoded file ${err}`);

      throw Error(err);
    });
};
