// 로그인 되었는지 확인하는 메서드
exports.isLoggedIn = (req, res, next)=>{
    if ( req.isAuthenticated()) {
        // 로그인 중이면 req.isAuthenticate() 가 true 이고 아니면 false 이다.
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

// 로그인이 되지 않은 상태인지 확인하는 메서드
exports.isNotLoggedIn = (req, res, next)=>{
    if ( ! req.isAuthenticated()) {
        // 로그인 중이면 req.isAuthenticate() 가 true 이고 아니면 false 이다.
        next();
    } else {
        res.redirect('/');
    }
};
