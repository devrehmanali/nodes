exports.HttpStatusCode = {
  OK: 200,
  CREATED: 200,
  ACCEPTED: 202,
  NOT_SUCCESSFULL: 220,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};
exports.OFFSET_LIMIT = 100;
exports.GenericMessages = {
  INTERNAL_SERVER_ERROR: 'Internal server error!',
  EMAIL_SENDING_FAILED: 'Email sending failed, Please try again!',
  EMAIL_NOT_FOUND: "Email doesn't belong to any account!",
  TOKEN_NOT_EXIST: 'Token does not exist!',
  ADMIN_ALLOWED: 'Only admins are authorized to access this route!',
  MASTER_ALLOWED: 'Master account is allowed to access this route!',
  USER_ALLOWED: 'User account does not have access to this route!',
  SIGNATURE_INVALID: 'Hmac signature is invalid!',
  EMAIL_FAILED: 'Email sending failed!',
  ACCOUNT_NOT_FOUND: 'Account not found!',
  ACCOUNT_ADDRESS_INVALID: 'User account address is invalid!'
};

exports.AdminMessages = {
  ADMIN_ALREADY_CREATED: 'Broker already created!',
  USER_ALREADY_CREATED: 'User already created!',
  ACCOUNT_CREATED: ' Account created successfully!',
  ACCOUNT_UPDATED: ' Account updated successfully!',
  ADMIN_ACCOUNT_CREATED: 'Broker created and invitation sent successfully',
  ADMIN_ACCOUNT_UPDATED: 'Broker account updated successfully!',
  ADMIN_ACCOUNT_NOT_CREATED: 'Could not create admin account!',
  USER_ACCOUNT_NOT_CREATED: 'Could not create user account!',
  ADMIN_ACCOUNT_NOT_UPDATED: 'Could not update admin account!',
  USER_ACCOUNT_NOT_UPDATED: 'Could not update user account!',
  ADMIN_FETCHED: 'Admin fetched successfully!',
  USER_FETCHED: 'User fetched successfully!',
  ADMIN_NOT_FETCHED: 'Could not fetch admins!',
  USER_NOT_FETCHED: 'Could not fetch users',
  EMAIL_EXIST: 'Email already taken!, Please choose a different email address!',
  RESENT_INVITATION: 'Invitation sent successfully!'
};

