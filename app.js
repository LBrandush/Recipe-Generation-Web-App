const query = ['chicken', 'beef', 'tomato', 'strawberries', 'rice', 'salmon', 'garlic' ];

const mainHeadline = document.querySelector('.main-headline');
const ingredient = document.querySelector('.ingredient');
const recipeContainer = document.querySelector('.recipe-container');
const main = document.querySelector('main');

let term;
let categoryID;

function getQuery(term) {
    let url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${term}`;
    fetch(url)
    .then(meal => {
        return meal.json()
    })
    
    .then(displayMealResults)
}
    
window.addEventListener('DOMContentLoaded', (e) => {
    term = query[Math.floor(Math.random() * query.length)];
   //console.log(term);
    getQuery(term);

});

function displayMealResults(results) {
   
  
    let array = results.meals;

    
    recipeContainer.innerHTML="";
    if (array !== null) {
    
        array.forEach(recipe => {
            recipeContainer.innerHTML += `<div class="recipe-card">
            <div class="recipe-image"><img src="${recipe.strMealThumb}"></div>
            <div class="title">${recipe.strMeal}</div>
            <button class="view-more" data-id="${recipe.idMeal}">View Recipe</button>
        </div>`
        })
    } else {
        recipeContainer.innerHTML = `<div class="main-headline">Sorry! We don't have any suggestions to help you use up your ${term}. But you can always eat ice cream!`;
    }

    const buttons = document.querySelectorAll('.view-more');



buttons.forEach(button => {
    button.addEventListener('click', e => {
        const id = e.target.dataset.id;
        let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    fetch(url)
    .then(meal => {
        return meal.json()
    })
    .then(showRecipe)
        })
       
    })


}

function showRecipe(result) {
    //console.log(result);
    //mainHeadline.innerHTML="";
    recipeContainer.innerHTML="";

    //get the array for the ingredient quantities
    let quantities = [];

    for(let i=1; i<=20; i++) {
        if(result.meals[0][`strMeasure${i}`]) {
            quantities.push(result.meals[0][`strMeasure${i}`]);
            }
    }
    
   quantities = quantities.filter(x => {
        return x != " ";
    })
    //console.log(quantities);

    

    

    //get the array for the ingredients

    let ingredients=[];

    for(let i=1; i<=20; i++) {
        if(result.meals[0][`strIngredient${i}`]) {
            ingredients.push(result.meals[0][`strIngredient${i}`]);
        }
    }


    // combine the two arrays into 1 array


    let ingredientList = quantities.map((e, i) =>  e + " " + ingredients[i])

    // add <li></li> to the ingredient list array items
    
    //console.log(ingredientList);

    ingredientList = ingredientList.map(ingredient => "<li>" + ingredient + "</li>");
    
    // join the array into one long string to insert on page
    let newIngredients=ingredientList.join("");


    


    recipeContainer.innerHTML=` <div class="full-recipe-container">
    <div class="individual-recipe-title"><span>${result.meals[0].strMeal}</span></div>
    <div class="recipe-details">
        <div class="full-recipe-photo"><img src="${result.meals[0].strMealThumb}"></div>
        <div class="full-recipe-details"><span class="recipe-category">${result.meals[0].strArea} Cuisine, ${result.meals[0].strCategory} Recipes</span> <br />
        <div class="youtube"><i class="fab fa-youtube"></i><a href="${result.meals[0].strYoutube}" target="_blank">Watch the Video</a> </div>
     <p><span class="ingredients">What You'll Need: <br />
     <ul>
     ${newIngredients}
     </ul></span></p></div>
    </div>
    <div class="recipe-directions">
         <span class="directions-header">Directions:</span>
        <span class="directions-text"><p> ${result.meals[0].strInstructions}</p></span>
        <p><button class="category" data-id="${result.meals[0].strCategory}"> View More ${result.meals[0].strCategory} Recipes</button>
    </div>
    
 </div>`

 let categoryButton = document.querySelector('.category');

 categoryButton.addEventListener('click', (e) => {
    let categoryID = e.target.dataset.id;
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryID}`)
    .then(meal => {
        return meal.json()
    })
    .then(displayCategoryHeadline(categoryID))
    .then(displayMealResults)
 })

}

function displayCategoryHeadline(categoryID) {
   return mainHeadline.innerHTML = `Browse our <span class="ingredient">${categoryID.toLowerCase()}</span> recipes`;
 }

//pull up the search results

const form = document.querySelector('.form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    term = (e.target['search'].value);
    getQuery(term);
    displayMealResults();

   
});











