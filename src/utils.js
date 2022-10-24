/* eslint-disable import/prefer-default-export */

export const setHours = (dateString, hours) => {
  return new Date(new Date(dateString).setHours(hours, 0, 0, 0));
};
