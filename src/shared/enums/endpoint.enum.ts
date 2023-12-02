export enum Endpoint {
    // auth
    SIGN_IN = 'signIn',
    SIGN_UP = 'signUp',

    // user
    USER_GET = 'userGet',
    USER_GET_ALL = 'userGetAll',
    USER_UPDATE = 'userUpdate',
    USER_REMOVE = 'userRemove',

    // permission
    PERMISSION_GET = 'permissionGet',
    PERMISSION_GET_ALL = 'permissionGetAll',
    PERMISSION_UPDATE = 'permissionUpdate',
    PERMISSION_REMOVE = 'permissionRemove',

    // assign permission
    ASSIGN_PERMISSION = 'assignPermission',
}