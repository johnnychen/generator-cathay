module.exports = mongoose => {
    const UserSchema = new mongoose.Schema({
        name: {type: String},
        mobile: {type: String}
    });

    return mongoose.model('User', UserSchema);
}