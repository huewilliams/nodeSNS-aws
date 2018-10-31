const express = require('express');
// 로그인 여부, 로그인 아님 여부 판단 메서드
const { isLoggedIn , isNotLoggedIn } = require('./middlewares');
const { Post, User }  = require('../models');

// express 패키지를 이용해 라우터객체 생성
const router = express.Router();

//mysql 모듈 사용
const mysql = require('mysql');

// 연결한 DB 정보 입력
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'espada8012!',
    database: 'nodesns',
    port : '3306',
});

// 데이터베이스 연결
connection.connect();

router.get('/profile', isLoggedIn , (req, res)=>{
    res.render('profile', {title : '내 정보 - NodeSNS', user: req.user });
});

router.get('/join', isNotLoggedIn , (req,res)=>{
    res.render('join', {
        title : '회원가입 - NodeSNS',
        user : req.user,
        // pug 에서 user 객체를 통해 사용자의 정보에 접근 할 수 있다.
        // (passport/index.js)에서 passport.deserializeUser()를 통해 req.user에 user의 id를 저장했다.
        joinError : req.flash('joinError'),
    });
});

router.get('/', (req, res, next)=>{
   Post.findAll({
       include : {
           model : User,
           attributes : ['id', 'nick'],
       },
       order : [['createdAt', 'DESC']],
   })
       .then((posts) =>{
         res.render('main', {
             title : 'nodeSNS',
             // 게시물을 조회한 결과를 twits 에 넣어 렌더링한다.
             twits : posts,
             user : req.user,
             loginError : req.flash('loginError'),
         });
       })
       .catch((error)=>{
           console.error(error);
           next(error);
       });
});

router.get('/delete/:id/follow', isLoggedIn, async (req,res,next)=>{
    console.log(req.params.id);
    try {
        connection.query('DELETE FROM follow WHERE followingId ='+req.params.id, (error, results, fields)=> {
            console.log(results);
            res.redirect('/profile');
        });
    }
    catch(error) {
        console.error(error);
        return next(error);
    }
});

router.get('/update/:id/post', isLoggedIn, async (req, res, next)=>{
    console.log('req.id : ',req.params.id);

})

router.get('/delete/:id/post', isLoggedIn, async (req,res,next)=>{
    console.log(req.params.id);
    try{
        const post = await Post.find({where : {id : req.params.id}});
        console.log('post.id : ',post.userId);
        console.log('user.id : ',req.user.id);
        if(post.userId == req.user.id)
        {
            Post.destroy({where : {userId : req.user.id, id : req.params.id}});
            res.redirect('/');
        }
        else
        {
            throw new Error('다른 사용자들의 게시물은 삭제할 수 없습니다');
        }
    }
    catch(error) {
        console.error(error);
        return next(error);
    }
});

router.get('/update/profile', isLoggedIn, async(req,res,next)=>{
    console.log('success');
    res.render('update', {
        title: 'nodeSNS',
        user: req.user,
    });
});

router.post('/decide/profile', isLoggedIn, async(req,res,next)=>{
    const { nick } = req.body;
    nick.toString();
    try{
        console.log('nick : ',nick);
        User.update({
            nick : nick,
        }, {
            where : {id : req.user.id},
        });
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});
module.exports = router;