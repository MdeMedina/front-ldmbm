const backendUrl = () => {
  return process.env.BACKEND_URL;
};

const frontUrl = () => {
  return process.env.FRONTEND_URL;
};

module.exports = {
  backendUrl,
  frontUrl,
};
