const LocalStrategy = require('passport-local').Strategy;
// passport-local 모듈에서 Strategy 생성자를 불러와 사용한다.
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
    // 첫 번째 인자는 객체의 전략에 관한 설정이다.
    passport.use(new LocalStrategy({
        // 대응되는 req.body 의 속성명을 넣어준다.
        usernameField : 'email',
        passwordField : 'password',
    }, async (email, password, done) => {
        // done 함수는 passport.authenticate 의 콜백함수이다.
        try {
            const exUser = await User.find({where : {email}});
            if (exUser)
            {
                const result = await bcrypt.compare(password, exUser.password);
                if (result)
                {
                    done(null, exUser);
                } else {
                    done(null, false, {message : '비밀번호가 일치하지 않습니다.'});
                }
            } else{
                done(null, false, {message : '가입되지 않은 회원입니다.'});
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};