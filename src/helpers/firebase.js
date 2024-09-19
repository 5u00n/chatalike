import firebase from "firebase/compat/app";
// Add the Firebase products that you want to use
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/storage";
import { data } from "autoprefixer";

class FirebaseAuthBackend {
  constructor(firebaseConfig) {
    if (firebaseConfig) {
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          localStorage.setItem("authUser", JSON.stringify(user));
        } else {
          localStorage.removeItem("authUser");
        }
      });
    }
  }

  /**
   * Registers the user with given details
   */
  registerUser = (email, password, userData) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          async (user) => {
            userData.id = user.user.uid;
            await this.setupIfNoUserData(userData);
            resolve(firebase.auth().currentUser);
          },
          (error) => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * Login user with given details
   */
  loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(
          (user) => {
            resolve(firebase.auth().currentUser);
          },
          (error) => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = (email) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .sendPasswordResetEmail(email, {
          url: window.location.protocol + "//" + window.location.host + "/login",
        })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  setLoggeedInUser = (user) => {
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!localStorage.getItem("authUser")) return null;
    return JSON.parse(localStorage.getItem("authUser"));
  };

  getDatabase = () => {
    return firebase.database();
  };

  uploadFileReturnURL = (file, path) => {
    return new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(path + file.name);
      fileRef
        .put(file)
        .then((snapshot) => {
          snapshot.ref.getDownloadURL().then((url) => {
            resolve(url);
          });
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  setupIfNoUserData = (user) => {
    return new Promise(async (resolve, reject) => {
      if (!user) {
        return;
      }

      if (user.photoFile) {
        const url = await this.uploadFileReturnURL(user.photoFile, user.id + "/profilePictures/");
        user.photoURL = url;
      }

      const db = this.getDatabase();

      db.ref("users/" + user.id)
        .set({
          id: user.id,
          email: user.email ? user.email : "",
          name: user.username,
          profilePicture: user.photoURL ? user.photoURL : "",
          status: "online",
          about: user.about,
          createdAt: new Date().getTime(),
          unRead: 0,
          isTyping: false,
          lastMessage: "",
          lastMessageTime: "",
          roomType: user.roomType ? user.roomType : "single",
          isGroup: user.isGroup ? user.isGroup : false,
        })
        .then(() => {
          db.ref("contacts/" + user.id).set({
            id: user.id,
            name: user.username,
            email: user.email ? user.email : "",
          });
          resolve(true);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error) {
    // var errorCode = error.code;
    var errorMessage = error.message;
    return errorMessage;
  }
}

let _fireBaseBackend = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = (config) => {
  if (!_fireBaseBackend) {
    _fireBaseBackend = new FirebaseAuthBackend(config);
  }
  return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = () => {
  return _fireBaseBackend;
};

export { initFirebaseBackend, getFirebaseBackend };
