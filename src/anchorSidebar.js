// Select the main content and sidebar elements
const mainContent = document.querySelector('[data-content="main"]');
const sidebar = document.querySelector('[data-content="sidebar"]');

if (mainContent && sidebar) {
  // Find all H1 and H2 elements inside the main content
  const headings = mainContent.querySelectorAll('h1, h2, h3');

  // Iterate through each heading
  headings.forEach((heading, index) => {
    // Generate an ID by using the text content of the heading
    const textContent = heading.textContent.trim();
    const id = textContent.replace(/\s+/g, '-').toLowerCase();

    // Assign the ID to the heading
    heading.id = id;

    // Create a link element
    const link = document.createElement('a');
    link.href = `#${id}`; // Link to the section
    link.className = 'text-link-background'; // Add the required class
    link.textContent = textContent; // Use the text of the heading for the link

    // Append the link to the sidebar
    sidebar.appendChild(link);
  });
} else {
  console.error('Main content or sidebar not found!');
}
