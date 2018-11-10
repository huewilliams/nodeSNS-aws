
// 카카오 로그인을 처리하는 파일
const kakao = require('./kakaoStrategy');
// 사용자의 정보를 활용하기 위해 User 모델을 불러옴
const {User} = require('../models');

module.exports = (passport) => {
    // req.session 객체에 값을 넣음
    passport.serializeUser((user, done)=>{
        // done(첫 번째 인자 : 에러시 사용, 두 번째 인자 : 저장할 데이터
        // 세션에 사용자의 아이디만 저장함
        done(null, user.id);
    });

    // passport.session() 미들웨어가 매 요청시 호출함
    // serializeUser 에서 세션에 등록한 아이디로 데이터베이스에서 사용자정보를 조회함
    passport.deserializeUser((id, done)=>{
        User.find({where : {id},
            include: [{
                model : User,
                attributes : ['id', 'nick'],
                as : 'Followers',
            }, {
                model : User,
                attributes : ['id', 'nick'],
                as : 'Followings',
            }],
        })
            .then(user => done(null, user))
            // 조회한 정보를 req.user 에 저장함 -> req.user 를 통해 저장한 사용자의 정보를 가져올 수 있음
            .catch(err => done(err));
            // 첫 번째 매개변수로 에러를 전달함
    });
    kakao(passport);
};
