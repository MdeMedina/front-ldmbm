const backendUrl = () => {
  console.log("BACKEND_URL:", process.env);
  return process.env.NEXT_PUBLIC_BACKEND_URL;
};

const frontUrl = () => {
  console.log("FRONTEND_URL:", process.env);
  return process.env.NEXT_PUBLIC_FRONTEND_URL;
};

module.exports = {
  backendUrl,
  frontUrl,
};
