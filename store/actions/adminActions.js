import actionTypes from './actionTypes';

export const adminLoginOrRegister = (adminInfo) => {
    const storedToken = localStorage.getItem('token');
    return {
        type: actionTypes.ADMIN_LOGIN_OR_REGISTER,
        adminInfo: adminInfo,
        token: storedToken,
    };
};

export const adminLogOut = () => {
    localStorage.removeItem('token');
    return {
        type: actionTypes.ADMIN_LOGOUT,
    };
};