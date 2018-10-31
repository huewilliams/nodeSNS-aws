const express = require('express');
const passport = require('passport');
const bcrypt= require('bcrypt');
// 사용자의 접근을 제한하는 메서드를 불러옴
const { isLoggedIn , isNotLoggedIn} = require('./middlewares');
const { User } = require('../models');

const router = express.Router();
router.post('/join', isNotLoggedIn , async (req, res, next)=>{
    const { email, nick, password } = req.body;
    try{
        const exUser = await User.find({ where : { email }});
        if (exUser) {
            req.flash('joinError', '이미 가입된 이메일입니다.');
            return res.redirect('/join');
        }
        // bcrypt 모듈을 사용하여 비밀번호를 암호화함, 두번째 인자 : hash(암호화)메서드 반복횟수 - 12~31
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password : hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn ,  (req, res, next)=>{
    // local 로그인 전략을 수행함
    passport.authenticate('local', (authError , user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        // passport 는 req 객체에 login 과 logout 메서드를 추가한다.

        // 두 번째 인자가 있다면 로그인을 성공했으므로 req.login 을 호출한다.
        return req.login(user, (loginError)=>{
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

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