# 🎨 Scroll Section Animation (React + GSAP + Lenis)

This project is a smooth interactive scrolling animation built using **React**, **GSAP**, and **Lenis**.  
It replicates the experience of a **CodePen-style creative showcase**, complete with animated text, dynamic background transitions, and ambient sound effects.

---

## 🚀 Features

✅ **Smooth Scroll** using [Lenis](https://github.com/studio-freight/lenis)  
✅ **ScrollTrigger Animations** for seamless section transitions  
✅ **Background Crossfade** with GSAP (no white flashes)  
✅ **Sound Effects** on hover, click, and text change  
✅ **Section Snap Scroll** behavior  
✅ **Loading Screen Animation**  
✅ **Responsive Layout** with TailwindCSS  
✅ **Debug Mode Toggle** (Press **H** key)

---

## 🧠 Project Structure

```
src/
 ├─ components/
 │   ├─ ScrollSection.js      # Main animation component
 │   └─ ScrollSection.css     # Styling and transitions
 ├─ App.js                    # Main entry component
 ├─ index.js                  # ReactDOM render file
 └─ assets/                   # (optional) for local images or audio
```

---

## ⚙️ Installation & Setup

1. **Clone this repository**
   ```bash
   git clone https://github.com/your-username/scroll-animation-react.git
   cd scroll-animation-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 🧩 Dependencies

| Library | Purpose |
|----------|----------|
| **React** | Core frontend framework |
| **GSAP** | Animation engine |
| **ScrollTrigger** | Scroll-based animation trigger |
| **Lenis** | Smooth scroll controller |
| **CustomEase & SplitText** | Advanced GSAP easing and text effects |
| **Tailwind CSS** | Styling framework |

---

## 🔊 Sound Effects

This project includes small ambient sound effects (from CodePen’s asset library):

| Type | File | Volume |
|------|------|---------|
| Hover | `click-reverb-001.mp3` | 0.15 |
| Click | `shutter-fx-001.mp3` | 0.3 |
| Text Change | `whoosh-fx-001.mp3` | 0.3 |

Sounds only play **after the user interacts** with the page (browser requirement).

---

## 🖼️ Background Images

Images are loaded dynamically from:
```
https://assets.codepen.io/7558/flame-glow-blur-00X.jpg
```

Each section fades smoothly between images to prevent any **white screen flashes**.

If you prefer local images, save them in `/src/assets/` and update this line in `ScrollSection.js`:
```js
src={`/assets/your-image-${i + 1}.jpg`}
```

---

## 🧭 Controls

- **Scroll** to navigate between sections  
- **Click** on artist or category names to jump directly  
- **Press `H`** to toggle debug info  
- **Wait** for the loading screen to finish before interacting  

---

## 🪄 Troubleshooting

If you see a **white screen**:
1. Make sure images are loading (check browser console → Network tab).  
2. Ensure `.background-image` has `position: absolute` and `opacity` transitions in your CSS.  
3. Verify that the **first image** is visible (`opacity: 1`) on load.  
4. Check GSAP version — must be **3.12.0 or later**.  

---

## 🧑‍🎨 Credits

- **Original Concept** inspired by creative CodePen demos  
- **Author:** Your Name  
- **Libraries:** GSAP, Lenis, TailwindCSS  

---


