import React, { useEffect } from 'react';

function Theme() {
  // Function to update the theme dynamically
  const changeTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme); // Apply theme to the document
  };

  // Event listener for theme change
  useEffect(() => {
    const themeControllers = document.querySelectorAll('.theme-controller');
    themeControllers.forEach((controller) => {
      controller.addEventListener('change', (e) => {
        changeTheme(e.target.value);
      });
    });

    // Cleanup event listeners on component unmount
    return () => {
      themeControllers.forEach((controller) => {
        controller.removeEventListener('change', (e) => {
          changeTheme(e.target.value);
        });
      });
    };
  }, []);

  return (
    <div className="join join-vertical">
      <input
        type="radio"
        name="theme-buttons"
        className="btn theme-controller join-item"
        aria-label="Default"
        value="light" // DaisyUI's default "light" theme
        defaultChecked
      />
      <input
        type="radio"
        name="theme-buttons"
        className="btn theme-controller join-item"
        aria-label="colors_Orange"
        value="retro" // DaisyUI's "retro" theme
      />
      <input
        type="radio"
        name="theme-buttons"
        className="btn theme-controller join-item"
        aria-label="Cyberpunk"
        value="cyberpunk" // DaisyUI's "cyberpunk" theme
      />
      <input
        type="radio"
        name="theme-buttons"
        className="btn theme-controller join-item"
        aria-label="Valentine"
        value="valentine" // DaisyUI's "valentine" theme
      />
      <input
        type="radio"
        name="theme-buttons"
        className="btn theme-controller join-item"
        aria-label="Aqua"
        value="aqua" // DaisyUI's "aqua" theme
      />
    </div>
  );
}

export default Theme;
