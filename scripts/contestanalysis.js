import {
    app,
    auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,
    db, getDatabase, ref, set, get, push
} from './firebaseinit.js';




if (document.querySelector('.header') && document.querySelector('.contest-analysis')) {
    const contestanalysisDiv = document.querySelector(".contest-analysis")
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            const contestId = localStorage.getItem('contestId');
            let snapshot = await get(ref(db, `users/${uid}`));
            let userData = snapshot.val();
            let contestSnapshot = await get(ref(db, `contests/${contestId}`))
            let contestData = contestSnapshot.val()
            const username = userData['username'];
            document.querySelector('.progress-div').remove();
            (document.querySelector('.header .public-profile')).innerHTML =
                `
            <img src="${userData.imageUrl}">
            <p>${username}</p>
            `;
            contestanalysisDiv.innerHTML =
                `
            <div class="heading">
                <img src="icons/analysis-left-svgrepo-com.svg" alt="">
                <div>
                    <h2>Performance Analysis</h2>
                    <p>Comprehensive breakdown of your typing performace</p>
                </div>
            </div>
              <div class="analysis-stat-cards">
                  <div class="analysis-stat-card">
                      <div>
                          <!-- change this icon -->
                          <img src="icons/brain-illustration-1-svgrepo-com.svg" alt="">
                          <p>Level</p>
                      </div>
                      <h2>${contestData.difficulty}</h2>
                  </div>
                  <div class="analysis-stat-card">
                      <div>
                          <img src="icons/keyboard-regular (1).svg" alt="">
                          <p>Net WPM</p>
                      </div>
                      <h2>${contestData.netWPM}</h2>
                  </div>
                  <div class="analysis-stat-card">
                      <div>
                          <img src="icons/bullseye-solid (1).svg" alt="">
                          <p>Accuracy</p>
                      </div>
                      <h2>${contestData.accuracy}%</h2>
                  </div>
                  <div class="analysis-stat-card">
                      <div>
                          <img src="icons/clock-regular (1).svg" alt="">
                          <p>Duration</p>
                      </div>
                      <h2>${contestData.contestTime}</h2>
                  </div>
              </div>
              <canvas class="WPM-with-time"></canvas>
              <div class="mistakes"><h3>Mistakes</h3></div>
              
            `

            let netWpmData = contestData.netWpmData;
            let grossWpmData = contestData.grossWpmData;
            let timeIntervalForLabel = (contestData.contestTime) / 15
            let timeLabels = [];
            let adjustedNetWpmData = []
            let adjustedGrossWpmData = []

            for (let i = timeIntervalForLabel; i <= contestData.contestTime; i += timeIntervalForLabel) {
                timeLabels.push(i)
                adjustedNetWpmData.push(netWpmData[i - 1])
                adjustedGrossWpmData.push(grossWpmData[i - 1])

            }
            console.log(timeLabels)
            console.log(adjustedGrossWpmData)
            console.log(adjustedNetWpmData)


            const ctx = document.querySelector('.WPM-with-time').getContext('2d');
            const analysisChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timeLabels,
                    datasets: [{
                        label: 'WPM',
                        data: adjustedNetWpmData,
                        borderColor: 'gold',
                        borderWidth: 2,
                        pointRadius: 2,
                        tension: 0.2
                    },
                    {
                        label: 'Raw',
                        data: adjustedGrossWpmData,
                        borderColor: 'gray',
                        borderWidth: 2,
                        pointRadius: 2,
                        tension: 0.2

                    }]

                },
                options: {
                    scales: {
                        x: { title: { display: true, text: 'Time (seconds)' } },
                        y: { title: { display: true, text: 'Words per Minute' }, beginAtZero: true }
                    }
                }
            });

            let userWords = contestData.userWords;
            let targetWords = contestData.targetWords;
            const misktakesDiv = document.querySelector(".mistakes")

            for (let i = 0; i < userWords.length; i++) {
                if (userWords[i] !== targetWords[i]) {
                    let listElement = document.createElement('div')
                    listElement.classList.add("list")
                    listElement.innerHTML =
                        `
                <img src="icons/cross-circle-svgrepo-com (1).svg">
                <p class="incorrect">${userWords[i]}</p>
                <p class="correct">${targetWords[i]}</p>
                `
                    misktakesDiv.appendChild(listElement);
                }
            }
        }
        // varna back karke able to access
        else {
            window.location.href = "index.html";
        }


    })
} 