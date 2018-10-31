const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config') [env];
// 환경에 맞는 설정값을 가져옴 (development)
const db = {};

// sequelize 객체 생성 및 config.json 의 설정값으로 초기화
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

// User 모델과 Post 모델은 1:N 관계이므로 hasMany 와 belongsTo 로 연결됨
// 시퀄라이즈는 Post 모델에 userId 컬럼을 추가한다.
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

// Post 와 Hashtag 모델은 N:M 관계이므로 belongsToMany 메서드로 정의한다.
// N:M 관계에서는 시퀄라이즈가 관계를 분석하여 중간에 PostHashtag 관계테이블을 생성한다.
// 컬럼이름은 postId 와 HashtagId 이다.
db.Post.belongsToMany(db.Hashtag, { through : 'PostHashtag'});
db.Hashtag.belongsToMany(db.Post, { through : 'PostHashtag'});

// 같은 테이블 끼리도 N:M 관계를 가질 수 있다.
// 같은 테이블간 N:M 관계에서는 모델 이름과 컬럼 이름을 따로 설정해 주어야 한다.(누가 팔로워고 팔로잉 중인지 구분하기 위해)
db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
    // as 에 등록한 이름을 바탕으로 시퀄라이즈가 get/add 메서드를 추가한다.
    as: 'Followers',
    through : 'Follow',
});

db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
    as: 'Followings',
    through: 'Follow',
});

module.exports = db;