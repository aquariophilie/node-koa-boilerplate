const TYPES = {
    MongoClient: Symbol.for('MongoClient'),
    // Models
    User: Symbol.for('User'),
    // Services
    AuthService: Symbol.for('AuthService'),
    UserService: Symbol.for('UserService'),
};

export { TYPES };
