import api from "./axiosInstance";

class ApiCall {
  get(url, callback) {
    this.callApiRequest(url, null, 0, callback);
  }

  post(url, data, callback) {
    this.callApiRequest(url, data, 1, callback);
  }

  patch(url, data, callback) {
    this.callApiRequest(url, data, 2, callback);
  }

  delete(url, data, callback) {
    this.callApiRequest(url, data, 3, callback);
  }

  callApiRequest(append, data, type, callback) {
    let task;

    switch (type) {
      case 0:
        task = api.get(append);
        break;
      case 1:
        task = api.post(append, data);
        break;
      case 2:
        task = api.patch(append, data);
        break;
      default:
        task = api.delete(append, { data });
        break;
    }

    task
      .then((result) => {
        callback(result.data);
      })
      .catch((error) => {
        callback(
          error?.response?.data || {
            success: false,
            message: "Request failed",
          }
        );
      });
  }
}

export default new ApiCall();
