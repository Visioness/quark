export const friendKeys = {
  all: () => ['friends'],
  list: () => [...friendKeys.all(), 'list'],
  requests: () => [...friendKeys.all(), 'requests'],
};
