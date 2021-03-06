const mongoose  = require( 'mongoose' );
const validator = require( 'validator' );
const jwt       = require( 'jsonwebtoken' );
const _         = require( 'lodash' );
const bcrypt    = require( 'bcryptjs');


const UserSchema = mongoose.Schema( {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
} )

UserSchema.methods.toJSON = function () {
    const user       = this;
    const userObject = user.toObject();
    return _.pick( userObject, [ '_id', 'email' ] );
}

UserSchema.methods.generateAuthToken = function () {
    const user   = this;
    const access = 'auth';
    const token  = jwt.sign( {_id: user._id.toHexString(), access},  process.env.JWT_SECRET ).toString();

    user.tokens.push( {access, token} );
    return user.save().then( () => {
        return token;
    } )
};

UserSchema.methods.removeToken = function(token) {
    const user = this;
    return user.update({
        $pull:{
            tokens:{token}
        }
    })
};

UserSchema.statics.findByToken = function ( token ) {
    const User = this;

    let decoded;
    try {
        decoded = jwt.verify( token,  process.env.JWT_SECRET );
    } catch ( e ) {
        return Promise.reject();
    }

    const user = User.findOne( {
        '_id': decoded._id,
        'tokens.access': 'auth',
        'tokens.token': token
    } );
    return Promise.resolve( user );
};

UserSchema.statics.findByCredentials = function (email, password){
  const User = this;

  return User.findOne({email}).then(user=>{
      if(! user) {
          return Promise.reject()
      }
      return new Promise((resolve, reject) => {
          bcrypt.compare(password,user.password, (err, res) => {
              if(err || !res){
                  reject();
              }
              resolve(user);
          });
      })
  })
};

UserSchema.pre( 'save', function ( next ) {
    const user = this;

    if ( user.isModified( 'password' ) ) {
        bcrypt.genSalt( 10, ( err, salt ) => {
            bcrypt.hash( user.password, salt, ( err, hashedPassword ) => {
                user.password = hashedPassword;
                next();
            } )
        } )
    } else {
        next();
    }
} )

const User = mongoose.model( 'User', UserSchema );

module.exports = {
    User
}