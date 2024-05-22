let fetchData = [];
const fetchCategories = () => {
  fetch("https://openapi.programming-hero.com/api/news/categories")
    .then((res) => res.json())
    .then((data) => showCategories(data.data));
};

const showCategories = (data) => {
  // console.log(data);
  const categoriesContainer = document.getElementById("categories-container");
  data.news_category.forEach((singleCategories) => {
    // console.log(singleCategories);
    const linkContainer = document.createElement("p");
    linkContainer.innerHTML = `<a class="nav-link" href="#" onclick="fetchCategoriesNewses('${singleCategories.category_id}', '${singleCategories.category_name}')")>${singleCategories?.category_name}</a>`;
    categoriesContainer.appendChild(linkContainer);
  });
};

const fetchCategoriesNewses = (category_id, category_name) => {
  const url = `https://openapi.programming-hero.com/api/news/category/${category_id}`;
  // console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      fetchData = data.data;
      showAllNews(data.data, category_name);
    });
};

const showAllNews = (data, category_name) => {
  console.log(data, category_name);
  document.getElementById("news-count").innerText = data.length;
  document.getElementById("category-name").innerText = category_name;
  const newsContainer = document.getElementById("all-news");
  newsContainer.innerHTML = " ";
  data.forEach((singleNews) => {
    const { _id, image_url, title, details, author, total_view, rating } =
      singleNews;
    const card = document.createElement("div");
    card.classList.add("card", "mb-3");
    card.innerHTML = `   <div class="row g-0">
    <div class="col-md-4">
      <img src="${image_url}" class="img-fluid rounded-start" alt="...">
    </div>
    <div class="col-md-8 d-flex flex-column">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${details.slice(0, 200)}</p>
        <p class="card-text"><small class="text-body-secondary"></small></p>
      </div>
     <div class="card-footer border-0 bg-body d-flex justify-content-between">
          <div class="d-flex gap-2">
             <img src="${
               author.img
             }" class="img-fluid rounded-circle" alt="..." height= "40" width="40">
             <div>
              <p class="m-0 p-0">${
                author.name ? author.name : "Not available"
              }</p>
              <p class="m-0 p-0">${author.published_date}</p>
             </div>
          </div>
              <div class="d-flex align-items-center gap-2">
             <i class="fas fa-eye text-dark"></i>
             
             <p class="m-0 p-0">${total_view ? total_view : "not available"}</p>
          </div>
     
            <div class="d-flex align-items-center gap-2">
              ${generateStare(rating.number)}
             <P>${rating.number}</p>
             
          </div>
               <div class="d-flex align-items-center gap-2">
             <i class="fas fa-arrow-right text-primary" onclick="fetchNewsDetail('${_id}')" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
          </div>
               
        </div>
    </div> 
  </div>`;
    newsContainer.appendChild(card);
  });
};

const fetchNewsDetail = (news_id) => {
  const url = `https://openapi.programming-hero.com/api/news/${news_id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => showAllNewsDetail(data.data[0]));
};

const showAllNewsDetail = (newDetail) => {
  const { _id, image_url, title, details, author, total_view, others_info } =
    newDetail;

  document.getElementById("modal-body").innerHTML = `
  <h1 class="modal-title fs-8" id="exampleModalLabel">${author.name}</h1>
  <div class="card mb-3">
  <div class="row g-0">
    <div class="col-md-12">
      <img src="${image_url}" class="img-fluid rounded-start" alt="...">
    </div>
    <div class="col-md-12 d-flex flex-column">
      <div class="card-body">
        <h5 class="card-title">${title} <span class="badge text-bg-warning">${
    others_info.is_trending ? "trending" : "not trending"
  }</span></h5>
        <p class="card-text">${details}</p>
        <p class="card-text"><small class="text-body-secondary"></small></p>
      </div>
     <div class="card-footer border-0 bg-body d-flex justify-content-between">
          <div class="d-flex gap-2">
             <img src="${
               author.img
             }" class="img-fluid rounded-circle" alt="..." height= "40" width="40">
             <div>
              <p class="m-0 p-0">${
                author.name ? author.name : "Not available"
              }</p>
              <p class="m-0 p-0">${author.published_date}</p>
             </div>
          </div>
              <div class="d-flex align-items-center gap-2">
             <i class="fas fa-eye text-dark"></i>
             
             <p class="m-0 p-0">${total_view ? total_view : "Not available"}</p>
          </div>
     
            <div class="d-flex align-items-center gap-2">
             <i class="fas fa-star text-warning"></i>
             <i class="fas fa-star text-warning"></i>
             <i class="fas fa-star text-warning"></i>
             <i class="fas fa-star text-warning"></i>
             <i class="fas fa-star-half text-warning"></i>
          </div>       
        </div>
    </div> 
  </div>
  </div>
  `;
};

const showTrending = () => {
  let trendingNews = fetchData.filter(
    (singleData) => singleData.others_info.is_trending === true
  );
  const category_name = document.getElementById("category-name").innerText;
  showAllNews(trendingNews, category_name);
};

const showTodaysPick = () => {
  let todayPick = fetchData.filter(
    (todayPickData) => todayPickData.others_info.is_todays_pick === false
  );
  // console.log(todayPick);
  const category_names = document.getElementById("category-name").innerText;
  showAllNews(todayPick, category_names);
};

const generateStare = (rating) => {
  let ratingHTML = "";
  for (let i = 1; i <= Math.floor(rating); i++) {
    ratingHTML += `<i class="fas fa-star text-warning"></i>`;
  }
  if (rating - Math.floor(rating) > 0) {
    ratingHTML += `<i class="fas fa-star-half text-warning"></i>`;
  }
  return ratingHTML;
};
