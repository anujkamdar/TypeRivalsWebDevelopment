import {
  app,
  auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,
  db, getDatabase, ref, set, get, push
} from './firebaseinit.js';

if (document.querySelector(".header") && document.querySelector(".verify-history-page")) {
  const goToDashboard = document.querySelector("#dashboard");
  const contestHistoryDiv = document.querySelector(".contest-history");
  const usercontestIds = [];

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      let snapshot = await get(ref(db, `users/${uid}`));
      let userData = snapshot.val();
      const username = userData['username']
      const userContests = userData['contests'];
      // console.log(userContests);

      document.querySelector('.progress-div').remove();
      (document.querySelector('.header .public-profile')).innerHTML =
        `
          <img src="${userData.imageUrl}">
          <p>${username}</p>
          `;


      // I want ki latest upar aaye thats why firstly storing in array varna to jarurat nhi thi aab array reverse maar dunga ka ulta iterate kar dunga
      for (let userContestId in userContests) {
        usercontestIds.push(userContestId);
      }

      contestHistoryDiv.innerHTML = `
                          <div class="cover-image-container">
                          <img id= "cover-image" src="icons/keyboards-mod-musings-01.jpg" alt="">
                          <div class="your-contest-history">
                              <img src="icons/history-svgrepo-com (1).svg" alt="">
                              <h2>Your Contest History</h2>
                          </div>
                      </div>
                      <div class="contest-history-cards"></div>`
      console.log(usercontestIds.length)

      for (let i = usercontestIds.length - 1; i >= 0; i--) {
        let userContest = userContests[usercontestIds[i]];
        const contestHistoryCards = document.querySelector('.contest-history-cards')
        const contestHistoryCard = document.createElement("div")
        contestHistoryCard.id = usercontestIds[i];
        contestHistoryCard.classList.add('contest-history-card');
        const difficultyIcons = {
          easy: 'icons/star-rings-svgrepo-com.svg',
          medium: 'icons/sword-svgrepo-com.svg',
          hard: 'icons/sword-material-svgrepo-com.svg'
        }
        contestHistoryCard.innerHTML =
          `<div class="contest-stat">
                                  <img src="icons/trophy-solid.svg">
                                  <h2>${userContest['netWPM']}</h2>
                                  <p>WPM</p>
                              </div>
                              <div class="contest-stat">
                                  <img src="icons/bullseye-solid (1).svg">
                                  <h2>${userContest['accuracy']}%</h2>
                                  <p>Accuracy</p>
                              </div>
                              <div class="contest-stat">
                                  <img src="icons/clock-regular (1).svg">
                                  <h2>${userContest['contestTime']}</h2>
                                  <p>Seconds</p>
                              </div>
                              <div class="contest-stat-difficulty">
                                  <img src = ${difficultyIcons[userContest['difficulty']]} alt="">
                                  <p>${userContest['difficulty']}</p>
                              </div>`;
        contestHistoryCards.appendChild(contestHistoryCard);
        contestHistoryCard.addEventListener("click", () => {
          localStorage.setItem('contestId', contestHistoryCard.id)
          window.location.href = "contestanalysis.html"
        })
      }
    }
    // varna back karke able to access
    else {
      window.location.href = "index.html";
    }
  })


  goToDashboard.addEventListener("click", () => {
    window.location.href = "dashboard.html"
  })
}