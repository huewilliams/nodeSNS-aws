module.exports = (sequelize, DataTypes) => (
    sequelize.define('post', {
        content : {
            type : DataTypes.STRING(140),
            allowNull : false,
        },
        img : {
            type : DataTypes.STRING(200), //이미지 경로 저장
            allowNull : true,
        },
    }, {
        timestamps : true,
        paranoid : true,
        charset : 'utf8',
        collate : 'utf8_general_ci',
    })
);