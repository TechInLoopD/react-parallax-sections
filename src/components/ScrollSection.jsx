import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger, CustomEase, SplitText } from "gsap/all";
import Lenis from "@studio-freight/lenis";
import "./ScrollSection.css";

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);
CustomEase.create("customEase", "M0,0 C0.86,0 0.07,1 1,1");





let lenis;

// Small SoundManager (same as CodePen)
class SoundManager {
  constructor() {
    this.sounds = {};
    this.isEnabled = false;
    this.init();
  }
  init() {
    this.loadSound("hover", "https://assets.codepen.io/7558/click-reverb-001.mp3", 0.15);
    this.loadSound("click", "https://assets.codepen.io/7558/shutter-fx-001.mp3", 0.3);
    this.loadSound("textChange", "https://assets.codepen.io/7558/whoosh-fx-001.mp3", 0.3);
  }
  loadSound(name, url, volume = 0.3) {
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.volume = volume;
    this.sounds[name] = audio;
  }
  enableAudio() {
    this.isEnabled = true;
    window.__soundEnabled__ = true;
  }
  play(name, delay = 0) {
    if (!this.isEnabled || !this.sounds[name]) return;
    try {
      if (delay > 0) {
        setTimeout(() => {
          this.sounds[name].currentTime = 0;
          this.sounds[name].play().catch(() => {});
        }, delay);
      } else {
        this.sounds[name].currentTime = 0;
        this.sounds[name].play().catch(() => {});
      }
    } catch (e) {}
  }
  addSound(name, url, volume = 0.3) {
    this.loadSound(name, url, volume);
  }
}

const soundManager = new SoundManager();
window.soundManager = soundManager;

