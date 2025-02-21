import {
    app,
    auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,
    db, getDatabase, ref, set, get, push
} from './firebaseinit.js';


const blogsDiv = document.querySelector('.blogs');
let uid;
let username;
let userProfilePic;
let blogsData;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        uid = user.uid;
        let snapshot = await get(ref(db, `users/${uid}`));
        let userData = snapshot.val();
        let blogSnapshot = await get(ref(db, `blogs`));
        blogsData = blogSnapshot.val();
        username = userData['username'];
        userProfilePic = userData.imageUrl;
        console.log(userProfilePic);
        (document.querySelector('.header .public-profile')).innerHTML =
            `
        <img src="${userData.imageUrl}">
        <p>${username}</p>
        `;
        document.querySelector('.main-content').innerHTML = `<div class="blogs"></div>`
        const blogsDiv = document.querySelector('.blogs');
        const blogCards = document.createElement('div')
        blogCards.classList.add('blogcards')
        blogsDiv.innerHTML =
            `
        <img id="addBlogBtn" src="icons/pen-square-svgrepo-com.svg" >

        `

        let blogIds = [];
        for (let blogId in blogsData) {
            blogIds.push(blogId);
        }
        for (let i = blogIds.length - 1; i >= 0; i--) {
            const blogData = blogsData[blogIds[i]];
            console.log(blogData);

            const blogCard = document.createElement('div')
            blogCard.classList.add('blogcard')
            blogCard.id = blogIds[i];


            if (blogData.useruid == uid) {
                blogCard.innerHTML =
                    `
                                <div class="heading">
                                <h2>${blogData.title} <span><img src="icons/edit-svgrepo-com.svg" alt=""></span> </h2>
                                <div>
                                    <img src="${blogData.userProfilePic}" alt="">
                                    <p id="${blogData.useruid}">${blogData.username}</p>
                                </div>
                            </div>
                            <div class="content">
                                <p>${blogData.content}</p>
                            </div>
                `
            }
            else {
                blogCard.innerHTML =
                    `
                            <div class="heading">
                            <h2>${blogData.title}</h2>
                            <div>
                                <img src="${blogData.userProfilePic}" alt="">
                                <p id="${blogData.useruid}">${blogData.username}</p>
                            </div>
                        </div>
                        <div class="content">
                            <p>${blogData.content}</p>
                        </div>
            `

            }
            blogCards.appendChild(blogCard);

        }


        blogsDiv.appendChild(blogCards);


        const editBtns = document.querySelectorAll('.heading span');
        for (let editBtn of editBtns) {
            editBtn.addEventListener("click", async (event) => {
                const blogCard = event.target.closest('.blogcard'); 
                const blogId = blogCard.id;  
                const titleElement = blogCard.querySelector('.heading h2');
                const contentElement = blogCard.querySelector('.content p');

                // Prevent duplicate save buttons
                // if (blogCard.querySelector('.save-btn')) return;

                // Convert text to input fields
                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.value = titleElement.innerText.replace(" ✎", "");
                titleElement.innerHTML = '';
                titleElement.appendChild(titleInput);

                const contentTextarea = document.createElement('textarea');
                contentTextarea.value = contentElement.innerText;
                contentElement.innerHTML = '';
                contentElement.appendChild(contentTextarea);

                const saveBtn = document.createElement('button');
                saveBtn.textContent = "Save";
                saveBtn.classList.add('save-btn');
                blogCard.appendChild(saveBtn); 

                saveBtn.addEventListener('click', async () => {
                    const updatedTitle = titleInput.value
                    const updatedContent = contentTextarea.value

                    if (!updatedTitle || !updatedContent) {
                        alert("Title and content cannot be empty!");
                        return;
                    }

                    // Update in Firebase
                    await set(ref(db, `blogs/${blogId}`), {
                        username: username,
                        userProfilePic: userProfilePic,
                        useruid: uid,
                        title: updatedTitle,
                        content: updatedContent
                    });

                    alert("Blog updated!");

                    window.location.reload();
                }, { once: true }); // Ensure the event listener runs only once saw on internet
            });
        }


        const userLinks = document.querySelectorAll('.heading p')
        for (let userLink of userLinks) {
            console.log(userLink)
            userLink.addEventListener("click", () => {
                localStorage.setItem("otherPersonUid", userLink.id)
                window.location.href = "otheruserprofile.html"
            })
        }




        document.querySelector('#addBlogBtn').addEventListener("click", () => {
            blogsDiv.innerHTML =
                `       <div class="new-blog">
                            <h2>Create new blog</h2>
                            <p>Share Your thoughts with the community</p>
                            <input id="title" type="text" placeholder="Type your Title Here">
                            <textarea  id="content" placeholder="Type your Content Here...."></textarea>
                            <!-- <input id="content" type="text" placeholder="Type your Content Here"> -->
                             <button id="publish">Publish</button>
                        </div>
            `;
            if (document.querySelector('.new-blog')) {
                document.querySelector('#publish').addEventListener("click", async () => {
                    let title = (document.querySelector('#title').value)
                    let content = (document.querySelector('#content').value)
                    if (!title) {
                        alert('Give a title')
                        return;
                    }
                    if (!content) {
                        alert('Blog cant be empty')
                        return;
                    }
                    await push(ref(db, `blogs`), {
                        username: username,
                        userProfilePic: userProfilePic,
                        useruid: uid,
                        title: title,
                        content: content
                    })
                    alert('Blog published')
                    window.location.href = 'blogpage.html'
                })
            }
        })
    }
    else {
        window.location.href = 'index.html'
    }
})






