let currentRow = null;

const addBtn = document.getElementById("addBtn");
const closeBtn = document.getElementById("closeBtn");
const popup = document.getElementById("popup");

const saveBtn = document.getElementById("saveBtn");

const studentName = document.getElementById("studentName");
const studentAge = document.getElementById("studentAge");
const studentCourse = document.getElementById("studentCourse");

const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");

// Open popup
addBtn.addEventListener("click", function () {
    popup.style.display = "flex";
});

// Close popup
closeBtn.addEventListener("click", function () {
    popup.style.display = "none";
});

// Save Student
saveBtn.addEventListener("click", async function () {

    const name = studentName.value.trim();
    const age = studentAge.value.trim();
    const course = studentCourse.value.trim();

    if (name === "" || age === "" || course === "") {
        alert("Please fill all the fields.");
        return;
    }

    // Edit (frontend only)
    if (currentRow) {

    const id = currentRow.dataset.id;

    const response = await fetch(`http://localhost:3000/students/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: name,
            age: age,
            course: course
        })

    });

    if (response.ok) {

        loadStudents();

        popup.style.display = "none";

        studentName.value = "";
        studentAge.value = "";
        studentCourse.value = "";

        currentRow = null;

    } else {

        alert("Failed to update student.");

    }

    return;

}

    // Add Student using Backend
    const response = await fetch("http://localhost:3000/students", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: name,
            age: age,
            course: course
        })

    });

    const newStudent = await response.json();

   const newRow = `
    <tr data-id="${newStudent._id}">
        <td>-</td>
        <td>${newStudent.name}</td>
        <td>${newStudent.age}</td>
        <td>${newStudent.course}</td>
        <td>
            <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</button>
        </td>
    </tr>
`;

    studentTable.innerHTML += newRow;

    popup.style.display = "none";

    studentName.value = "";
    studentAge.value = "";
    studentCourse.value = "";

});

// Delete
document.addEventListener("click", async function (event) {

    if (event.target.classList.contains("deleteBtn")) {

        const row = event.target.closest("tr");
        const id = row.dataset.id;
        const response = await fetch(`http://localhost:3000/students/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            row.remove();
        } else {
            alert("Failed to delete student.");
        }
    }

});


// Search
searchInput.addEventListener("keyup", function () {

    const searchText = searchInput.value.toLowerCase();

    const rows = studentTable.getElementsByTagName("tr");

    for (let row of rows) {

        const studentName = row.cells[1].textContent.toLowerCase();

        if (studentName.includes(searchText)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    }

});

// Edit
document.addEventListener("click", function (event) {

    if (event.target.classList.contains("editBtn")) {

        currentRow = event.target.closest("tr");

        studentName.value = currentRow.cells[1].textContent;
        studentAge.value = currentRow.cells[2].textContent;
        studentCourse.value = currentRow.cells[3].textContent;

        popup.style.display = "flex";
    }

});

// Load Students
async function loadStudents() {

    const response = await fetch("http://localhost:3000/students");

    const students = await response.json();

    studentTable.innerHTML = "";

students.forEach(function (student, index) {
        const newRow = `
            <tr data-id="${student._id}"> 
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.course}</td>
                <td>
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete</button>
                </td>
            </tr>
        `;

        studentTable.innerHTML += newRow;

    });

}

loadStudents();