export default function ScrollSection() {
  useEffect(() => {
    // wait for fonts then init
    document.fonts.ready.then(() => {
      initLenis();
      initPage();
    });

    function initLenis() {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    function splitFeaturedWords() {
      const contents = document.querySelectorAll(".featured-content h3");
      contents.forEach((h3) => {
        if (h3.dataset.split) return;
        const text = h3.textContent.trim();
        const words = text.split(" ");
        h3.innerHTML = "";
        words.forEach((w, i) => {
          const wrapper = document.createElement("div");
          wrapper.className = "word-mask inline-block overflow-hidden";
          const span = document.createElement("div");
          span.className = "split-word inline-block";
          span.textContent = w + (i < words.length - 1 ? " " : "");
          wrapper.appendChild(span);
          h3.appendChild(wrapper);
        });
        h3.dataset.split = "true";
      });
    }

    function initPage() {
      splitFeaturedWords();

      const loadingOverlay = document.getElementById("loading-overlay");
      const loadingCounter = document.getElementById("loading-counter");
      let counter = 0;
      const counterInterval = setInterval(() => {
        counter += Math.random() * 3 + 1;
        if (counter >= 100) {
          counter = 100;
          clearInterval(counterInterval);
          setTimeout(() => {
            try {
              gsap.to(loadingOverlay.querySelector(".loading-counter"), {
                opacity: 0,
                y: -20,
                duration: 0.6,
                ease: "power2.inOut"
              });
              gsap.to(loadingOverlay.childNodes[0], {
                opacity: 0,
                y: -20,
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                  gsap.to(loadingOverlay, {
                    y: "-100%",
                    duration: 1.2,
                    ease: "power3.inOut",
                    delay: 0.3,
                    onComplete: () => {
                      loadingOverlay.style.display = "none";
                      animateColumns();
                    }
                  });
                }
              });
            } catch (e) {
              loadingOverlay.style.display = "none";
              animateColumns();
            }
          }, 200);
        }
        loadingCounter.textContent = `[${counter.toFixed(0).padStart(2, "0")}]`;
      }, 30);

      const fixedContainer = document.getElementById("fixed-container");
      const fixedSectionElement = document.querySelector(".fixed-section");
      const header = document.querySelector(".header");
      const content = document.querySelector(".content");
      const footer = document.getElementById("footer");
      const leftColumn = document.getElementById("left-column");
      const rightColumn = document.getElementById("right-column");
      const featured = document.getElementById("featured");
      const backgrounds = document.querySelectorAll(".background-image");
      const artists = document.querySelectorAll(".artist");
      const categories = document.querySelectorAll(".category");
      const featuredContents = document.querySelectorAll(".featured-content");
      const progressFill = document.getElementById("progress-fill");
      const currentSectionDisplay = document.getElementById("current-section");

      function animateColumns() {
        const artistItems = document.querySelectorAll(".artist");
        const categoryItems = document.querySelectorAll(".category");
        artistItems.forEach((item, index) => setTimeout(() => item.classList.add("loaded"), index * 60));
        categoryItems.forEach((item, index) => setTimeout(() => item.classList.add("loaded"), index * 60 + 200));
      }

      const splitTexts = {};
      featuredContents.forEach((content, index) => {
        const words = Array.from(content.querySelectorAll(".split-word"));
        splitTexts[`featured-${index}`] = { words };
        words.forEach((w) => {
          if (index !== 0) gsap.set(w, { yPercent: 100, opacity: 0 });
          else gsap.set(w, { yPercent: 0, opacity: 1 });
        });
      });

      gsap.set(fixedContainer, { height: "100vh" });

      const duration = 0.64;
      const fixedSectionTop = fixedSectionElement.offsetTop;
      const fixedSectionHeight = fixedSectionElement.offsetHeight;
      let currentSection = 0;
      let isAnimating = false;
      let isSnapping = false;
      let lastProgress = 0;
      let scrollDirection = 0;
      let sectionPositions = [];
      for (let i = 0; i < 10; i++) {
        sectionPositions.push(fixedSectionTop + (fixedSectionHeight * i) / 10);
      }

      function updateProgressNumbers() {
        currentSectionDisplay.textContent = (currentSection + 1).toString().padStart(2, "0");
      }

      function navigateToSection(index) {
        if (index === currentSection || isAnimating || isSnapping) return;
        soundManager.enableAudio();
        soundManager.play("click");
        isSnapping = true;
        const targetPosition = sectionPositions[index];
        changeSection(index);
        lenis.scrollTo(targetPosition, {
          duration: 0.8,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          lock: true,
          onComplete: () => { isSnapping = false; }
        });
      }

      artists.forEach((artist, index) => {
        artist.addEventListener("click", (e) => { e.preventDefault(); navigateToSection(index); });
        artist.addEventListener("mouseenter", () => { soundManager.enableAudio(); soundManager.play("hover"); });
      });
      categories.forEach((category, index) => {
        category.addEventListener("click", (e) => { e.preventDefault(); navigateToSection(index); });
        category.addEventListener("mouseenter", () => { soundManager.enableAudio(); soundManager.play("hover"); });
      });

      document.addEventListener("click", () => { soundManager.enableAudio(); }, { once: true });

      const mainScrollTrigger = ScrollTrigger.create({
        trigger: ".fixed-section",
        start: "top top",
        end: "bottom bottom",
        pin: ".fixed-container",
        pinSpacing: true,
        onUpdate: (self) => {
          if (isSnapping) return;
          const progress = self.progress;
          const progressDelta = progress - lastProgress;
          if (Math.abs(progressDelta) > 0.001) scrollDirection = progressDelta > 0 ? 1 : -1;
          const targetSection = Math.min(9, Math.floor(progress * 10));
          if (targetSection !== currentSection && !isAnimating) {
            const nextSection = currentSection + (targetSection > currentSection ? 1 : -1);
            snapToSection(nextSection);
          }
          lastProgress = progress;
          const sectionProgress = currentSection / 9;
          if (progressFill) progressFill.style.width = `${sectionProgress * 100}%`;
        }
      });

      function snapToSection(targetSection) {
        if (targetSection < 0 || targetSection > 9 || targetSection === currentSection || isAnimating) return;
        isSnapping = true;
        changeSection(targetSection);
        const targetPosition = sectionPositions[targetSection];
        lenis.scrollTo(targetPosition, {
          duration: 0.6,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          lock: true,
          onComplete: () => { isSnapping = false; }
        });
      }

function changeSection(newSection) {
  if (newSection === currentSection || isAnimating) return;
  isAnimating = true;
  const isScrollingDown = newSection > currentSection;
  const previousSection = currentSection;
  currentSection = newSection;
  updateProgressNumbers();
  const sectionProgress = currentSection / 9;
  if (progressFill) progressFill.style.width = `${sectionProgress * 100}%`;

  // Animate text words
  const prevWords = splitTexts[`featured-${previousSection}`]?.words;
  const newWords = splitTexts[`featured-${newSection}`]?.words;
  if (prevWords) {
    gsap.to(prevWords, {
      yPercent: isScrollingDown ? -100 : 100,
      opacity: 0,
      duration: duration * 0.6,
      stagger: isScrollingDown ? 0.03 : -0.03,
      ease: "customEase",
      onComplete: () => {
        featuredContents[previousSection].classList.remove("active");
        gsap.set(featuredContents[previousSection], { visibility: "hidden" });
      }
    });
  }

  if (newWords) {
    soundManager.play("textChange", 250);
    featuredContents[newSection].classList.add("active");
    gsap.set(featuredContents[newSection], { visibility: "visible", opacity: 1 });
    gsap.set(newWords, { yPercent: isScrollingDown ? 100 : -100, opacity: 0 });
    gsap.to(newWords, {
      yPercent: 0,
      opacity: 1,
      duration: duration,
      stagger: isScrollingDown ? 0.05 : -0.05,
      ease: "customEase"
    });
  }

  // 🟢 Background crossfade fix (no white screen)
// 🟢 Background fix — ensures no white screen
const allBackgrounds = gsap.utils.toArray(".background-image");

allBackgrounds.forEach((bg, i) => {
  // Always keep them visible but only active one is full opacity
  bg.style.display = "block";
  bg.style.position = "absolute";
  bg.style.top = 0;
  bg.style.left = 0;
  bg.style.width = "100%";
  bg.style.height = "100%";
  bg.style.objectFit = "cover";
  bg.style.backgroundColor = "black"; // fallback

  bg.style.display = "block";  // make sure it's never display:none

  if (i === newSection) {
    bg.classList.add("active");
    gsap.to(bg, {
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      onComplete: () => { isAnimating = false; }
    });
  } else {
    bg.classList.remove("active");
    gsap.to(bg, { opacity: 0, duration: 1, ease: "power2.out" });
  }
});


  // highlight clicked artist/category
  artists.forEach((artist, i) => {
    gsap.to(artist, {
      opacity: i === newSection ? 1 : 0.4,
      duration: 0.4,
      ease: "power2.out"
    });
  });
  categories.forEach((cat, i) => {
    gsap.to(cat, {
      opacity: i === newSection ? 1 : 0.4,
      duration: 0.4,
      ease: "power2.out"
    });
  });
}



      // End section behavior
      ScrollTrigger.create({
        trigger: ".end-section",
        start: "top center",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (self.progress > 0.1) {
            footer.classList.add("blur");
            leftColumn.classList.add("blur");
            rightColumn.classList.add("blur");
            featured.classList.add("blur");
          } else {
            footer.classList.remove("blur");
            leftColumn.classList.remove("blur");
            rightColumn.classList.remove("blur");
            featured.classList.remove("blur");
          }
          if (self.progress > 0.1) {
            const newHeight = Math.max(0, 100 - ((self.progress - 0.1) / 0.9) * 100);
            gsap.to(fixedContainer, { height: `${newHeight}vh`, duration: 0.1, ease: "power1.out" });
            const moveY = (-(self.progress - 0.1) / 0.9) * 200;
            gsap.to(header, { y: moveY * 1.5, duration: 0.1, ease: "power1.out" });
            gsap.to(content, { y: `calc(${moveY}px + (-50%))`, duration: 0.1, ease: "power1.out" });
            gsap.to(footer, { y: moveY * 0.5, duration: 0.1, ease: "power1.out" });
          } else {
            gsap.to(fixedContainer, { height: "100vh", duration: 0.1, ease: "power1.out" });
            gsap.to(header, { y: 0, duration: 0.1, ease: "power1.out" });
            gsap.to(content, { y: "-50%", duration: 0.1, ease: "power1.out" });
            gsap.to(footer, { y: 0, duration: 0.1, ease: "power1.out" });
          }
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "h") {
          const dbg = document.getElementById("debug-info");
          dbg.style.display = dbg.style.display === "none" ? "block" : "none";
        }
      });

      updateProgressNumbers();
    }

    // cleanup
    return () => {
      try {
        ScrollTrigger.getAll().forEach(s => s.kill());
        if (lenis && lenis.destroy) lenis.destroy();
      } catch (e) {}
    };
  }, []);

  // ✅ Background toggle fix — ensures correct image shows

  // Render DOM using Tailwind classes for layout/typography.
  return (
    <div className="w-full antialiased font-primary text-black">
      {/* loading */}
      <div id="loading-overlay" className="loading-overlay">Loading <span id="loading-counter" className="loading-counter ml-2">[00]</span></div>

      <div id="debug-info" className="debug-info fixed bottom-2 right-2 bg-white/70 text-black p-2 text-xs font-mono">Current Section: 0</div>

      <div id="scroll-container" className="relative bg-white">
        <div className="fixed-section" id="fixed-section" style={{ height: "1100vh", backgroundColor: "#fff" }}>
          <div className="fixed-container" id="fixed-container" style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
            <div className="background-container absolute inset-0 z-0" id="background-container">
            {Array.from({ length: 10 }).map((_, i) => (
                <img
                key={i}
                className={`background-image ${i === 0 ? "active" : ""}`}
                src={`https://assets.codepen.io/7558/flame-glow-blur-00${i + 1}.jpg`}
                alt={`background-${i + 1}`}
                />
            ))}
            </div>


            {/* content grid (using Tailwind) */}
            <div className="grid-container relative z-10 grid grid-cols-12 gap-4 px-8 h-full">
              <div className="header col-span-12 pt-[5vh] text-center leading-[0.8] text-[10vw] text-text-custom header">
                <div className="header-row">The Creative</div>
                <div className="header-row">Process</div>
                <div className="header-row">Beyond</div>
                <div className="header-row">Thinking</div>
              </div>

              <div className="content col-span-12 flex justify-between items-center absolute top-1/2 left-0 transform -translate-y-1/2 w-full px-8">
                <div id="left-column" className="left-column w-[40%] flex flex-col gap-1 text-left">
                  <div className="artist active text-text-custom cursor-pointer" id="artist-0" data-index="0">Silence</div>
                  <div className="artist text-text-custom cursor-pointer" id="artist-1" data-index="1">Meditation</div>
                  <div className="artist text-text-custom cursor-pointer" id="artist-2" data-index="2">Intuition</div>
                  <div className="artist text-text-custom cursor-pointer" id="artist-3" data-index="3">Authenticity</div>
                  <div className="artist text-text-custom cursor-pointer" id="artist-4" data-index="4">Presence</div>
                  <div className="artist text-text-custom cursor-pointer" id="artist-5" data-index="5">Listening</div>
                  <div className="artist text-text-custom cursor-pointer" id="artist-6" data-index="6">Curiosity</div>
                  <div className="artist text-text-custom cursor-pointer" id="artist-7" data-index="7">Patience</div>
                  <div className="artist text-text-custom cursor-pointer" id="artist-8" data-index="8">Surrender</div>
                  <div className="artist text-text-custom cursor-pointer" id="artist-9" data-index="9">Simplicity</div>
                </div>

                <div id="featured" className="featured w-[20%] flex justify-center items-center text-center text-[1.5vw] relative h-[10vh] overflow-hidden">
                  <div className="featured-content active" id="featured-0" data-index="0"><h3 className="whitespace-nowrap">Creative Elements</h3></div>
                  <div className="featured-content" id="featured-1" data-index="1"><h3 className="whitespace-nowrap">Inner Stillness</h3></div>
                  <div className="featured-content" id="featured-2" data-index="2"><h3 className="whitespace-nowrap">Deep Knowing</h3></div>
                  <div className="featured-content" id="featured-3" data-index="3"><h3 className="whitespace-nowrap">True Expression</h3></div>
                  <div className="featured-content" id="featured-4" data-index="4"><h3 className="whitespace-nowrap">Now Moment</h3></div>
                  <div className="featured-content" id="featured-5" data-index="5"><h3 className="whitespace-nowrap">Deep Attention</h3></div>
                  <div className="featured-content" id="featured-6" data-index="6"><h3 className="whitespace-nowrap">Open Exploration</h3></div>
                  <div className="featured-content" id="featured-7" data-index="7"><h3 className="whitespace-nowrap">Calm Waiting</h3></div>
                  <div className="featured-content" id="featured-8" data-index="8"><h3 className="whitespace-nowrap">Let Go Control</h3></div>
                  <div className="featured-content" id="featured-9" data-index="9"><h3 className="whitespace-nowrap">Pure Essence</h3></div>
                </div>

                <div id="right-column" className="right-column w-[40%] flex flex-col gap-1 text-right">
                  <div className="category active text-text-custom cursor-pointer" id="category-0" data-index="0">Reduction</div>
                  <div className="category text-text-custom cursor-pointer" id="category-1" data-index="1">Essence</div>
                  <div className="category text-text-custom cursor-pointer" id="category-2" data-index="2">Space</div>
                  <div className="category text-text-custom cursor-pointer" id="category-3" data-index="3">Resonance</div>
                  <div className="category text-text-custom cursor-pointer" id="category-4" data-index="4">Truth</div>
                  <div className="category text-text-custom cursor-pointer" id="category-5" data-index="5">Feeling</div>
                  <div className="category text-text-custom cursor-pointer" id="category-6" data-index="6">Clarity</div>
                  <div className="category text-text-custom cursor-pointer" id="category-7" data-index="7">Emptiness</div>
                  <div className="category text-text-custom cursor-pointer" id="category-8" data-index="8">Awareness</div>
                  <div className="category text-text-custom cursor-pointer" id="category-9" data-index="9">Minimalism</div>
                </div>
              </div>

              <div className="footer col-span-12 align-end pb-[5vh] text-[10vw] leading-[0.8] text-center text-text-custom" id="footer">
                {/* <div className="header-row">Beyond</div>
                <div className="header-row">Thinking</div> */}

                <div className="progress-indicator w-[160px] h-[1px] mx-auto mt-6 relative bg-white/30">
                  <div className="progress-numbers absolute inset-0 flex justify-between text-[0.7rem] text-text-custom font-primary -translate-y-1/2 mx-[-25px]">
                    <span id="current-section">01</span>
                    <span id="total-sections">10</span>
                  </div>
                  <div id="progress-fill" className="absolute top-0 left-0 h-full bg-[rgba(245,245,245,0.9)]" style={{ width: "0%" }}></div>
                </div>
              </div>
            </div> {/* grid-container */}
          </div> {/* fixed-container */}
        </div> {/* fixed-section */}

        <div className="end-section h-screen flex items-center justify-center bg-white">
          <p className="fin rotate-90 relative top-0 text-2xl">fin</p>
        </div>
      </div>
    </div>
  );
}
