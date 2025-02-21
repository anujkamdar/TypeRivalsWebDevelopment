import {
  app,
  auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,
  db, getDatabase, ref, set, get, push
} from './firebaseinit.js';


if (document.querySelector(".header") && document.querySelector(".leaderboard")) {
  const goToDashboard = document.querySelector("#dashboard")
  const leaderboardDiv = document.querySelector('.leaderboard')
  let leaderboard = [];
  let userCity;
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      let snapshot = await get(ref(db, `users/${uid}`));
      let userData = snapshot.val();
      const username = userData['username'];
      userCity = userData['city'];

      (document.querySelector('.header .public-profile')).innerHTML =
      `
      <img src="${userData.imageUrl}">
      <p>${username}</p>
      `;
      let contestSnaphot = await get(ref(db, `contests`))
      let contests = contestSnaphot.val()
      for (let contestKey in contests) {
        leaderboard.push(contests[contestKey])
      }

      leaderboard.sort((a, b) => {
        if (b.netWPM == a.netWPM) {
          return b.accuracy - a.accuracy;
        }
        return b.netWPM - a.netWPM;
      })
      console.log(leaderboard);
      document.querySelector('.progress-div').remove();
      leaderboardDiv.innerHTML =
      ` <div class="cover-image-container">
          <img id= "cover-image" src="icons/best-black-desk-setup-accessories1-1536x864.webp">
          <div class="rankings">
              <img src="icons/trophy-svgrepo-com (1).svg" alt="">
              <h2>${userCity} Leaderboard</h2>
          </div>
          <button>Hello</button>
      </div>
      <div class="ranking-table">
          <div class="header-row">
              <div>Rank</div>
              <div>Username</div>
              <div>Level</div>
              <div>Duration</div>
              <div>Accuracy</div>
              <div>WPM</div>
          </div>
      </div>`

        

      const makeGlobalLeaderboard = () => {
        leaderboardDiv.innerHTML =
        ` <div class="cover-image-container">
            <img id= "cover-image" src="icons/best-black-desk-setup-accessories1-1536x864.webp">
            <div class="rankings">
                <img src="icons/trophy-svgrepo-com (1).svg" alt="">
                <h2>Global Leaderboard</h2>
            </div>
            <button id="viewCity">View City Leaderboard <span>&#8594<span></button>
        </div>
        <div class="ranking-table">
            <div class="header-row">
                <div>Rank</div>
                <div>Username</div>
                <div>Level</div>
                <div>Duration</div>
                <div>Accuracy</div>
                <div>WPM</div>
            </div>
        </div>`
        document.querySelector('#viewCity').addEventListener("click",()=>{
          makeCityLeaderboard();
        })
        const rankingTable = document.querySelector(".ranking-table");
        console.log(rankingTable);
        console.log(leaderboard);
        for (let i = 0; (i < leaderboard.length) && i < 10; i++) {
          let contest = leaderboard[i];
          const leaderboardRow = document.createElement("div");
          leaderboardRow.classList.add("leaderboard-row");
          let rank = i + 1;
          leaderboardRow.innerHTML =
            `
            <div class="rank">${rank}</div>
            <div class="username"><img src="${contest.userProfilePic}"><span class= "user-span" id= "${contest.useruid}">${contest.username}<span></div>
            <div class="level"><div id="${contest.difficulty}">${contest.difficulty}</div></div>
            <div class="duration">${contest.contestTime} sec</div>
            <div class="accuracy"><img src="icons/bullseye-solid.svg">${contest.accuracy}%</div>
            <div class="WPM">${contest.netWPM}</div>
            `
          rankingTable.appendChild(leaderboardRow);
          let userSpans = document.querySelectorAll('.user-span')
          for (let userSpan of userSpans) {
            userSpan.addEventListener("click", () => {
              localStorage.setItem("otherPersonUid", userSpan.id)
              window.location.href = "otheruserprofile.html"
            })
    
          }
        }
      }
      

      const makeCityLeaderboard = () => {
        let cityLeaderboard = [];
        leaderboardDiv.innerHTML =
        ` <div class="cover-image-container">
        <img id= "cover-image" src="icons/best-black-desk-setup-accessories1-1536x864.webp">
        <div class="rankings">
            <img src="icons/trophy-svgrepo-com (1).svg" alt="">
            <h2>${userCity} Leaderboard</h2>
        </div>
        <button id="viewGlobal">View Global Leaderboard <span>&#8594<span></button>

    </div>
    <div class="ranking-table">
        <div class="header-row">
            <div>Rank</div>
            <div>Username</div>
            <div>Level</div>
            <div>Duration</div>
            <div>Accuracy</div>
            <div>WPM</div>
        </div>
    </div>`
        document.querySelector('#viewGlobal').addEventListener("click",()=> {
          makeGlobalLeaderboard();
        })
        const rankingTable = document.querySelector(".ranking-table");
        console.log(rankingTable);

        for(let j = 0; j < leaderboard.length; j++){
          if(leaderboard[j].userCity == userCity){
            cityLeaderboard.push(leaderboard[j]);
          }
          console.log(leaderboard[j].userCity)
        }
        for (let i = 0; (i < cityLeaderboard.length) && i < 10; i++) {
          let contest = cityLeaderboard[i];
          const leaderboardRow = document.createElement("div");
          leaderboardRow.classList.add("leaderboard-row");
          let rank = i + 1;
          leaderboardRow.innerHTML =
            `
            <div class="rank">${rank}</div>
            <div class="username"><img src="${contest.userProfilePic}"><span class= "user-span" id= "${contest.useruid}">${contest.username}<span></div>
            <div class="level"><div id="${contest.difficulty}">${contest.difficulty}</div></div >
            <div class="duration">${contest.contestTime} sec</div>
            <div class="accuracy"><img src="icons/bullseye-solid.svg">${contest.accuracy}%</div>
            <div class="WPM">${contest.netWPM}</div>
            `
          rankingTable.appendChild(leaderboardRow);
          let userSpans = document.querySelectorAll('.user-span')
          for (let userSpan of userSpans) {
            userSpan.addEventListener("click", () => {
              localStorage.setItem("otherPersonUid", userSpan.id)
              window.location.href = "otheruserprofile.html"
            })
    
          }
        }
    }

      makeGlobalLeaderboard();

    }
    else {
      window.location.href = "index.html"
    }
  })



  goToDashboard.addEventListener("click", () => {
    window.location.href = "dashboard.html"
  })
}