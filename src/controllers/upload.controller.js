const db = require('../models');

const uploadController = {
  uploadFiles: async (req, res) => {
    try {
      const files = req.files;

      const uploadFiles = await Promise.all(
        files.map(async (file) => {
          console.log(file);
          const { originalname, path, mimetype } = file;
          return {
            originalname,
            path,
            type: mimetype,
          };
        }),
      );
      return res.status(200).json(uploadFiles);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Upload files thất bại!' });
    }
  },
};

module.exports = uploadController;
