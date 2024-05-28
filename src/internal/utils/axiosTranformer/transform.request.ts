/* eslint-disable */
export const transformRequest = (request: any) => {
  try {
    request = JSON.stringify(request);
  } catch (err) {
    console.log(err);
    console.log('error transforming the following request:', request);
  }
  return request;
};
