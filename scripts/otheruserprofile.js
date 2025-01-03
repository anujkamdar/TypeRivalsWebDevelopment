import {
    app,
    auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,
    db, getDatabase, ref, set, get, push
} from './firebaseinit.js';

if (document.querySelector(".header") && document.querySelector(".verify-user-pp-page")) {
    // let contestHistoryDiv = document.querySelector(".contest-history");
    const usercontestIds = [];
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const ownUid = user.uid;
            const otherPersonUid = localStorage.getItem("otherPersonUid");

            let ownSnapshot = await get(ref(db, `users/${ownUid}`));
            let ownData = ownSnapshot.val()
            let snapshot = await get(ref(db, `users/${otherPersonUid}`));
            let userData = snapshot.val();
            const username = userData['username']
            const userContests = userData['contests']
            const totalTestsTaken = userData['totalTestsTaken']
            const bestWPM = userData['bestWPM'];

            document.querySelector('.pp-page-main-content').innerHTML = 
            `
            <div class="personal-info">
                  <div class="pp-img-container">
                      <!-- <img src="icons/davidjmalan.jpeg"> -->
                  </div>
                  <div class="info-wrapper">
                      <h2>Username</h2>
                      <div class="extra-personal-info" id="city">
                          <img src="icons/gps-svgrepo-com (3).svg" alt="">
                          <p>Lorem, ipsum</p>
                      </div>
                      <div class="extra-personal-info" id="email">
                          <img src="icons/envelope-regular.svg" alt="">
                          <p>loremipsum@gmail.com</p>
                      </div>
                  </div>
              </div>
              <div class="stat-cards">
                  <div class="statcard" id="bestWpm">
                      <img src="icons/trophy-solid.svg" alt="">
                      <h1></h1>
                      <p>Best WPM</p>
                  </div>
                  <div class="statcard" id="LastAccuracy">
                      <img src="icons/bullseye-solid.svg" alt="">
                      <h1></h1>
                      <p>Last Accuracy</p>
                  </div>
                  <div class="statcard" id="LastWpm">
                      <img src="icons/trophy-solid.svg" alt="">
                      <h1></h1>
                      <p>Last WPM</p>
                  </div>
                  <div class="statcard" id="totalTestsTaken">
                      <img src="icons/keyboard-regular (1).svg" alt="">
                      <h1></h1>
                      <p>Tests Taken</p>
                  </div>
              </div>
              <div class="contest-history">
              </div>
          </div>
            `
      
            const contestHistoryDiv = document.querySelector(".contest-history"); 


            (document.querySelector('.header .public-profile')).innerHTML =
                `
            <img src="${ownData.imageUrl}">
            <p>${ownData.username}</p>
                `
                ;

            document.querySelector('.pp-img-container').innerHTML =
                `
          <img src="${userData.imageUrl}"> 
          `;
            document.querySelector('.info-wrapper h2').innerText = username;
            document.querySelector('#email p').innerText = userData['email'];
            document.querySelector('#city p').innerText = userData['city'];
            document.querySelector('#bestWpm h1').innerText = bestWPM;
            document.querySelector('#totalTestsTaken h1').innerText = totalTestsTaken;

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
            // console.log(usercontestIds.length)

            for (let i = usercontestIds.length - 1; i >= 0; i--) {
                let userContest = userContests[usercontestIds[i]];
                if (i == usercontestIds.length - 1) {
                    document.querySelector('#LastAccuracy h1').innerText = `${userContest['accuracy']}%`;
                    document.querySelector('#LastWpm h1').innerText = userContest['netWPM'];
                }
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
                    console.log(contestHistoryCard.id)
                    window.location.href = "contestanalysis.html"
                })
            }
        }
        // varna back karke able to access
        else {
            window.location.href = "index.html";
        }
    })

}