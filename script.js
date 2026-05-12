console.log("Sarkari Yojna Setu Loaded");

// ================= GLOBAL =================
let schemes = [];
let currentLang = "en";
let savedSchemes = JSON.parse(localStorage.getItem("savedSchemes")) || [];


// ================= VIDEO PATH =================
function fixVideoPath(path) {
  if (!path) return "";
  return path;
}


// ================= LOAD DATA =================
async function loadSchemes() {

  try {

    const res = await fetch("data/schemes.json");

    schemes = await res.json();

    console.log("Schemes Loaded:", schemes);

    displaySchemes(schemes);

    renderTopSchemes();

    renderSavedSchemes();

  } catch (err) {

    console.error("Error loading data:", err);

  }
}


// ================= DISPLAY SCHEMES =================
function displaySchemes(data) {

  const container = document.getElementById("container");

  container.innerHTML = "";

  if (!data || data.length === 0) {

    container.innerHTML = `
      <p>
        ${currentLang === "en"
          ? "No schemes found"
          : "कोई योजना नहीं मिली"}
      </p>

      <button onclick="resetFilters()">
        ${currentLang === "en"
          ? "Reset Filters"
          : "फ़िल्टर रीसेट करें"}
      </button>
    `;

    return;
  }

  data.forEach(s => {

    const div = document.createElement("div");

    div.className = "card";

    const summary =
      (currentLang === "en"
        ? s.summary_en
        : s.summary_hi)?.split("\n")[0] || "";

    const isSavedState = savedSchemes.includes(s.id);

    const videoPath = fixVideoPath(s.video);

    div.innerHTML = `

      <div class="card-top">

        <img 
          src="${s.image || 'assets/images/default.jpg'}"
          alt="${s.name_en}"
          onerror="this.src='assets/images/default.jpg'"
        >

       <video
  src="${videoPath}"
  muted
  loop
  playsinline
  preload="none"
  poster="${s.image}"
></video>
        <span
          class="bookmark ${isSavedState ? "saved" : ""}"
          onclick="event.stopPropagation(); toggleBookmark(${s.id})"
        >
          ⭐
        </span>

      </div>

      <h3>
        ${currentLang === "en"
          ? s.name_en
          : s.name_hi}
      </h3>

      <p class="summary">${summary}</p>

      <a
        href="${s.apply_link}"
        target="_blank"
        class="apply-btn"
        onclick="event.stopPropagation()"
      >
        ${currentLang === "en"
          ? "🚀 Apply Now"
          : "🚀 अभी आवेदन करें"}
      </a>

    `;

    div.onclick = () => showDetails(s);

    container.appendChild(div);

  });

  renderSavedSchemes();
}


// ================= TOP SCHEMES =================
function renderTopSchemes() {

  const container = document.getElementById("topContainer");

  if (!container) return;

  container.innerHTML = "";

  const top = schemes.slice(0, 5);

  top.forEach(s => {

    const videoPath = fixVideoPath(s.video);

    const div = document.createElement("div");

    div.className = "card";

    div.innerHTML = `

      <div class="card-top">

        <img
          src="${s.image || 'assets/images/default.jpg'}"
          onerror="this.src='assets/images/default.jpg'"
        >

       <video
  src="${videoPath}"
  muted
  loop
  playsinline
  preload="none"
  poster="${s.image}"
></video>

      </div>

      <h3>
        ${currentLang === "en"
          ? s.name_en
          : s.name_hi}
      </h3>

    `;

    div.onclick = () => showDetails(s);

    container.appendChild(div);

  });
}


// ================= FILTER =================
function applyFilter() {

  const sector =
    document.getElementById("sectorFilter")?.value || "";

  const gender =
    document.getElementById("genderFilter")?.value || "";

  const age =
    document.getElementById("ageFilter")?.value || "";

  const income =
    document.getElementById("incomeFilter")?.value || "";

  const search =
    document.getElementById("searchInput")
      ?.value?.toLowerCase() || "";

  const filtered = schemes.filter(s => {

    return (

      (!sector || s.category === sector) &&

      (!gender ||
        s.gender === gender ||
        s.gender === "All") &&

      (!age ||
        s.age_group === age ||
        s.age_group === "All") &&

      (!income ||
        s.income_group === income ||
        s.income_group === "All") &&

      (!search ||

        s.name_en.toLowerCase().includes(search) ||

        s.name_hi.includes(search))

    );

  });

  displaySchemes(filtered);
}


// ================= SEARCH =================
function searchSchemes() {

  applyFilter();

}


