const ErrorService = {
  errorResponse: (res, error, status = 500, message = 'Đã có lỗi xảy ra!') => {
    console.log(error);
    return res.status(status).json({ message });
  },
};

module.exports = ErrorService;
