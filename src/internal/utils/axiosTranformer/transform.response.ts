/* eslint-disable */
export const transformResponse = (response: any) => {
  try {
    response = JSON.parse(response);
  } catch (err) {
    console.log(err);
    console.log('error transforming the following response:', response);
  }
  return response;
};
