import actionTypes from '../actions/actionTypes';

const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

const initialState = {
    isLoggedIn: !!storedToken,
    adminInfo: null,
    adminPersist: null,
    token: null,
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADMIN_LOGIN_OR_REGISTER:
            return {
                ...state,
                isLoggedIn: true,
                adminInfo: action.adminInfo,
                adminPersist: action.adminInfo,
                token: storedToken
            };

        case actionTypes.ADMIN_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                adminInfo: null,
                adminPersist: null,
                token: null,
            };

        default:
            return state;
    }
};

export default adminReducer;