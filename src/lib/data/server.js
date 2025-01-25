const backendUrl = () => {
  console.log("BACKEND_URL:", process.env);
  return process.env.BACKEND_URL;
};

const frontUrl = () => {
  console.log("FRONTEND_URL:", process.env);
  return process.env.FRONTEND_URL;
};

module.exports = {
  backendUrl,
  frontUrl,
};