function toggleLanguage() {

  currentLang =
    currentLang === "en"
      ? "hi"
      : "en";

  // ================= HERO =================
  document.getElementById("heroTitle").innerText =
    currentLang === "en"
      ? "Find the Right Government Scheme for You"
      : "अपने लिए सही सरकारी योजना खोजें";

  document.getElementById("heroSubtitle").innerText =
    currentLang === "en"
      ? "Filter by age, income, sector and explore benefits easily"
      : "आयु, आय और क्षेत्र के अनुसार योजनाएँ खोजें";


  // ================= SECTION TITLES =================
  document.getElementById("topTitle").innerText =
    currentLang === "en"
      ? "🔥 Top Schemes"
      : "🔥 प्रमुख योजनाएँ";

  document.getElementById("savedTitle").innerText =
    currentLang === "en"
      ? "⭐ Saved Schemes"
      : "⭐ सहेजी गई योजनाएँ";

  document.getElementById("allTitle").innerText =
    currentLang === "en"
      ? "📋 All Schemes"
      : "📋 सभी योजनाएँ";


  // ================= SEARCH =================
  const searchInput =
    document.getElementById("searchInput");

  searchInput.placeholder =
    currentLang === "en"
      ? searchInput.dataset.en
      : searchInput.dataset.hi;

  document.getElementById("searchBtn").innerText =
    currentLang === "en"
      ? "Search"
      : "खोजें";


  // ================= FILTER DEFAULTS =================
  document.getElementById("sectorDefault").innerText =
    currentLang === "en"
      ? "All Sectors"
      : "सभी क्षेत्र";

  document.getElementById("genderDefault").innerText =
    currentLang === "en"
      ? "All Gender"
      : "सभी लिंग";

  document.getElementById("ageDefault").innerText =
    currentLang === "en"
      ? "All Age"
      : "सभी आयु";

  document.getElementById("incomeDefault").innerText =
    currentLang === "en"
      ? "All Income"
      : "सभी आय";


  // ================= FILTER OPTIONS =================

  // SECTOR
  const sectorOptions =
    document.querySelectorAll("#sectorFilter option");

  if (sectorOptions.length > 1) {

    sectorOptions[1].text =
      currentLang === "en" ? "Health" : "स्वास्थ्य";

    sectorOptions[2].text =
      currentLang === "en" ? "Education" : "शिक्षा";

    sectorOptions[3].text =
      currentLang === "en" ? "Agriculture" : "कृषि";

    sectorOptions[4].text =
      currentLang === "en" ? "Housing" : "आवास";

    sectorOptions[5].text =
      currentLang === "en" ? "Business" : "व्यवसाय";

    sectorOptions[6].text =
      currentLang === "en" ? "Skill" : "कौशल";

    sectorOptions[7].text =
      currentLang === "en" ? "Finance" : "वित्त";

    sectorOptions[8].text =
      currentLang === "en" ? "Women" : "महिला";

    sectorOptions[9].text =
      currentLang === "en" ? "Social" : "सामाजिक";
  }


  // GENDER
  const genderOptions =
    document.querySelectorAll("#genderFilter option");

  if (genderOptions.length > 1) {

    genderOptions[1].text =
      currentLang === "en" ? "Male" : "पुरुष";

    genderOptions[2].text =
      currentLang === "en" ? "Female" : "महिला";

    genderOptions[3].text =
      currentLang === "en" ? "All" : "सभी";
  }


  // AGE
  const ageOptions =
    document.querySelectorAll("#ageFilter option");

  if (ageOptions.length > 1) {

    ageOptions[1].text =
      currentLang === "en" ? "Child" : "बच्चा";

    ageOptions[2].text =
      currentLang === "en" ? "Youth" : "युवा";

    ageOptions[3].text =
      currentLang === "en" ? "Adult" : "वयस्क";

    ageOptions[4].text =
      currentLang === "en" ? "Senior" : "वरिष्ठ";
  }


  // INCOME
  const incomeOptions =
    document.querySelectorAll("#incomeFilter option");

  if (incomeOptions.length > 1) {

    incomeOptions[1].text =
      currentLang === "en" ? "Low" : "कम";

    incomeOptions[2].text =
      currentLang === "en" ? "Middle" : "मध्यम";

    incomeOptions[3].text =
      currentLang === "en" ? "High" : "उच्च";
  }


  // ================= REFRESH =================
  applyFilter();

  renderTopSchemes();

  renderSavedSchemes();
}

// ================= TOGGLE TOP SCHEMES =================

