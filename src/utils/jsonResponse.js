export const generateJsonRes = (
  success = true,
  message = "Done",
  results = {}
) => {
  return {
    success,
    message,
    results,
  };
};
