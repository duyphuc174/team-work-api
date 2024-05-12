const db = require('../models');

const uploadController = {
  uploadFiles: async (req, res) => {
    try {
      const files = req.files;

      const uploadFiles = await Promise.all(
        files.map(async (file) => {
          const { originalname, path } = file;
          return {
            originalname,
            path,
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
