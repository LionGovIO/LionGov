import { BASE_URL } from './shared/urls'

export function init() {

  // Default Axios error handler
  axios.interceptors.response.use(null, function (error) {
    if (error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.msg) {

      alert(error.response.data.error.msg)

    } else {
      if (error.message){
        alert(error.message)
      }
      else {
        alert("Error!\n " + JSON.stringify(error.toJSON()))
        console.log(error.toJSON());
      }
    }

    return Promise.reject(error);
  });

}
