import {
  app,
  auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,
  db, getDatabase, ref, set, get, push
} from './firebaseinit.js';


if (document.querySelector(".signin") && document.querySelector(".signup")) {
  // ye dikkat de rha h user data save hone me will see later this problem
  // onAuthStateChanged(auth,(user) => {
  //   if(user){
  //     window.location.href = "dashboard.html"
  //   }
  // })
  const body = document.querySelector("body");
  const openSignInBtn = document.querySelector(".signin");
  const openRegisterBtn = document.querySelector(".signup");
  const signUpModal = document.querySelector(".sign-up-modal");
  const signInModal = document.querySelector(".sign-in-modal");
  const signInCloseBtn = document.querySelector(".sign-in-modal .close");
  const signUpCloseBtn = document.querySelector(".sign-up-modal .close");
  const signInForm = document.querySelector(".sign-in-modal form");
  const signUpForm = document.querySelector(".sign-up-modal form");
  const signinBtn = document.querySelector(".sign-in-modal button");
  const registerBtn = document.querySelector(".sign-up-modal button");
  const modalContents = document.querySelectorAll(".modal-content")

  openSignInBtn.addEventListener("click", () => {
    signInModal.style.display = "flex";
    body.style.overflow = "hidden";
  });


  signInCloseBtn.addEventListener("click", () => {
    signInModal.style.display = "none";
    body.style.overflow = "";
  });

  openRegisterBtn.addEventListener("click", () => {
    signUpModal.style.display = "flex";
    body.style.overflow = "hidden";
  });

  signUpCloseBtn.addEventListener("click", () => {
    signUpModal.style.display = "none";
    body.style.overflow = "";
  });



  const fileInput = document.querySelector('#profile-picture');
  const preview = document.querySelector('.image-preview');
  let profilePicture;

  // Display Image Preview
  // learn this aache se abhi toh saw a video
  fileInput.addEventListener('change', () => {
    profilePicture = fileInput.files[0];
    console.log(profilePicture)

    if (profilePicture) {
      const reader = new FileReader();
      reader.readAsDataURL(profilePicture);
      reader.onload = function (e) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      };
    }
  });



  registerBtn.addEventListener("click", async (e) => {
    e.preventDefault()
    const username = signUpForm.username.value
    const email = signUpForm.email.value
    const password = signUpForm.password.value
    let city = signUpForm.city.value
    if (!username) {
      alert("Enter Username");
      return;
    }
    if (!email) {
      alert("Enter Email");
      return;
    }
    if (!password) {
      alert("Enter Password");
      return;
    }
    if (!city) {
      alert("Enter City");
      return;
    }
    if (!profilePicture) {
      alert("Upload Profile Picture");
      return;
    }

    city = city.charAt(0).toUpperCase() + city.slice(1);
    for (let modalContent of modalContents) {
      console.log(modalContent)
      modalContent.classList.add("center-align-progress")
      modalContent.innerHTML = "<progress></progress>"
    }


    try {
      let imageUrl = await uploadToCloudinary(profilePicture);
      console.log(imageUrl);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      signUpForm.reset();
      const uid = cred["user"]["uid"];
      await saveDataofNewUser(username, email, uid, city, imageUrl)
      window.location.href = "dashboard.html";
    }
    catch (error) {
      console.log(error.message);
      alert(error.message);
      window.location.href = "index.html"
    }

      
  })


  signinBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = signInForm.email.value;
    const password = signInForm.password.value;

    for (let modalContent of modalContents) {
      console.log(modalContent)
      modalContent.classList.add("center-align-progress")
      modalContent.innerHTML = "<progress></progress>"
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred["user"]["uid"]
      window.location.href = "dashboard.html";
    }
    catch (error) {
      console.log(error.message);
      alert(error.message);
      window.location.href = "index.html"
    }
  })

  // ye to local function global kuch use nhi kiya isme 
  const saveDataofNewUser = async (username, email, uid, city, imageUrl) => {
    try {
      const userRef = ref(db, `users/${uid}`);
      await set(userRef, {
        username: username,
        email: email,
        // i think so iski jaruart nhi h will see later
        contests: "",
        totalTestsTaken: 0,
        bestWPM: 0,
        city: city,
        imageUrl: imageUrl
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  // if time allows  see deeper in docs abhi toh just by the official video

  const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ml_default');

    const responce = await fetch("https://api.cloudinary.com/v1_1/djxunz1zm/image/upload",
      { method: "post", body: formData }
    )
    const data = await responce.json();
    return data.secure_url;
  }
}