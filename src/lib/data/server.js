const backendUrl = () => {
  console.log("BACKEND_URL:", process.env);
  return process.env.REACT_APP_BACKEND_URL;
};

const frontUrl = () => {
  console.log("FRONTEND_URL:", process.env);
  return process.env.REACT_APP_FRONTEND_URL;
};

module.exports = {
  backendUrl,
  frontUrl,
};
