import {
  app,
  auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,
  db, getDatabase, ref, set, get, push, model
} from './firebaseinit.js';

if (document.querySelector('.verify-contest')) {
  let uid;
  let username;
  let userCity;
  let userProfilePic;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // yaha to promise chain hi use karni padegi varna contest will load after data retrieve but uski jarurat nhi h user data ki pehle
      // aab iss cheej ki jarurat nhi as moved the code out of this block
      uid = user.uid;
      get(ref(db, `users/${uid}`)).then((snapshot) => {
        let userData = snapshot.val();
        username = userData['username'];
        userCity = userData['city'];
        userProfilePic = userData.imageUrl;
        (document.querySelector('.header .public-profile')).innerHTML =
          `
              <img src="${userData.imageUrl}">
              <p>${username}</p>
          `
      })
    }
    else {
      window.location.href = 'index.html'
    }
  })

  // i think ki if(user) is taking time kyoki iss code ko jab if block ke aandar daal rha hu to lagging to pehle hi uid ko declare usme then value store 

  let contestTime = localStorage.getItem('contestTime');
  let difficulty = localStorage.getItem('difficulty');

  (async () => {
    try {
      let prompts = {
        'easy': `Write a short passage with at least ${contestTime * 3} words using simple sentences and easy words for typing practice`,
        'medium': `Write a short passage with at least ${contestTime * 3} words using slightly harder words and varied sentences for typing practice`,
        'hard': `Write a passage with at least ${contestTime * 3} words using advanced vocabulary, punctuation, and detailed sentence structures for typing practice and dont give double spaces`
      }
      let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyChqjTsap4lW-qLUyV7QQQEYOdziyJRzXo`



      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${prompts[difficulty]}` }]
          }]
        })
      });


      if (!response.ok) {
        console.log("Failed");
        throw new Error('Failed to fetch response from API.');
      }



      const data = await response.json();
      const value = data.candidates[0].content.parts[0].text
      const normalisedText = value.replace(/\s{2,}/g, ' ');









      runContest(normalisedText);




    } catch (error) {
      let storedText = {
        // agar gemini se text nhi aaya to ispe fallback in future and abhi yehi text
        'easy': `The little puppy loved to play fetch. He would chase the ball with such enthusiasm, his tail wagging furiously. He would bark joyfully when he brought the ball back to his owner, eager for another throw. The puppy's playful energy was infectious, bringing smiles to everyone around him.`,
        'medium': `In the heart of a bustling city, amidst the towering skyscrapers and the ceaseless hum of traffic, a small park offered a tranquil escape. Children laughed as they played on the swings, while elderly gentlemen strolled along the winding paths, enjoying the shade of the ancient trees. A gentle breeze rustled through the leaves, carrying the sweet scent of blooming flowers. It was a peaceful oasis in the midst of urban chaos, a reminder of the beauty that can be found even in the most unexpected places.`,
        'hard': `"The human experience is a complex and multifaceted journey, a tapestry woven with threads of joy and sorrow, triumph and despair. We navigate a labyrinth of emotions, constantly evolving and adapting to the ever-shifting currents of life. Love, loss, and the pursuit of meaning are universal themes that resonate deeply within the human condition. Through empathy and compassion, we build bridges of understanding and forge meaningful connections with others, creating a richer and more fulfilling existence. However, the path to self-discovery is often fraught with challenges, demanding resilience, introspection, and a willingness to embrace vulnerability. Fear of failure, self-doubt, and the weight of expectations can hinder our progress and stifle our growth. Cultivating self-awareness and developing coping mechanisms are crucial for navigating these obstacles and embracing the inevitable setbacks that life presents. Ultimately, the journey of self-discovery is a lifelong pursuit, one that requires continuous growth, a commitment to living authentically, and a willingness to embrace the unknown."`
      }
      const targetText = storedText[difficulty];
      runContest(targetText);
    }

  })();


  function runContest(targetText) {
    const loader = document.querySelector('.progress-div')
    const realTimeStatsDiv = document.createElement('div');
    realTimeStatsDiv.classList.add('realtime-stats')

    realTimeStatsDiv.innerHTML =
      `
        <div class="timer"><span>30</span>seconds</div>
        <div class="realtime-WPM">
            <div>0</div>
            <p>WPM</p>
        </div>
        <div class="realtime-accuracy">
            <div>0</div>
            <p>Accuracy</p>
        </div>
    `

    loader.after(realTimeStatsDiv);
    loader.remove()

    const typingContainerDiv = document.createElement('div')
    typingContainerDiv.classList.add('typing-container')
    typingContainerDiv.innerHTML =
      `
        <div class="target-text"></div>
        <textarea class="input-area"></textarea>
    `
    realTimeStatsDiv.after(typingContainerDiv)

    const targetWords = targetText.split(" ");
    const targetTextElement = document.querySelector('.target-text');
    const inputArea = document.querySelector('.input-area');
    const timerElement = document.querySelector('.timer span')
    const realTimeWPMElement = document.querySelector('.realtime-WPM div')
    const realTimeAccuracy = document.querySelector('.realtime-accuracy div')
    let timePassed = 0;
    let timeRemaining = contestTime;
    let noOfIncorrectCharacters = 0;
    let noOfcorrectCharacters = 0;
    let interval = null;
    timerElement.textContent = contestTime;
    targetTextElement.textContent = targetText;
    let userInput;
    let netWpmData = [];
    let grossWpmData = [];
    let contestId;

    targetTextElement.addEventListener("click", () => {
      inputArea.focus();
    })

    inputArea.addEventListener('input', () => {
      if (!interval) {
        interval = setInterval(async () => {
          timePassed++;
          timeRemaining--;
          noOfcorrectCharacters = (document.querySelectorAll(".correct")).length;
          noOfIncorrectCharacters = (document.querySelectorAll(".incorrect")).length;
          let grossWPM = Math.round((noOfIncorrectCharacters + noOfcorrectCharacters) / (5 * timePassed / 60))
          let netWPM = Math.round(noOfcorrectCharacters / (5 * (timePassed / 60)))
          let accuracy = Math.round(noOfcorrectCharacters * 100 / (noOfIncorrectCharacters + noOfcorrectCharacters))
          realTimeWPMElement.textContent = netWPM;
          realTimeAccuracy.textContent = `${accuracy}%`;
          netWpmData.push(netWPM);
          grossWpmData.push(grossWPM);
          timerElement.textContent = timeRemaining;
          if (timeRemaining === 0) {
            inputArea.disabled = true;
            userInput = inputArea.value;
            let userWords = userInput.split(" ");
            userWords = userWords.filter(item => item !== "");
            console.log(userWords);
            console.log(targetWords);
            console.log(netWpmData);
            console.log(grossWpmData)
            clearInterval(interval);
            await saveContestData(netWPM, accuracy, difficulty, contestTime, targetText, targetWords, userWords, netWpmData, grossWpmData, grossWPM);
            await saveContestDataGlobal(uid, username, userProfilePic, netWPM, accuracy, difficulty, contestTime, targetText, userCity, targetWords, userWords, netWpmData, grossWpmData, grossWPM);
            await increaseTestCountandChangeBestScore(netWPM);
            localStorage.setItem('contestId', contestId);
            window.location.href = "contestanalysis.html"
            console.log(contestId);
          }
        }, 1000)
      }

      const increaseTestCountandChangeBestScore = async (netWPM) => {
        // increasing the test count
        // pta nhi feeling that there could be a better way
        let snapshot = await get(ref(db, `users/${uid}`))
        let data = snapshot.val()
        let currentCount = data['totalTestsTaken'];
        let currentBest = data['bestWPM'];
        console.log(currentCount)
        set(ref(db, `users/${uid}/totalTestsTaken`), currentCount + 1)
        if (netWPM > currentBest) {
          set(ref(db, `users/${uid}/bestWPM`), netWPM);
        }
      }


      const saveContestData = async (netWPM, accuracy, difficulty, contestTime, targetText, targetWords, userWords, netWpmData, grossWpmData, grossWPM) => {
        // push takes refrence aur then value jo uske child me dale with a unique id
        contestId = await push(ref(db, `users/${uid}/contests`), {
          netWPM: netWPM,
          accuracy: accuracy,
          difficulty: difficulty,
          contestTime: contestTime,
          text: targetText,
          targetWords: targetWords,
          userWords: userWords,
          netWpmData: netWpmData,
          grossWpmData: grossWpmData,
          grossWPM: grossWPM
        })
        contestId = contestId.key;
      }


      const saveContestDataGlobal = async (uid, username, userProfilePic, netWPM, accuracy, difficulty, contestTime, targetText, userCity, targetWords, userWords, netWpmData, grossWpmData, grossWPM) => {
        await set(ref(db, `contests/${contestId}`), {
          useruid: uid,
          username: username,
          userProfilePic: userProfilePic,
          netWPM: netWPM,
          accuracy: accuracy,
          difficulty: difficulty,
          contestTime: contestTime,
          text: targetText,
          userCity: userCity,
          targetWords: targetWords,
          userWords: userWords,
          netWpmData: netWpmData,
          grossWpmData: grossWpmData,
          grossWPM: grossWPM
        })
      }



      userInput = inputArea.value;

      let formattedText = '';
      for (let i = 0; i < targetText.length; i++) {
        const userChar = userInput[i];
        const targetChar = targetText[i];




        if (userChar === targetChar) {
          formattedText = formattedText + `<span class="correct">${targetChar}</span>`;
        } else if (userChar) {
          formattedText = formattedText + `<span class="incorrect">${targetChar}</span>`;
        } else {
          formattedText = formattedText + `<span class= "untyped">${targetChar}</span>`;
        }
      }
      targetTextElement.innerHTML = formattedText;
    });


  }

}