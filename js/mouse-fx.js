/**
 * MouseFX - Modern Tile Interactions & Clean System Cursor
 * Features:
 * - Clean default system cursor (all artificial rings, circles, and particle trails removed)
 * - Tile Focus Physics: Hovered tile scales slightly larger, sibling tiles scale slightly smaller (NO 3D TILT)
 * - Live HUD mouse telemetry coordinates
 */

class MouseFX {
  constructor() {
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.init();
  }

  init() {
    this.bindEvents();
    this.initTileInteractions();
    this.initMagneticButtons();
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Update HUD telemetry coordinates in footer
      const hudCoords = document.getElementById('hud-mouse-coords');
      if (hudCoords) {
        hudCoords.textContent = `X:${Math.round(this.mouse.x)} Y:${Math.round(this.mouse.y)}`;
      }
    });
  }

  /**
   * Tile Focus Engine (No 3D Tilt):
   * When cursor is over a particular tile:
   * - Hovered tile scales slightly larger (scale 1.04)
   * - Other side tiles scale slightly smaller (scale 0.975)
   */
  initTileInteractions() {
    const tileSelectors = '.tilt-card, .stat-chip, .affiliation-card, .timeline-card, .project-card, .skill-category-card, .edu-card, .contact-card-box, .contact-form-box, .hologram-card, .orbit-terminal-card';
    const cards = document.querySelectorAll(tileSelectors);

    // Grouping containers for sibling shrinking
    const groupContainers = document.querySelectorAll('.hero-stats-row, .affiliations-grid, .timeline-container, .projects-grid, .skills-matrix-grid, .education-grid, .contact-grid');

    groupContainers.forEach((container) => {
      const childTiles = container.querySelectorAll(tileSelectors);
      if (!childTiles.length) return;

      childTiles.forEach((tile) => {
        tile.addEventListener('mouseenter', () => {
          childTiles.forEach((sibling) => {
            if (sibling === tile) {
              sibling.style.transform = 'scale(1.04) translateY(-3px)';
              sibling.style.zIndex = '10';
              sibling.style.opacity = '1';
            } else {
              sibling.style.transform = 'scale(0.975)';
              sibling.style.opacity = '0.82';
              sibling.style.zIndex = '1';
            }
          });
        });

        tile.addEventListener('mouseleave', () => {
          tile.style.transform = '';
          tile.style.zIndex = '';
          tile.style.opacity = '';
        });
      });

      container.addEventListener('mouseleave', () => {
        childTiles.forEach((sibling) => {
          sibling.style.transform = '';
          sibling.style.zIndex = '';
          sibling.style.opacity = '';
        });
      });
    });

    // Standalone cards (hologram avatar, orbit terminal, about card)
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });

      if (!card.closest('.hero-stats-row, .affiliations-grid, .timeline-container, .projects-grid, .skills-matrix-grid, .education-grid, .contact-grid')) {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'scale(1.03) translateY(-3px)';
          card.style.zIndex = '5';
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.zIndex = '';
        });
      }
    });
  }

  initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }
}

// Instantiate once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.mouseFX = new MouseFX();
});
