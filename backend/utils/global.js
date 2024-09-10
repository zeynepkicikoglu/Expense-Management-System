let globalPersonId = null;

export const setGlobalPersonId = (personId) => {
  globalPersonId = personId;
};

export const getGlobalPersonId = () => {
  return globalPersonId;
};
