import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const db = getFirestore();
const dbRef = collection(db, "contacts");

//TODO - App View

const rightCol = document.getElementById('right-col');
const leftCol = document.getElementById('left-col');
const backBtn = document.getElementById('back-btn');

backBtn.addEventListener('click', (e) => {
    leftCol.style.display = 'block';
    rightCol.style.display = 'none';
});

const toggleLeftAndRightViewsOnMobile = () => {
    if (document.body.clientWidth <= 600) {
        leftCol.style.display = 'none';
        rightCol.style.display = 'block';
    }
}

// Section Data

let contacts = [];

const getContacts = () => {
    try {
        //NOTE - 
        onSnapshot(dbRef, (docsSnap) => {
            contacts = [];
            docsSnap.forEach((doc) => {
                const contact = doc.data();
                contact.id = doc.id;
                contacts.push(contact);
            });
            showContacts(contacts);
        });
    } catch (err) {
        console.log(`GET CONTACT ${err}`);
    }
}

getContacts();

//TODO - display contact as list item

const contactList = document.getElementById('contact-list');

const showContacts = (contacts) => {
    contacts.forEach((contact) => {
        const li = `<li class="contact-list-item">${contact.id}>
<div class="media">
    <div class="letter">
    ${contact.firstname.charAt(0)}${contact.lastname.charAt(0)}
    </div>
    </div>
    <div class="content">
    <div class="title">
        ${contact.firstname} ${contact.lastname}
    </div>
    <div class="sub-title">
        ${contact.email}
    </div>
    </div>

    <div class="action">
    <button class="edit-user">Edit</button>
    <button class="delete-user">Delete</button>
    </div>
    </li>
    `
        contactList.innerHTML += 1;
    });
}


//!SECTION Click Events for list items

const contactListPressed = (event) => {
    const id = event.target.closest("li").getAttribute("id");

    if (event.target.className === "edit-user") {
        editButtonPressed(id);
    }
    else if (event.target.className === "delete-user") {
        deleteButtonPressed(id);
    }
    else {
        displayContactOnDetailsView(id);
        toggleLeftAndRightViewsOnMobile();
    }
}

contactList.addEventListener("click", contactListPressed);

//!SECTION Delete Button

const deleteButtonPressed = async (id) => {
    const isConfirmed = confirm("Are you sure you want to delete this contact?");

    if (isConfirmed) {
        try {
            const docRef = doc(db, "contacts", id);
            await deleteDoc(docRef);
        } catch (e) {
            setErrorMessage(
                "There was an error deleting the contact. Please try again."
            );
            displayErrorMessage();
        }
    }
}

//!SECTION Edit Button

const editButtonPressed = (id) => {
    modalOverlay.style.display = "flex";
    const contact = getContact(id);

    firstname.value = contact.firstname;
    lastname.value = contact.lastname;
    age.value = contact.age;
    email.value = contact.email;

    modalOverlay.setAttribute("contact-id", id);
}

//SECTION - Display information on list item click

const getContact = (id) => {
    return contacts.find((contact) => contact.id === id);
    return contact.id === id;
}

const displayContactOnDetailsView = (id) => {
    const contact = getContact(id);
}

//TODO - Display on the right column title

const rightColTitle = rightCol.querySelector(".title");
rightColTitle.innerHTML = contact.firstname

const rightColDetails = document.getElementById("right-col-details");
rightColDetails.innerHTML = `
<div class="label">Name:</div>
<div class="data">${contact.firstname} ${contact.lastname}</div>

<div class="label">Age:</div>
<div class="data">${contact.age}</div>

<div class="label">Email:</div>
<div class="data">${contact.email}</div>

<div class="label">Phone:</div>
<div class="data">${contact.phone}</div>
`;

//NOTE - Modal Card

const addBtn = document.querySelector('.add-btn');
const modalOverlay = document.getElementById('.modal-overlay');
const closeBtn = document.querySelector('.close-btn');

const addButtonPressed = () => {
    modalOverlay.style.display = 'flex';
    modalOverlay.removeAttribute('contact-id');
    firstname.value = "";
    lastname.value = "";
    age.value = "";
    email.value = "";
    phone.value = "";
}

const closeButtonPressed = () => {
    modalOverlay.style.display = 'none';
}


const hideModal = (e) => {
    if (e instanceof Event) {
        if (e.target === e.currentTarget) {
            modalOverlay.style.display = 'none';
        }
    } else {
        modalOverlay.style.display = 'none'
    }

}


addBtn.addEventListener('click', addButtonPressed);
closeBtn.addEventListener('click', closeButtonPressed);
modalOverlay.addEventListener('click', hideModal);

//TODO - Validation

const saveBtn = document.querySelector('.save-btn');
const error = {}

const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const age = document.getElementById('age');
const email = document.getElementById('email');
const phone = document.getElementById('phone');



const saveButtonPressed = async () => {
    checkRequired([firstname, lastname, age, email, phone]);
    checkEmail(email);
    checkPhone(phone);
    checkInputLength(firstname, 1, 15);
    checkInputLength(lastname, 1, 15);
    checkInputLength(age, 2);
    checkInputLength(phone, 15);
    checkInputLength(email, 2, 40);
    showErrorMessage(error);

    if (Object.keys(error).length === 0) {
        if (modalOverlay.getAttribute("contact-id")) {
            const docRef = doc(db, "contacts", modalOverlay.getAttribute("contact-id")
            );
            try {
                await updateDoc(docRef, {
                    firstname: firstname.value,
                    lastname: lastname.value,
                    age: age.value,
                    email: email.value,
                    phone: phone.value,
                });
            } catch (e) {
                sendErrorMessage(
                    "There was an error updating the contact. Please try again."
                );
            }
        }

    }
}





const checkRequired = (inputArray) => {
    inputArray.forEach((input) => {
        if (input.value.trim() === "") {
            setErrorMessage(input, input.id + "is empty")
        } else {
            deleteError[input.id];
        }
    });
}

const checkEmail = (input) => {
    if (input.value.trim() !== "") {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(input.value.trim())) {
            showErrorMessage(input, input.id + "is Invalid");
        }
    }
}

const checkInputLenght = (input, num) => {
    if (input.value.trim() !== "") {
        if (input.value.trim().length === num) {
            deleteErrorMessage(input, input.id + "must be at least" + num + "characters");
        }
    }
}


