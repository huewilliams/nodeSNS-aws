const express = require('express');
const passport = require('passport');
const { isLoggedIn , isNotLoggedIn} = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.get('/logout', isLoggedIn, (req, res)=>{
    // req.user 객체를 제거한다.
    req.logout();
    // req.session 의 내용을 제거한다.
    req.session.destroy();
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    // 로그인에 실패했을 때 이동하는 경로
    failureRedirect : '/',
}), (req,res) => {
    // 로그인에 성공한 후 에도 이동하는 경로를 콜백으로 지정해줌
    res.redirect('/');
});

module.exports = router;
