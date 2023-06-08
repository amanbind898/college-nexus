// JavaScript code goes here
document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Get the search query entered by the user
    var searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();
  
    // Perform the search operation
    searchPages(searchQuery);
  });
  
  function searchPages(query) {
    // Perform the search operation here
    // You can use JavaScript to search through the pages you have added based on the query
    // For example, you can check if the query matches the college names or any other relevant information
  
    // Once you have the search results, you can redirect the user to the appropriate page(s)
    // You can modify the code below to match the URLs of your pages
    if (query === "iit") {
      window.location.href = "iit.html";
    } else if (query === "nit") {
      window.location.href = "nit.html";
    } else if (query === "iiit") {
      window.location.href = "iiit.html";
    } else {
      // Handle the case when no matching results are found
      alert("No results found for your search query.");
    }
  }
  