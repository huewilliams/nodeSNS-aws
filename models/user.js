module.exports = (sequelize, DataTypes) =>(
    sequelize.define('user', {
        email : {
            type : DataTypes.STRING(40),
            allowNull: false,
            unique : true,
        },
        nick : {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        password : {
            type: DataTypes.STRING(100),
            allowNull : true,
        },
        provider: { // 로그인이 local 인지 kakao 인지 판단
            type : DataTypes.STRING(10),
            allowNull : false,
            defaultValue : 'local',
        },
        snsId : {
            type : DataTypes.STRING(30),
            allowNull : true,
            defaultValue: 'local',
        },
    }, {
        timestamps : true,
        paranoid : true,
        charset : 'utf8',
        collate : 'utf8_general_ci',
    })
);