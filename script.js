const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  results.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await res.json();

    if (!data.meals) {
      results.innerHTML = "<p>No recipes found. Try another search.</p>";
      return;
    }

    results.innerHTML = "";
    data.meals.forEach((meal) => {
      const card = document.createElement("div");
      card.className = "recipe-card";

      // Build ingredient list
      let ingredients = "";
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
          ingredients += `<li>${measure} ${ingredient}</li>`;
        }
      }

      card.innerHTML = `
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
  <div class="info">
    <h3>${meal.strMeal}</h3>
    <ul>${ingredients}</ul>
    <a href="${
      meal.strSource || meal.strYoutube
    }" target="_blank">View Recipe</a>
  </div>
`;

      results.appendChild(card);
    });
  } catch (err) {
    results.innerHTML = "<p>Something went wrong. Please try again later.</p>";
  }
});

// THEME TOGGLE
const themeBtn = document.getElementById("toggle-theme");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.setAttribute("data-theme", "dark");
  themeBtn.textContent = "☀️";
} else {
  themeBtn.textContent = "🌓";
}

themeBtn.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";

  if (isDark) {
    document.body.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    themeBtn.textContent = "🌓";
  } else {
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeBtn.textContent = "☀️";
  }
});
// RANDOM RECIPE
const randomBtn = document.getElementById("random-btn");

randomBtn.addEventListener("click", async () => {
  results.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const data = await res.json();

    const meal = data.meals[0];
    const card = document.createElement("div");
    card.className = "recipe-card";

    // Same ingredients logic
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredients += `<li>${measure} ${ingredient}</li>`;
      }
    }

    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="info">
        <h3>${meal.strMeal}</h3>
        <ul>${ingredients}</ul>
        <a href="${
          meal.strSource || meal.strYoutube
        }" target="_blank">View Recipe</a>
      </div>
    `;

    results.innerHTML = "";
    results.appendChild(card);
  } catch {
    results.innerHTML = "<p>Something went wrong. Try again.</p>";
  }
});
