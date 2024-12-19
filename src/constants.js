export const LOGIN_STATUS = {
  PENDING: 'pending',
  NOT_LOGGED_IN: 'notLoggedIn',
  IS_LOGGED_IN: 'loggedIn',
};

export const SERVER = {
  AUTH_MISSING: 'auth-missing',
  AUTH_INSUFFICIENT: 'auth-insufficient',
  REQUIRED_USERNAME: 'required-username',
  CONFLICT_PRODUCT: 'conflict-product',
  INVALID_PRICE: 'invalid-price',
  INVALID_QTY: 'invalid-qty',
  INVALID_CAT: 'invalid-cat',
  INVALID_STOCK: 'invalid-stock',
  REQUIRED_CAT: 'required-cat',
  INSUFFICIENT_STOCK: 'insufficient-stock',
};

export const CLIENT = {
  NETWORK_ERROR: 'networkError',
  NO_SESSION: 'noSession',
  SUCCESSFUL_CHECKOUT: 'successfulCheckout',
};

export const MESSAGES = {
  [CLIENT.NETWORK_ERROR]: 'Trouble connecting to the network.  Please try again.',
  [CLIENT.NO_SESSION]: 'No session found.  Please log in.',
  [CLIENT.SUCCESSFUL_CHECKOUT]: 'Successfully checked out! You can view your order history in Orders.',
  [SERVER.AUTH_INSUFFICIENT]: 'Your username/password combination does not match any records, please try again.',
  [SERVER.AUTH_MISSING]: 'No session found.  Please log in.',
  [SERVER.REQUIRED_USERNAME]: 'Please enter a valid (letters and/or numbers) username.',
  [SERVER.CONFLICT_PRODUCT]: 'Product already exists.',
  [SERVER.INVALID_PRICE]: 'Please enter a valid price.',
  [SERVER.INVALID_QTY]: 'Quantity must be a positive integer and cannot exceed 999.',
  [SERVER.INVALID_CAT]: 'Please enter a valid (letters) cat name.',
  [SERVER.REQUIRED_CAT]: 'Current cat does not exist. Please reload the page.',
  [SERVER.INSUFFICIENT_STOCK]: 'Please enter a quantity less than or equal to the available stock.',
  [SERVER.INVALID_STOCK]: 'Please enter a valid stock quantity.',
  default: 'Something went wrong.  Please try again.',
};

export const POLLING_DELAY = 2000;