function toggleTopSchemes() {

  const section =
    document.getElementById("topSchemesSection");

  const btn =
    document.getElementById("topToggleBtn");


  // CHECK CURRENT STATE
  const isHidden =
    section.style.display === "none";


  // ================= SHOW =================
  if (isHidden) {

    section.style.display = "block";

    btn.innerText =
      currentLang === "en"
      ? "🔼 Hide Top Schemes"
      : "🔼 प्रमुख योजनाएँ छुपाएँ";


    // SMOOTH SCROLL
    setTimeout(() => {

      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 100);

  }

  // ================= HIDE =================
  else {

    section.style.display = "none";

    btn.innerText =
      currentLang === "en"
      ? "🔥 Show Top Schemes"
      : "🔥 प्रमुख योजनाएँ दिखाएँ";

  }

}



// ================= MODAL =================

function showDetails(s) {

  const modal =
    document.getElementById("modal");


  // TITLE
  document.getElementById("modalTitle").innerText =

    currentLang === "en"
      ? s.name_en
      : s.name_hi;


  // DESCRIPTION
  document.getElementById("modalDesc").innerHTML = `

    <b>
      ${currentLang === "en"
        ? "Summary"
        : "सारांश"}
      :
    </b>

    <br><br>

    ${(currentLang === "en"
      ? s.summary_en
      : s.summary_hi).replace(/\n/g, "<br>")}

    <br><br>

    <b>
      ${currentLang === "en"
        ? "Details"
        : "विवरण"}
      :
    </b>

    <br><br>

    ${(currentLang === "en"
      ? s.description_en
      : s.description_hi).replace(/\n/g, "<br>")}

  `;


  // IMAGE
  const img =
    document.getElementById("modalImage");

  img.src =
    s.image || "assets/images/default.jpg";


  // ================= VIDEO =================

  const video =
    document.getElementById("modalVideo");

  const videoPath =
    fixVideoPath(s.video);


  // RESET VIDEO
  video.pause();

  video.currentTime = 0;

  video.style.display = "none";

  video.offsetHeight;

  video.style.display = "block";


  // SET VIDEO
  video.src = videoPath;

  video.load();


  // ENABLE AUDIO
  video.muted = false;


  // AUTOPLAY
  video.play().catch(() => {

    console.log("Autoplay blocked");

  });


  // ERROR HANDLE
  video.onerror = () => {

    console.log("Video failed:", videoPath);

    video.style.display = "none";

  };


  // APPLY BUTTON
  document.getElementById("modalApplyBtn").href =
    s.apply_link || "#";

  document.getElementById("modalApplyBtn").innerText =
    currentLang === "en"
      ? "🚀 Apply Now"
      : "🚀 अभी आवेदन करें";


  // SHOW MODAL
  modal.classList.remove("hidden");

}
// ================= CLOSE =================
function closeModal() {

  const video =
    document.getElementById("modalVideo");

  video.pause();

  video.currentTime = 0;

  video.src = "";

  video.load();

  document
    .getElementById("modal")
    .classList.add("hidden");
}


// ================= BOOKMARK =================
function toggleBookmark(id) {

  if (savedSchemes.includes(id)) {

    savedSchemes =
      savedSchemes.filter(
        sid => sid !== id
      );

  } else {

    savedSchemes.push(id);

  }

  localStorage.setItem(
    "savedSchemes",
    JSON.stringify(savedSchemes)
  );

  applyFilter();
}


// ================= SAVED =================
function renderSavedSchemes() {

  const container =
    document.getElementById("savedContainer");

  if (!container) return;

  const saved =
    schemes.filter(s =>
      savedSchemes.includes(s.id));

  container.innerHTML = "";

  if (saved.length === 0) {

    container.innerHTML = `
      <p>
        ${currentLang === "en"
          ? "No saved schemes"
          : "कोई सहेजी गई योजना नहीं"}
      </p>
    `;

    return;
  }

  saved.forEach(s => {

    const div =
      document.createElement("div");

    div.className = "card";

    div.innerHTML = `

      <div class="card-top">

        <img
          src="${s.image}"
          onerror="this.src='assets/images/default.jpg'"
        >

      </div>

      <h3>
        ${currentLang === "en"
          ? s.name_en
          : s.name_hi}
      </h3>

      <a
        href="${s.apply_link}"
        target="_blank"
        class="apply-btn"
        onclick="event.stopPropagation()"
      >
        ${currentLang === "en"
          ? "🚀 Apply"
          : "🚀 आवेदन करें"}
      </a>

    `;

    div.onclick = () => showDetails(s);

    container.appendChild(div);

  });
}


// ================= RESET =================
function resetFilters() {

  document.getElementById("sectorFilter").value = "";

  document.getElementById("genderFilter").value = "";

  document.getElementById("ageFilter").value = "";

  document.getElementById("incomeFilter").value = "";

  document.getElementById("searchInput").value = "";

  displaySchemes(schemes);
}


// ================= EVENTS =================
function setupEvents() {

  document
    .getElementById("sectorFilter")
    ?.addEventListener("change", applyFilter);

  document
    .getElementById("genderFilter")
    ?.addEventListener("change", applyFilter);

  document
    .getElementById("ageFilter")
    ?.addEventListener("change", applyFilter);

  document
    .getElementById("incomeFilter")
    ?.addEventListener("change", applyFilter);

  document
    .getElementById("searchInput")
    ?.addEventListener("input", applyFilter);

  document
    .getElementById("langBtn")
    ?.addEventListener("click", toggleLanguage);

}


// ================= INIT =================
window.onload = () => {

  setupEvents();

  loadSchemes();

};