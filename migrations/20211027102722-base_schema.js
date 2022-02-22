module.exports = {
    async up(db) {
        // TODO write your migration here.
        await db.createCollection('users');
        await db.collection('users').createIndex({ email: 1 });
        await db.collection('users').createIndex({ role: 1 });

        await db.createCollection('refreshTokens');
        await db.collection('refreshTokens').createIndex({ userId: 1 });
        await db.collection('refreshTokens').createIndex({ expires: 1 });

    },

    async down(db) {
        await db.dropCollection('users');
        await db.dropCollection('refreshTokens');
    },
};
