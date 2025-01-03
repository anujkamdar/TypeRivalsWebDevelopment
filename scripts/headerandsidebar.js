import {
    app,
    auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,
    db, getDatabase, ref, set, get, push
} from './firebaseinit.js';






if (document.querySelector('.header')) {
    const logOutBtn = document.querySelector('.logout');
    const publicProfileBtn = document.querySelector(".public-profile");
    
    publicProfileBtn.addEventListener("click", (e) => {
        console.log(e)
        window.location.href = "publicprofile.html"
      })

    logOutBtn.addEventListener('click', async () => {
        await signOut(auth)
        window.location.href = "index.html"
    })
}






if (document.querySelector('.sidebar')) {
    const goToDashboard = document.querySelector('#dashboard');
    const goToHistory = document.querySelector("#history");
    const goToLeaderboard = document.querySelector("#leaderboard");
    const goToBlogs = document.querySelector('#blogs');


    // let sideBarElements = document.querySelectorAll('.side-bar-element')
    // for (let i = 0; i < sideBarElements.length; i++) {
    //     sideBarElements[i].addEventListener("click", () => {
    //         for (let j = 0; j < sideBarElements.length; j++) {
    //             sideBarElements[j].classList.remove('.selected-sidebar-element')
    //         }
    //         sideBarElements[i].classList.add('selected-sidebar-element')
    //     })
    // }


    goToDashboard.addEventListener("click", () => {
        window.location.href = "dashboard.html"
    })

    goToHistory.addEventListener("click", () => {
        window.location.href = "historypage.html"
    })

    goToLeaderboard.addEventListener("click", () => {
        window.location.href = "leaderboard.html"
    })

    goToBlogs.addEventListener("click", () => {
        window.location.href = "blogpage.html"
    })
}




