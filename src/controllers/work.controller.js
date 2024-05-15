const { Op, where } = require('sequelize');
const db = require('../models');
const { link } = require('../routes/work.router');
const Work = db.Work;
const User = db.User;
const Important = db.Important;
const Sprint = db.Sprint;

const WorkController = {
  createWork: async (req, res) => {
    const user = req.user;
    const { title, endDate, startDate, importantId, description, sprintId, followerId } = req.body;
    try {
      const userLogged = await db.User.findOne({
        where: {
          id: user.id,
        },
      });
      const work = await Work.create({
        title,
        endDate,
        startDate,
        description,
        importantId,
        sprintId: +sprintId,
        followerId: +followerId || userLogged.id,
      });

      if (!work) {
        return res.status(500).json({ message: 'Không thể tạo công việc' });
      }
      return res.status(200).json(work);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Có lỗi xảy ra!' });
    }
  },

  getWorksBySprintId: async (req, res) => {
    try {
      const { sprintId } = req.params;
      const { sortBy, sortType, search } = req.query;

      let order = [];
      if (sortBy) {
        order = [[sortBy, sortType || 'ASC']];
      } else {
        order = [['id']];
      }

      const works = await Work.findAll({
        where: {
          sprintId,
          [Op.or]: [{ title: { [Op.like]: `%${search || ''}%` } }],
        },
        attributes: ['id', 'title', 'description', 'endDate', 'startDate', 'status'],
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
            as: 'follower',
          },
          {
            model: Important,
            attributes: ['id', 'level'],
            as: 'important',
          },
        ],
        order,
      });
      return res.status(200).json(works);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Có lỗi xảy ra!' });
    }
  },

  getWorkById: async (req, res) => {
    try {
      const { workId } = req.params;
      const work = await Work.findOne({
        where: {
          id: workId,
        },
        attributes: ['id', 'title', 'description', 'endDate', 'startDate', 'status'],
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
            as: 'follower',
          },
          {
            model: Important,
            attributes: ['id', 'level'],
            as: 'important',
          },
          {
            model: Sprint,
            attributes: ['id', 'name'],
            as: 'sprint',
          },
          {
            model: db.WorkFileStorage,
            attributes: ['id', 'name', 'link', 'type'],
            as: 'files',
          },
        ],
      });
      if (!work) {
        return res.status(404).json({ message: 'Không tìm thấy!' });
      }
      return res.status(200).json(work);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Có lỗi xảy ra!' });
    }
  },

  updateWork: async (req, res) => {
    try {
      const user = req.user;
      const { workId } = req.params;
      const { title, endDate, startDate, importantId, description, sprintId, followerId, status } = req.body;

      const work = await Work.findOne({
        where: {
          id: workId,
        },
      });

      if (!work) {
        return res.status(404).json({ message: 'Không tìm thấy!' });
      }

      const workUpdate = {
        title: title ?? work.title,
        endDate: endDate ?? work.endDate,
        startDate: startDate ?? work.startDate,
        importantId: importantId ? +importantId : work.importantId,
        description: description ?? work.description,
        sprintId: sprintId ? +sprintId : work.sprintId,
        followerId: followerId ? +followerId : work.followerId,
        status: status ?? work.status,
      };

      const updateWork = await Work.update(workUpdate, {
        where: {
          id: workId,
        },
        returning: true,
      });
      if (!updateWork) {
        return res.status(500).json({ message: 'Không thể lưu' });
      }
      if (updateWork.length) {
        return res.status(200).json({ success: true });
      }
      return res.status(404).json({ message: 'Không tìm thấy!' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Có lỗi xảy ra!' });
    }
  },

  deleteWork: async (req, res) => {
    try {
      const user = req.user;
      const { workId } = req.params;
      const work = await Work.findOne({
        where: {
          id: workId,
        },
      });
      const workDelete = await Work.destroy({
        where: {
          id: workId,
        },
      });
      return res.status(200).json(workDelete);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Có lỗi xảy ra!' });
    }
  },

  addFiles: async (req, res) => {
    try {
      const { workId } = req.params;
      const { files } = req.body;

      const work = await Work.findOne({
        where: {
          id: workId,
        },
      });

      if (!work) {
        return res.status(404).json({ message: 'Không tìm thấy công việc!' });
      }

      files.forEach((file) => {
        db.WorkFileStorage.create({
          workId: work.id,
          link: file.path,
          name: file.name,
          type: file.type,
        });
      });

      return res.status(200).json({ message: 'Thêm files thành công', success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Có lỗi xảy ra!' });
    }
  },
};

module.exports = WorkController;
