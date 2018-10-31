module.exports = (sequelize, DataTypes) => (
    // 해시태그로 검색하기 위해 따로 모델을 정의함
    sequelize.define('hashtag', {
        title : {
            type : DataTypes.STRING(15),
            allowNull : false,
            unique : true,
        },
    }, {
        timestamps : true,
        paranoid : true,
        charset : 'utf8',
        collate : 'utf8_general_ci',
    })
);