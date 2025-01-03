import{ app,
    auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged,signOut,
    db,getDatabase,ref,set,get,push} from './firebaseinit.js';


if(document.querySelector(".header") && document.querySelector(".welcome")){
    const logOutBtn = document.querySelector(".logout")
    const publicProfileBtn = document.querySelector(".public-profile")
    const rankingsBtn = document.querySelector(".welcome #temporary")
    const viewProgressBtn = document.querySelector('.welcome #view-progress')
    const difficultySelectionElements = document.querySelectorAll(".difficulty-selection-card")
    const timeSelectionCards = document.querySelectorAll('.time-selection-card')
    const timeSelectionElements = document.querySelectorAll(".start-test")

    const boxHeadingForDifficulty = {
      'easy': 'Perferct For Beginners',
      'medium': 'Challenge Yourself',
      'hard': 'Test Your Limits'
    }

    let difficulty = "easy"; //default ye aayegi on page reload
    let contestTime = 15; // default on page reload
    console.log(difficulty,contestTime);
    localStorage.setItem('difficulty',difficulty); 
    localStorage.setItem('contestTime',contestTime)



  for(let i = 0; i < difficultySelectionElements.length ; i++){
    difficultySelectionElements[i].addEventListener("click" , () => {
      for(let j = 0; j < difficultySelectionElements.length ; j++){
        difficultySelectionElements[j].classList.remove('selected');
      }
      difficulty = difficultySelectionElements[i].id
      console.log(difficulty)
      localStorage.setItem('difficulty',difficulty);
      difficultySelectionElements[i].classList.add('selected')
      for(let timeSelectionCard of timeSelectionCards){
        timeSelectionCard.querySelector('p').innerText = boxHeadingForDifficulty[difficulty];
      }

    })
  }

  // readable to h but isme deselct kaise karunga pehle wala so wrote the above will see if a better way to handle this if time allows 
  // abhi to dimag me upar wala method aaya

    // for(let difficultyElement of difficultySelectionElements){
    //   difficultyElement.addEventListener("click", ()=> {
    //     difficulty = difficultyElement.id
    //     console.log(difficulty)
    //     localStorage.setItem('difficulty',difficulty);
    //     difficultyElement.classList.add('selected')
    //   })
    // }




    

    for(let timeSelectionElement of timeSelectionElements){
      timeSelectionElement.addEventListener("click" , () => {
        contestTime = timeSelectionElement.id
        console.log(contestTime);
        localStorage.setItem('contestTime',contestTime)
        window.location.href = "contestpage.html"
      })
    }

    
    // behind the scenes firebase apne aap user me data daal dega as the user
    onAuthStateChanged(auth, async (user) => {
      if(user)
      {  
      const uid = user.uid;
      let snapshot = await get(ref(db,`users/${uid}`));
      let userData = snapshot.val();
      const username = userData['username']
      document.querySelector('.welcome .heading span').textContent = username
      document.querySelector('.welcome p span').textContent = userData['bestWPM'];
      // yha semicolon miss ho jata to error aata
      (document.querySelector('.header .public-profile')).innerHTML = 
      `
      <img src="${userData.imageUrl}">
      <p>${username}</p>
      `
      
      }
      // varna back karke able to access
      else {
         window.location.href = "index.html";
      }
    })


    viewProgressBtn.addEventListener("click", (e) => {
      window.location.href = "historypage.html"
    })


    rankingsBtn.addEventListener("click", (e) => {
      window.location.href = "leaderboard.html"
    })


    publicProfileBtn.addEventListener("click", (e) => {
      console.log(e)
      window.location.href = "publicprofile.html"
    })

    logOutBtn.addEventListener("click" , async (e) => {
      try{
        await signOut(auth)
        window.location.href = "index.html"
      } 
      catch{
        console.log(error.message)
      }
    })
}