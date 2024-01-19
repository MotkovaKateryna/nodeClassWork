const { model, Schema } = require('mongoose');
const { genSalt, hash, compare } = require('bcrypt');

const crypto = require('crypto');

const { userRolesEnum } = require('../constants');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'Dublicated email...']
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  year: Number,
  role: {
    type: String,
    enum: Object.values(userRolesEnum),
    default: userRolesEnum.USER,
  },
  avatar: String,
}, {
  timestamps: true,
  versionKey: false,
});
// pre save hook. Fires on "save" and "create"
userSchema.pre('save', async function(next) {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');

    this.avatar = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=identicon`;
  }
  if (!this.isModified('password')) return next();
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  // const passwordValid = await compare('Pass_1289', passwHash);

  next();
});

// userSchema.pre(/^find/, () => { // пошук всіх виразів що містять find і там цей хук відпрацює

// });

userSchema.methods.checkPassword = (candidate, passwHash) => compare(candidate, passwHash);

const User = model('User', userSchema);

module.exports = User;
