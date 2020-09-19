document.addEventListener("click",function(e){
    //Update Item
    if(e.target.classList.contains('edit-me')){
        let input = prompt("Enter your text : ", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)

        if(input){
            axios.post('/update-item', {item: input, id: e.target.getAttribute("data-id")}).then(function(){
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = input
            }).catch(function(){
                console.log("Try again later")
                console.log(e.target.getAttribute("data-id"))
            })
        }
    }

    //Delete Item
    if(e.target.classList.contains('delete-me')){
        if(confirm("Are you sure to delete this item?")){
            axios.post('/delete-item',{id: e.target.getAttribute("data-id")}).then(function() {
            e.target.parentElement.parentElement.remove()    
            }).catch(function(){
                console.log("Try again later")
                console.log(e.target.getAttribute("data-id"))
            })
        }
    }
})

//HTML Tamplate For Item
function itemTemplate(item) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${item.text}</span>
        <div>
        <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
        <button data-id="${item._id}"class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
    </li>`
}
 
let input_field = document.getElementById("input-field")

document.getElementById("form").addEventListener("submit",function(e){
    e.preventDefault()

    axios.post('/add-item',{text: input_field.value}).then(function(response){
        document.getElementById("list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
        input_field.value = ""
        input_field.focus()
    }).catch(function(){
        console.log("Try again later")
    })
})

//Client Side Rendering
let ourHTML = items.map(function(item) {
    return itemTemplate(item)
}).join('')

document.getElementById("list").insertAdjacentHTML("beforeend",ourHTML)