const sendOkResponse = (results) => {
  return {
    "success": true,
    "error": null,
    "msg": null,
    results
  }
};

const sendMsgAlert = (msg, results) => {
  return {
    "success": true,
    "error": null,
    "msg": msg,
    results
  }
};

const sendErrResponse = (error) => {
  return {
    "success": false,
    error,
    "results": null
  }
};

module.exports = { sendErrResponse, sendOkResponse, sendMsgAlert };
