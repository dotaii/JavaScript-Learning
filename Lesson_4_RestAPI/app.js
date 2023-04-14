var coursesAPI = 'http://localhost:3000/courses';
var listCoursesBlock = document.querySelector('#list-courses');

function start(){
    getCourses(renderCourses);

    handleCreateForm();
}
start();    

function getCourses(callback) {
    fetch(coursesAPI)
        .then(function(response){
            return response.json();
        })
        .then(callback);
}
//CRUD
function createCourse(data, callback){
    var option = {
        method : 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(coursesAPI, option)
        .then(function(response){
            return response.json();
        })
        .then(callback);
}
function deleteCourses(id){
    var option = {
        method : 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        },
    }
    fetch(coursesAPI + '/' + id, option)
        .then(function(response){
            return response.json();
        })
        .then(function(){
            var courseItem = document.querySelector('.course-item-'+id);
            courseItem.remove();
        });
}
//Render

function renderCourses(courses){

    var htmls = courses.map(function(course){
        return `
            <li class="course-item-${course.id}">
                <h5>${course.name}</h5>
                <p>${course.description}</p>
                <button onclick="deleteCourses(${course.id})">Delete</button>
            </li>
        `
    })
    listCoursesBlock.innerHTML = htmls.join('');
}

function handleCreateForm(){
    var createBtn = document.querySelector('#btn-create');
    createBtn.onclick = function(){
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;
        var formData = {
            name: name,
            description: description
        }
        createCourse(formData), function(){
            getCourses(renderCourses);
        };

    }
}
