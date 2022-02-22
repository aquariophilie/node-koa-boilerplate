// In this file you can configure migrate-mongo
require('dotenv').config();

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
    mongodb: {
        // TODO Change (or review) the url to your MongoDB:
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017',

        // TODO Change this to your database name:
        databaseName: process.env.MONGODB_NAME || '',

        options: {
            useNewUrlParser: true, // removes a deprecation warning when connecting
            useUnifiedTopology: true, // removes a deprecating warning when connecting
            //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
            //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
            auth: {
                username: process.env.MONGODB_USER || '',
                password: process.env.MONGODB_PASS || '',
            },
        },
    },

    // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
    migrationsDir: 'migrations',

    // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
    changelogCollectionName: 'changelog',

    // The file extension to create migrations and search for in migration dir
    migrationFileExtension: '.js',

    // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
    // if the file should be run.  Requires that scripts are coded to be run multiple times.
    useFileHash: false,
};

// Return the config as a promise
module.exports = config;
