const db = require('../models');
const Important = db.Important;

const ImportantController = {
  getImportants: async (req, res) => {
    try {
      const importants = await Important.findAll({
        order: [['level', 'ASC']],
        attributes: ['id', 'level'],
      });
      if (!importants) {
        return res.status(404).json({ message: 'Không tìm thấy!' });
      }
      return res.status(200).json(importants);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Có lỗi xảy ra!' });
    }
  },
};

module.exports = ImportantController;
