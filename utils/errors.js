const ERROR_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER: {
    code: 500,
    message: "An error has occurred on the server.",
  },
};
module.exports = ERROR_STATUS;