exports.AuthMessages = {
  INVALID_USERNAME_AND_PASSWORD: 'Invalid username or password!',
  ACCOUNT_SUSPENDED: 'You are suspended, Please contact Admin!',
  LOGIN_SUCCESSFUL: 'User logged in successfully!',
  RESET_PASSWORD_EMAIL_SENT:
    'Reset password email sent successfully, Please Check your email!',
  CONFIRMATION_TOKEN_INVALID: 'Confirmation token in invalid!',
  ACCOUNT_VERIFIED: 'Your account has been verified successfully!',
  ACCOUNT_NOT_VERIFIED: 'Your account has not been verified successfully!'
};
exports.UserMessages = {
  FAILED_TO_SAVE_USER: 'Failed to create user account!',
  USER_ACCOUNT_CREATED: 'User account was created successfully!',
  USER_ALREADY_EXISTS: 'User already exists!',
  USER_NOT_FOUND: 'Could not find user',
  USER_FOUND: 'User found',
  CODE_MISMATCH: 'Code mismatch!',
  FAILED_TO_CONFIRM_USER: 'Failed to confirm user!',
  FAILED_TO_UPDATE_USER: 'Failed to update user!',
  USER_ACCOUNT_UPDATED: 'Account updated successfully!',
  EXPIRE_CODE: 'Code Expired!',
  FAILED_TO_CHANGE_PASSWORD: 'Failed to change password!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  ACCOUNT_SUSPENDED: 'Account suspended successfully!',
  ACCOUNT_UNSUSPENDED: 'Account unsuspended successfully!',
  NOT_DELETED: 'Could not delete account!',
  DELETED: 'User account  deleted successfully!',
  ROLE_ASSIGNED: 'Role assigned successfully!',
  ROLE_NOT_ASSIGNED: 'Could not assign role!',
  MANAGER_ONLY: 'Only manager role can be assigned!',
  ALREADY_MANAGER: 'Could not reassign already a manager',
  ONLY_ADMIN: 'Only admin can enable or disable'
};
exports.MailerMessages = {
  SUBJECT: 'Welcome to Brokers',
  FROM: `Brokers<process.env.MAILER_EMAIL>`,
  SUCCESSFULLY_RESET_PASSWORD: 'Successfully Reset Password',
  RESET_PASSWORD: 'Reset your password'
};
exports.ValidationMessages = {
  EMAIL_VALIDATE: 'Please provide a valid email address!',
  EMAIL_REQUIRED: 'Email is required!',
  PASSWORD_REQUIRED: 'Password is required!',
  PASSWORD_LENGTH: 'Password must be between 8-40 characters long!',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm Password is required!',
  CONFIRMATION_TOKEN_REQUIRED: 'Confirmation token is required!',
  PASSWORD_NOT_MATCHED: 'Password is not match!',
  FIRST_NAME_REQUIRED: 'First Name is required!',
  LAST_NAME_REQUIRED: 'Last Name is required!',
  Id_REQUIRED: 'Id is required!',
  Id_NOT_VALID: 'Id is not valid!',
  ENABLED_REQUIRED: 'Enabled field is required!',
  ENABLED_NOT_VALID:
    'Please provide (true or false) enabled or disabled account!',
  NAME_REQUIRED: 'Chain name is required',
  ABBREV_REQUIRED: 'Chain abbrevation is required',
  CONTRACT_ADDRESS: 'Contract Address is required',
  WALLET_ADDRESS: 'Wallet address is required',
  API_KEY: 'Api Key is required'
};
exports.CHAINS = ['bsc', 'matic', 'avax-c'];
exports.ChainMessages = {
  CHAIN_CREATED: 'Chain created successfuly',
  CHAIN_NOT_CREATED: 'Could not create chain',
  CHAIN_UPDATED: 'Chain updated successfuly',
  CHAIN_NOT_UPDATED: 'Could not update chain',
  CHAIN_EXISTS: 'Chain already exists',
  CHAIN_ALREADY_UPDATED: 'Chain already updated',
  CHAIN_NOT_EXISTS: 'Chain does not exist',
  NOT_SUSPENDED: 'Could not suspend chain',
  FETCHED: 'Chains fetched successfully!',
  SUSPENDED: 'Chain suspended succesfully',
  UN_SUSPENDED: 'Chain unsuspended succesfully',
  CHAINS_SYNC: 'Chains syncronized',
  CHAINS_NOT_SYNC: 'Could not syncronize chains',
  CHAINS_TO_SELECT: "Chain names must be 'bsc', 'matic', 'avax - c'"
};
exports.ChainAccountMessages = {
  CREATED: 'Chain account created successfully!',
  UPDATED: 'Chain account updated successfully!',
  NOT_CREATED: 'Could not created chain account!',
  NOT_FOUND: 'Could not find chain account!',
  USER_NOT_CREATED: 'Could not created chain user account!',
  NOT_UPDATED: 'Could not updated chain!',
  FETCHED: 'Chain accounts fetched successfully!',
  NOT_FETCHED: 'Could not fetch chain accounts!',
  SUSPENDED: 'Chain account disabled successfully!',
  UNSUSPENDED: 'Chain account enabled successfully!',
  NOT_DELETED: 'Chain cannot be deleted due to trading account exist!',
  DELETED: 'Chain deleted successfully!'
};
exports.FarmMessages = {
  FAILED_TO_SAVE_FARM: 'Failed to save farm!',
  FARM_CREATED: 'Farm created successfully!',
  FARM_ALREADY_EXIST: 'Farm already exists!',
  FAILED_TO_FIND_FARM: 'Failed to find farm list',
  FAILED_TO_UPDATE_FARM: 'Failed to update farm',
  FAILED_TO_SUSPEND_UNSUSPEND_FARM: 'Failed to suspend or unsuspend farm',
  FARM_UPDATED: 'Farm updated successfully',
  FAILED_TO_DELETE_FARM: 'Failed to delete farm',
  FARM_DELETED: 'Farm deleted successfully!',
  FARM_LIST_NOT_FOUND: 'Farm list not found',
  FARM_NOT_FOUND: 'Could not find farm to suspend or unsuspend ',
  SUSPENDED: 'Farm disabled successfully!',
  UNSUSPENDED: 'Farm enabled successfully!',
  RISK_ASSIGNED: 'Risk number assigned successfully!',
  RISK_NOT_ASSIGNED: 'Could not assign risk number!'
};

exports.RoleMessages = {
  ROLE_NOT_FOUNND: 'Role not found',
  ROLE_FETCHED: 'Roles fetched successfully!',
  ROLE_EXISTS: 'Role already exist',
  ROLE_CREATED: 'Role created successfully!',
  ROLE_NOT_CREATED: 'Could not create role!'
};

exports.GraphQlURLS = {
  GET_CHAINS: process.env.SERVER_URL + '/admin/chain',
  GET_CHAIN_ACCOUNTS: process.env.SERVER_URL + '/admin/chainAccounts/',
  CREATE_CHAIN: process.env.SERVER_URL + '/admin/chain',
  UPDATE_CHAIN: process.env.SERVER_URL + '/admin/chain/',
  GET_USERS: process.env.SERVER_URL + '/admin/admins',
  CREATE_USER: process.env.SERVER_URL + '/admin/admins',
  UPDATE_USER: process.env.SERVER_URL + '/admin/admins/',
  ENABLE_DISABLE_USER: process.env.SERVER_URL + '/admin/admins/enabled',
  ENABLE_DISABLE_FARM: process.env.SERVER_URL + '/admin/farms/enabled',
  ASSIGN_RISK_NUMBER: process.env.SERVER_URL + '/admin/farms/assignRisk',
  ASSIGN_MANAGER_ROLE: process.env.SERVER_URL + '/admin/admins/assignRole/',
  GET_FARMS: process.env.SERVER_URL + '/admin/farms/',
  SYNC_FARMS: process.env.SERVER_URL + '/admin/farms/syncFarms'
};

exports.CryptStakeURLS = {
  GET_CHAINS: process.env.CRYPT_STAKE_URL + '/chains',
  CREATE_ACCOUNT: process.env.CRYPT_STAKE_URL + '/account',
  ACTIVATE_ACCOUNT: process.env.CRYPT_STAKE_URL + '/account',
  STAKE:
    process.env.CRYPT_STAKE_URL +
    '/tx/{chain}/{yieldAggregator}/{version}/{farm}/stake',
  UNSTAKE:
    process.env.CRYPT_STAKE_URL +
    '/tx/{chain}/{yieldAggregators}/{version}/{farm}/unstake'
};
