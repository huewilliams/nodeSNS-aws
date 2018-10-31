// post.js : 게시물을 업로드 할 때 post 메서드로 요청되는 주소를 처리한다.

const express = require('express');
// multer 는 미들웨어 역할을 하며 앱 전체에 붙지는 않지만 multipart 데이터를 업로드하는 라우터에서 사용한다.
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require('../models');
 const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// fs 모듈로 이미지를 업로드 할 때 업로드 대상 폴더가 없다면 자동으로 생성한다.
fs.readdir('uploads', (error)=>{
    if (error)
    {
        console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
        fs.mkdirSync('uploads');
    }
});

// upload 는 미들웨어를 만드는 객체가 된다.
const upload = multer({
    // storage : 파일 저장 박식, 경로 , 파일명 등을 설정할 수 있다.
    storage : multer.diskStorage({
        // diskStorage : 이미지가 서버디스크에 저장함
        destination(req, file, cb) {
            cb(null, 'uploads/'); // destination : 저장경로를 uploads 폴더로 지정함
        },
        filename(req, file, cb) {
            // 파일 이름에 기존이름에 업로드 날짜를 붙입
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    // 최대 이미지 파일 용량 허용치(바이트 단위) -> 10MB
    limits : { fileSize : 5 * 1024 * 1024},
});
// single() : multer 의 미들웨어 중 하나, 하나의 이미지를 업로드 할 때 사용하며, req.file 객체에 이미지 저장
router.post('/img', isLoggedIn, upload.single('img'), (req, res)=>{
    console.log(req.file);
    res.json({ url : `img/${req.file.filename}` });
} );

const upload2 = multer();
// none() : 이미지를 올리지 않고 데이터만 multiple 형식으로
router.post('/', isLoggedIn, upload2.none(), async (req, res, next)=>{
    try{
        const post = await Post.create({
            content : req.body.content,
            img : req.body.url,
            userId : req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s]*/g);
        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where : {title : tag.slice(1).toLowerCase()},
            })));
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/hashtag', async (req,res, next)=>{
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.find({where : {title : query}});
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({include : [{ model : User }]});
        }
        return res.render('main', {
            title : `${query} | nodesns`,
            user : req.user,
            twits : posts,
        });
    }
    catch (error) {
        console.error(error);
        return next(error);
    }
});


module.exports = router;
