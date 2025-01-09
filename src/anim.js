gsap.registerPlugin(ScrollTrigger);
// Loop through all elements with a data-anim attribute
gsap.utils.toArray('[data-anim]').forEach((parent) => {
  const durationMs = parseInt(parent.getAttribute('data-anim'), 10) || 600; // Default to 300ms if not set
  const duration = durationMs / 1000; // Convert to seconds for GSAP
  const distance = durationMs > 700 ? 100 : 40; // Double the distance if duration >

  console.log(`Animating parent element:`, parent, `Duration: ${duration}s, Distance: ${distance}px`);

  // Animate the parent element
  gsap.fromTo(
    parent,
    { opacity: 0, y: distance }, // Initial state
    {
      opacity: 1,
      y: 0,
      duration: duration, // Animation duration in seconds
      ease: "power1.out", // Start fast and slow down
      scrollTrigger: {
        trigger: parent,
        start: "top bottom", // Start when the top of the parent hits the bottom of the viewport
        toggleActions: "play none none none",
      },
    }
  );

  // Animate all descendants of the parent element
  const descendants = parent.children; // Select all direct children
  gsap.utils.toArray(descendants).forEach((descendant, index) => {
    console.log('Animating descendant element:', descendant);

    gsap.fromTo(
      descendant,
      { opacity: 0, y: distance }, // Initial state
      {
        opacity: 1,
        y: 0,
        duration: duration * .6, // Half the duration for descendants
        delay: index * 0.1, // Add 0.08s delay for each descendant
        ease: "power1.out", // Apply easing to child animations
        scrollTrigger: {
          trigger: parent, // Use the parent as the scroll trigger
          start: "top bottom", // Same trigger point as parent
          toggleActions: "play none none none",
        },
      }
    );
  });
});
