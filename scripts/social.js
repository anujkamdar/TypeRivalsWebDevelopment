import {
  app,
  auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,
  db, getDatabase, ref, set, get, push, onValue
} from './firebaseinit.js';

if (document.querySelector('.header') && document.querySelector('.social')) {
  onAuthStateChanged(auth, async (user) => {
    const uid = user.uid;
    let usersSnap = await get(ref(db, `users`))
    let allUserData = usersSnap.val()
    console.log(allUserData);







    let snapshot = await get(ref(db, `users/${uid}`));
    let userData = snapshot.val();
    let friendListObject = userData["friends"];
    let friends = [];
    for (let key in friendListObject) {
      friends.push(friendListObject[key]);
    }



    document.querySelector('.progress-div').remove();



    document.querySelector('.social').innerHTML =
      `
                    <div class="wrapper-to-center">
                    <div class="selection">
                        <div class="tab" id="AllTab">All Users</div>
                        <div class="tab" id="friendsTab">Friends</div>
                    </div>
                </div>  
    `



    const userGrid = document.createElement('div');
    userGrid.classList.add('user-grid')
    document.querySelector('.social').appendChild(userGrid)
    const goToAll = document.querySelector('#AllTab');
    const goToFriends = document.querySelector('#friendsTab');



    let profileLinks;
    let addFriendBtns;


    const updateUi = () => {
      userGrid.innerHTML = "";


      for (let otheruserDataId in allUserData) {
        const otheruserData = allUserData[otheruserDataId];
        const profilePicUrl = otheruserData.imageUrl;
        const username = otheruserData.username;
        const city = otheruserData.city;




        const userCard = document.createElement('div');
        userCard.classList.add('profie-card');


        userCard.innerHTML = `
                          <div class="profile-pic-container">
                          <img src="${profilePicUrl}">
                      </div>
                      <div id=${otheruserDataId} class="person-info">
                          <h3 class="profile-link">${username}</h3>
                          <div><img src="icons/gps-svgrepo-com (3).svg"><p>${city}</p></div>
                          <button class = "add-friend-btn"><img src="" alt="">Add friend</button>
                      </div>
      `
        for (let friendUid of friends) {
          if (otheruserDataId == friendUid) {
            userCard.innerHTML = `
            <div class="profile-pic-container">
            <img src="${profilePicUrl}">
        </div>
        <div id=${otheruserDataId} class="person-info">
            <h3 class="profile-link">${username}</h3>
            <div><img src="icons/gps-svgrepo-com (3).svg"><p>${city}</p></div>
            <button class = "already-friends"><img src="" alt="">Friend</button>
        </div>
  `

          }


        }
        userGrid.appendChild(userCard);
      }
      profileLinks = document.querySelectorAll(".profile-link");
      addFriendBtns = document.querySelectorAll(".add-friend-btn");


      for (let addFriendBtn of addFriendBtns) {
        addFriendBtn.addEventListener("click", async (e) => {
          await push(ref(db, `users/${uid}/friends`), e.target.parentElement.id);
          friends.push(e.target.parentElement.id);
          alert(`${allUserData[e.target.parentElement.id]["username"]} has been added to your friend list`);
          console.log(e.target.parentElement.id);
          updateUi();
        })

      }

      for (let profileLink of profileLinks) {
        profileLink.addEventListener("click", (e) => {
          localStorage.setItem("otherPersonUid", e.target.parentElement.id)
          window.location.href = "otheruserprofile.html"

        })
      }

    }

    updateUi();

    const makeFriendTab = () => {
      userGrid.innerHTML = "";


      for (let friendId of friends) {
        const otheruserData = allUserData[friendId];
        const profilePicUrl = otheruserData.imageUrl;
        const username = otheruserData.username;
        const city = otheruserData.city;




        const userCard = document.createElement('div');
        userCard.classList.add('profie-card');



        userCard.innerHTML = `
            <div class="profile-pic-container">
            <img src="${profilePicUrl}">
        </div>
        <div id=${friendId} class="person-info">
            <h3 class="profile-link">${username}</h3>
            <div><img src="icons/gps-svgrepo-com (3).svg"><p>${city}</p></div>
            <button class = "already-friends"><img src="" alt="">Friend</button>
        </div>
  `





        userGrid.appendChild(userCard);
      }


      profileLinks = document.querySelectorAll(".profile-link");

      for (let profileLink of profileLinks) {
        profileLink.addEventListener("click", (e) => {
          localStorage.setItem("otherPersonUid", e.target.parentElement.id)
          window.location.href = "otheruserprofile.html"

        })
      }

    }

    goToAll.addEventListener("click", updateUi);
    goToFriends.addEventListener("click", makeFriendTab);
    (document.querySelector('.header .public-profile')).innerHTML =
      `
      <img src="${userData.imageUrl}">
      <p>${userData.username}</p>
      `;

  })
}