export const ROUTES = {
    WELCOME: '/welcome',
    LOGIN: '/',
    REGISTER: '/register',
    ADMIN: '/admin',    
    ADDADMIN: '/admin/addAdmin',
    RESTAURANT: '/admin/consultRestaurant/:id',
    //PROXY: 'https://ticomo01.herokuapp.com'
    //PROXY: 'http://localhost:8080'
    PROXY: 'https://notable-wenonah-csreal22.koyeb.app'
}

export const IMAGES = {
    LOGO: 'https://firebasestorage.googleapis.com/v0/b/ticomo01.appspot.com/o/images%2FLogo.png?alt=media&token=7974bbfb-833b-41a7-90a7-264ab0507559',
    LOGO_FONDO: 'https://firebasestorage.googleapis.com/v0/b/ticomo01.appspot.com/o/images%2FLogo_fondo.png?alt=media&token=614cb317-55d6-486c-9561-f5f384c97b6e',
    USER_LOGO: 'https://firebasestorage.googleapis.com/v0/b/ticomo01.appspot.com/o/images%2FUser_logo.png?alt=media&token=6d2ea32b-cf4f-43c6-b876-be050ad9f1d8',
    FONDO_TRANSPARENTE: 'https://firebasestorage.googleapis.com/v0/b/ticomo01.appspot.com/o/images%2FFondo_transparente.png?alt=media&token=4b993355-baa8-4c7e-97f3-1a9c2d454910',
    BACKGROUND: 'https://firebasestorage.googleapis.com/v0/b/ticomo01.appspot.com/o/images%2FBackground.png?alt=media&token=5a7f79c7-c7bb-4717-a9c3-d3e52680b147'
}

export const ROLES = {
    ADMIN: 'ADMIN'.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0),
    RIDER: 'RIDER'.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0),
    CLIENT: 'CLIENT'.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0),
    TELEFONO: 'TELE'.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
}
